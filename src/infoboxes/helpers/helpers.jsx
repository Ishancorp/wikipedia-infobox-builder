import allFieldTypes from '../../jsons/allFieldTypes.json';

const parseTextWithSpans = (text) => {
  const placeholder = "__AST__";
  const safeText = text.replace(/\\\*/g, placeholder);

  const parseSegment = (segment) => {
    if (!segment) return null;

    // 1. Escaped superscript: \^{...}
    const escapedSupMatch = segment.match(/\\\^\{([^}]+)\}/);
    if (escapedSupMatch) {
      const before = segment.slice(0, escapedSupMatch.index);
      const raw = `^{${escapedSupMatch[1]}}`;
      const after = segment.slice(escapedSupMatch.index + escapedSupMatch[0].length);
      return (
        <>
          {parseSegment(before)}
          {raw}
          {parseSegment(after)}
        </>
      );
    }

    // 2. Real superscript: ^{...}
    const supMatch = segment.match(/\^\{([^}]+)\}/);
    if (supMatch) {
      const before = segment.slice(0, supMatch.index);
      const after = segment.slice(supMatch.index + supMatch[0].length);
      return (
        <>
          {parseSegment(before)}
          <sup>{parseSegment(supMatch[1])}</sup>
          {parseSegment(after)}
        </>
      );
    }

    // 3. Escaped caret: \^
    if (segment.includes("\\^")) {
      return segment.replace(/\\\^/g, "^");
    }

    // 4. Handle {{...}} markers
    const curlyRegex = /\{\{\s*(color\s*\|[^|]+\|[^}]+|increase|decrease)\s*\}\}/;
    const curlyMatch = segment.match(curlyRegex);
    if (curlyMatch) {
      const before = segment.slice(0, curlyMatch.index);
      const marker = curlyMatch[1].trim();
      const after = segment.slice(curlyMatch.index + curlyMatch[0].length);

      if (/^color/i.test(marker)) {
        // {{ color | #hex | text }}
        const [, color, innerText] =
          marker.match(/^color\s*\|\s*([^|]+)\s*\|\s*(.+)$/i) || [];
        return (
          <>
            {parseSegment(before)}
            <span style={{ color: color?.trim() }}>
              {parseSegment(innerText?.trim())}
            </span>
            {parseSegment(after)}
          </>
        );
      }

      if (marker === "increase") {
        return (
          <>
            {parseSegment(before)}
            <span className="increase">▲</span>
            {parseSegment(after)}
          </>
        );
      }

      if (marker === "decrease") {
        return (
          <>
            {parseSegment(before)}
            <span className="decrease">▼</span>
            {parseSegment(after)}
          </>
        );
      }
    }

    // 5. Bold/italic/linktext markers
    const markers = [
      { regex: /\*([^*]+)\*/, className: "linktext" },
      { regex: /'''([^']+)'''/, tag: "strong" },
      { regex: /''([^']+)''/, tag: "em" },
    ];

    let earliestMatch = null;
    let earliestIndex = Infinity;
    let matchedMarker = null;

    markers.forEach((marker) => {
      const match = segment.match(marker.regex);
      if (match && match.index < earliestIndex) {
        earliestMatch = match;
        earliestIndex = match.index;
        matchedMarker = marker;
      }
    });

    if (earliestMatch) {
      const before = segment.slice(0, earliestIndex);
      const matchedText = earliestMatch[1];
      const after = segment.slice(earliestIndex + earliestMatch[0].length);

      const parsedInner = parseSegment(matchedText);
      let wrappedContent;

      if (matchedMarker.className) {
        wrappedContent = (
          <span className={matchedMarker.className}>{parsedInner}</span>
        );
      } else {
        const Tag = matchedMarker.tag;
        wrappedContent = <Tag>{parsedInner}</Tag>;
      }

      return (
        <>
          {parseSegment(before)}
          {wrappedContent}
          {parseSegment(after)}
        </>
      );
    }

    // 6. Plain text: restore placeholders & replace --
    return segment
      .replace(new RegExp(placeholder, "g"), "*")
      .replace(/--/g, "—");
  };

  return parseSegment(safeText);
};

const handleImageUpload = (file, fieldId, updateFunction) => {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateFunction(fieldId, e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

const handleGroupImageUpload = (file, groupId, childId, updateGroupChildFunction) => {
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      updateGroupChildFunction(groupId, childId, e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

const getDefaultValue = (type) => {
  switch (type) {
    case 'text': 
    case 'singletext':
    case 'line':
    case 'subheader':
    case 'image':
    case 'inlineimage':
    case 'thumbnail':
      return '';
    
    case 'color': 
      return '#FFFFFF';
    
    case 'electionheader':
    case 'electionfooter':
      return { first: '', middle: '', last: '' };
    
    case 'date': 
      return new Date().toLocaleDateString();
    
    case 'link': 
      return { text: 'Link Text', url: 'https://example.com' };
    
    case 'list':
    case 'treelist':
      return ['Item 1', 'Item 2'];
    
    case 'group': 
      return 'Group Title';
    
    case 'electoral': 
      return { title: 'Electoral Title', columns: 1, columnData: [{}] };
    
    default: 
      return '';
  }
};

const createTypePositionMapping = (elementsData) => {
  const mapping = {};
  
  elementsData.forEach(element => {
    mapping[element.type] = element.position;
  });
  
  return mapping;
};

const templateHandlers = {
  group: {
    getValue: (template) => template.label.replace(' Template', ''),
    getCaption: () => "",
    getShowCaption: () => false,
    mapChild: (child, baseId, index, typePositionMap) => ({
      id: baseId + index + 1,
      type: child.type,
      label: child.label,
      // Use the position from the elements mapping based on type
      position: typePositionMap[child.type] || child.position || 'normal',
      value: child.value || getDefaultValue(child.type),
      caption: child.caption || "",
      showCaption: child.showCaption || false,
      parentGroup: baseId
    })
  },
  electoral: {
    getValue: (template) => ({
      title: template.value?.title || template.label.replace(' Template', ''),
      columns: template.value?.columns || 2,
      columnData: template.value?.columnData || [{}, {}]
    }),
    getCaption: (template) => template.caption || "",
    getShowCaption: (template) => template.showCaption || false,
    mapChild: (child, baseId, index, typePositionMap) => ({
      id: baseId + index + 1,
      type: child.type,
      label: child.label,
      // Use the position from the elements mapping based on type
      position: typePositionMap[child.type] || child.position || 'normal',
      value: child.value || getDefaultValue(child.type),
      caption: child.caption || "",
      showCaption: child.showCaption || false,
      parentGroup: baseId,
      columnIndex: child.columnIndex !== undefined ? child.columnIndex : 0
    })
  }
};

// Universal function that handles both templates and regular elements
export const generateField = (item, toJSON) => {
  const baseId = Date.now();
  
  // If it's a template, process it with the template system
  if (item.isTemplate || item.type === 'electoral-template' || item.type === 'group-template') {
    // Determine which elements list to use based on template context
    let elementsData;
    if (toJSON !== '') {
      elementsData = allFieldTypes[toJSON].find(section => section.type === 'Elements')?.list || [];
    }
    else if (allFieldTypes.Biography && allFieldTypes.Election) {
      // If we have both, determine based on template type or content
      if (item.type === 'electoral-template' || item.position === 'electoral') {
        elementsData = allFieldTypes.Election.find(section => section.type === 'Elements')?.list || [];
      } else {
        elementsData = allFieldTypes.Biography.find(section => section.type === 'Elements')?.list || [];
      }
    } else {
      // Fallback to whichever is available
      const availableData = allFieldTypes.Biography || allFieldTypes.Election || allFieldTypes;
      elementsData = availableData.find(section => section.type === 'Elements')?.list || [];
    }
    
    // Create the type-to-position mapping from the appropriate elements data
    const typePositionMap = createTypePositionMapping(elementsData);
    
    // Determine template type based on the JSON data
    const templateType = item.type === 'electoral-template' || 
                        item.position === 'electoral' ? 'electoral' : 'group';
    
    const handler = templateHandlers[templateType];
    
    return {
      id: baseId,
      type: templateType,
      label: item.label.replace(' Template', ''),
      position: templateType,
      value: handler.getValue(item),
      caption: handler.getCaption(item),
      showCaption: handler.getShowCaption(item),
      parentGroup: null,
      isCollapsed: item.isCollapsed || false,
      children: item.children.map((child, index) => 
        handler.mapChild(child, baseId, index, typePositionMap)
      )
    };
  }
  
  // If it's a regular element, create a simple field with correct position mapping
  let elementsData;
  if (allFieldTypes.Biography && allFieldTypes.Election) {
    // Default to Biography elements for regular items, unless it's electoral type
    if (item.type === 'electoral') {
      elementsData = allFieldTypes.Election.find(section => section.type === 'Elements')?.list || [];
    } else {
      elementsData = allFieldTypes.Biography.find(section => section.type === 'Elements')?.list || [];
    }
  } else {
    const availableData = allFieldTypes.Biography || allFieldTypes.Election || allFieldTypes;
    elementsData = availableData.find(section => section.type === 'Elements')?.list || [];
  }
  
  const typePositionMap = createTypePositionMapping(elementsData);
  
  return {
    id: baseId,
    type: item.type,
    label: item.label,
    position: typePositionMap[item.type] || item.position || 'normal',
    value: getDefaultValue(item.type),
    caption: item.caption || "",
    showCaption: item.showCaption || false,
    parentGroup: null,
    children: ['group', 'electoral'].includes(item.type) ? [] : undefined,
    columns: item.type === 'electoral' ? 1 : undefined,
    isCollapsed: false
  };
};

export default { parseTextWithSpans, handleImageUpload, handleGroupImageUpload, getDefaultValue, generateField };
