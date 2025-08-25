const parseTextWithSpans = (text) => {
  // Replace escaped asterisks with a placeholder
  const placeholder = "__AST__";
  const safeText = text.replace(/\\\*/g, placeholder);

  const parseSegment = (segment) => {
    // Handle escaped superscript: \^{...} -> raw ^{...}
    const escapedSupMatch = segment.match(/\\\^\{([^}]+)\}/);
    if (escapedSupMatch) {
      const before = segment.slice(0, escapedSupMatch.index);
      const raw = `^{${escapedSupMatch[1]}}`; // keep it literal
      const after = segment.slice(escapedSupMatch.index + escapedSupMatch[0].length);
      return (
        <>
          {before && parseSegment(before)}
          {raw}
          {after && parseSegment(after)}
        </>
      );
    }

    // Handle real superscript: ^{...}
    const supMatch = segment.match(/\^\{([^}]+)\}/);
    if (supMatch) {
      const before = segment.slice(0, supMatch.index);
      const after = segment.slice(supMatch.index + supMatch[0].length);
      return (
        <>
          {before && parseSegment(before)}
          <sup>{parseSegment(supMatch[1])}</sup>
          {after && parseSegment(after)}
        </>
      );
    }

    // Handle escaped caret: \^ -> ^
    if (segment.includes("\\^")) {
      return segment.replace(/\\\^/g, "^");
    }

    // Find the first occurrence of any marker
    const markers = [
      { regex: /\*([^*]+)\*/, className: "linktext", length: 1 },
      { regex: /'''([^']+)'''/, tag: "strong", length: 3 },
      { regex: /''([^'']+)''/, tag: "em", length: 2 }
    ];

    // Find the earliest marker
    let earliestMatch = null;
    let earliestIndex = Infinity;
    let matchedMarker = null;

    markers.forEach(marker => {
      const match = segment.match(marker.regex);
      if (match && match.index < earliestIndex) {
        earliestMatch = match;
        earliestIndex = match.index;
        matchedMarker = marker;
      }
    });

    if (!earliestMatch) {
      // No markers found, return plain text with placeholders restored
      return segment.replace(new RegExp(placeholder, "g"), "*").replace(/--/g, "—");
    }

    const beforeMatch = segment.slice(0, earliestIndex);
    const matchedText = earliestMatch[1];
    const afterMatch = segment.slice(earliestIndex + earliestMatch[0].length);

    const parsedInner = parseSegment(matchedText);
    
    let wrappedContent;
    if (matchedMarker.className) {
      wrappedContent = <span className={matchedMarker.className}>{parsedInner}</span>;
    } else {
      const Tag = matchedMarker.tag;
      wrappedContent = <Tag>{parsedInner}</Tag>;
    }

    return (
      <>
        {beforeMatch && parseSegment(beforeMatch)}
        {wrappedContent}
        {afterMatch && parseSegment(afterMatch)}
      </>
    );
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

export default { parseTextWithSpans, handleImageUpload, handleGroupImageUpload };
