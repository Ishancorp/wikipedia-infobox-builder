import React, { useState, useRef } from 'react';
import './ElectionBuilderPreview.css';
import '../css/WikiboxBuilderField.css';

const ElectionBuilder = () => {
  const [fields, setFields] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [title, setTitle] = useState('');
  const dragCounter = useRef(0);
  const [electoralColumnViews, setElectoralColumnViews] = useState({});

  const fieldTypes = [
    { 
      type: 'group-template', 
      position: 'group', 
      label: 'Top Header Template', 
      icon: '📄',
      isTemplate: true,
      children: [
        { type: 'thumbnail', label: 'Thumbnail', value: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Flag_of_Liberia.svg' },
        { type: 'line', label: 'Line', value: '--' },
        { type: 'electionheader', label: 'Election Header', value: {first: '*2004*', middle: 'November 4, 2008', last: '*2012*'}},
        { type: 'line', label: 'Line', value: '--' },
        { type: 'singletext', label: 'Single Text', value: '538 members of the *Electoral College*\n270 electoral votes needed to win'},
        { type: 'singletext', label: 'Single Text', value: '*Opinion polls*'},
      ]
    },
    { type: 'electoral', position: 'electoral', label: 'Electoral', icon: '📁' },
    { type: 'group', position: 'group', label: 'Group', icon: '📁' },
    { type: 'text', position: 'normal', label: 'Text Field', icon: '📝' },
    { type: 'singletext', position: 'single', label: 'Single Text', icon: '📝' },
    { type: 'line', position: 'single', label: 'Line', icon: '—' },
    { type: 'electionheader', position: 'ternary', label: 'Election Header', icon: '📝' },
    { type: 'subheader', position: 'subheader', label: 'Subheader', icon: '📝' },
    { type: 'image', position: 'image', label: 'Image', icon: '🖼️' },
    { type: 'thumbnail', position: 'image', label: 'Thumbnail', icon: '🖼️' },
    { type: 'inlineimage', position: 'normal', label: 'Inline Image', icon: '🖼️' },
    { type: 'date', position: 'normal', label: 'Date', icon: '📅' },
    { type: 'list', position: 'normal', label: 'List', icon: '📋' },
    { type: 'treelist', position: 'normal', label: 'Tree List', icon: '📋' },
    { type: 'link', position: 'normal', label: 'Link', icon: '🔗' },
  ];

  const handleDragStart = (e, fieldType) => {
    setDraggedItem(fieldType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    
    if (draggedItem) {
      let newField;
      
      // Check if it's a template
      if (draggedItem.isTemplate) {
        newField = generateTemplateGroup(draggedItem);
      } else {
        // Handle regular fields as before
        newField = {
          id: Date.now(),
          type: draggedItem.type,
          label: draggedItem.label,
          position: draggedItem.position,
          value: getDefaultValue(draggedItem.type),
          caption: "",
          showCaption: false,
          parentGroup: null,
          children: draggedItem.type === 'group' || draggedItem.type === 'electoral' ? [] : undefined,
          columns: draggedItem.type === 'electoral' ? 1 : undefined,
          isCollapsed: false
        };
      }
      
      setFields([...fields, newField]);
      setDraggedItem(null);
    }
  };

  const getDefaultValue = (type) => {
    switch (type) {
      case 'text': return '';
      case 'singletext': return '';
      case 'line': return '';
      case 'electionheader': return {first: '', middle: '', last: ''};
      case 'subheader': return '';
      case 'image': return '';
      case 'inlineimage': return '';
      case 'thumbnail': return '';
      case 'date': return new Date().toLocaleDateString();
      case 'list': return ['Item 1', 'Item 2'];
      case 'treelist': return ['Item 1', 'Item 2'];
      case 'link': return { text: 'Link Text', url: 'https://example.com' };
      case 'group': return 'Group Title';
      case 'electoral': return { title: 'Electoral Title', columns: 1, columnData: [{}] };
      default: return '';
    }
  };// Add this helper before the component return

  const parseTextWithSpans = (text) => {
    // Replace escaped asterisks with a placeholder
    const placeholder = "__AST__";
    const safeText = text.replace(/\\\*/g, placeholder);

    const parseSegment = (segment) => {
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
        return segment.replace(new RegExp(placeholder, "g"), "*").replace(/--/g, "–");
      }

      const beforeMatch = segment.slice(0, earliestIndex);
      const matchedText = earliestMatch[1]; // Content inside the markers
      const afterMatch = segment.slice(earliestIndex + earliestMatch[0].length);

      // Recursively parse the content inside the markers
      const parsedInner = parseSegment(matchedText);
      
      // Create the appropriate element
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

  const addFieldToGroup = (groupId, fieldType) => {
    // Find the parent field to determine if it's electoral
    const parentField = fields.find(field => field.id === groupId);
    const isElectoral = parentField && parentField.type === 'electoral';
    
    const newField = {
      id: Date.now(),
      type: fieldType.type,
      label: fieldType.label,
      position: fieldType.position,
      value: getDefaultValue(fieldType.type),
      caption: "",
      showCaption: false,
      parentGroup: groupId,
      // Add columnIndex for electoral fields
      ...(isElectoral && { columnIndex: electoralColumnViews[groupId] || 0 })
    };
    
    setFields(fields.map(field => 
      field.id === groupId 
        ? { ...field, children: [...(field.children || []), newField] }
        : field
    ));
  };

  const toggleGroupCollapse = (groupId) => {
    setFields(fields.map(field => 
      field.id === groupId 
        ? { ...field, isCollapsed: !field.isCollapsed }
        : field
    ));
  };

  const updateGroupChild = (groupId, childId, newValue) => {
    setFields(fields.map(field => 
      field.id === groupId 
        ? { 
            ...field, 
            children: field.children.map(child => 
              child.id === childId 
                ? { ...child, value: newValue } // columnIndex is preserved automatically
                : child
            )
          }
        : field
    ));
  };

  const updateField = (id, newValue) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, value: newValue } : field
    ));
  };

  const updateCaption = (id, newCaption) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, caption: newCaption } : field
    ));
  };

  const toggleCaption = (id, checked) => {
    setFields(fields.map(field =>
      field.id === id ? { ...field, showCaption: checked } : field
    ));
  };

  const updateFieldLabel = (id, newLabel) => {
    setFields(fields.map(field => 
      field.id === id ? { ...field, label: newLabel } : field
    ));
  };

  const removeField = (id) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const moveField = (fromIndex, toIndex) => {
    const newFields = [...fields];
    const [movedField] = newFields.splice(fromIndex, 1);
    newFields.splice(toIndex, 0, movedField);
    setFields(newFields);
  };

  const moveFieldBetweenColumns = (groupId, fieldId, fromColumn, toColumn) => {
    setFields(fields.map(field => 
      field.id === groupId 
        ? { 
            ...field, 
            children: field.children.map(child => 
              child.id === fieldId 
                ? { ...child, columnIndex: toColumn }
                : child
            )
          }
        : field
    ));
  };

  const duplicateFieldToColumn = (groupId, fieldId, targetColumn) => {
    const parentField = fields.find(field => field.id === groupId);
    const sourceField = parentField.children.find(child => child.id === fieldId);
    
    if (!sourceField) return;
    
    const duplicatedField = {
      ...sourceField,
      id: Date.now(),
      columnIndex: targetColumn,
      value: getDefaultValue(sourceField.type) // Start with default value
    };
    
    setFields(fields.map(field => 
      field.id === groupId 
        ? { ...field, children: [...field.children, duplicatedField] }
        : field
    ));
  };

  const moveFieldInGroup = (groupId, fromIndex, toIndex) => {
    const parentField = fields.find(field => field.id === groupId);
    const isElectoral = parentField && parentField.type === 'electoral';
    
    if (isElectoral) {
      // For electoral fields, only move within the current column
      const currentColumn = electoralColumnViews[groupId] || 0;
      const currentColumnChildren = getElectoralColumnChildren(parentField, currentColumn);
      
      if (fromIndex >= currentColumnChildren.length || toIndex >= currentColumnChildren.length) {
        return; // Invalid indices for current column
      }
      
      // Get all children and find the actual indices of the fields being moved
      const allChildren = parentField.children || [];
      const fromField = currentColumnChildren[fromIndex];
      const toField = currentColumnChildren[toIndex];
      
      const actualFromIndex = allChildren.findIndex(child => child.id === fromField.id);
      const actualToIndex = allChildren.findIndex(child => child.id === toField.id);
      
      const newChildren = [...allChildren];
      const [movedField] = newChildren.splice(actualFromIndex, 1);
      newChildren.splice(actualToIndex, 0, movedField);
      
      setFields(fields.map(field => 
        field.id === groupId 
          ? { ...field, children: newChildren }
          : field
      ));
    } else {
      // For regular groups, use the existing logic
      setFields(fields.map(field => 
        field.id === groupId 
          ? { 
              ...field, 
              children: (() => {
                const newChildren = [...field.children];
                const [movedField] = newChildren.splice(fromIndex, 1);
                newChildren.splice(toIndex, 0, movedField);
                return newChildren;
              })()
            }
          : field
      ));
    }
  };

  const updateGroupChildLabel = (groupId, childId, newLabel) => {
    setFields(fields.map(field => 
      field.id === groupId 
        ? { 
            ...field, 
            children: field.children.map(child => 
              child.id === childId 
                ? { ...child, label: newLabel } // columnIndex is preserved automatically
                : child
            )
          }
        : field
    ));
  };

  const generateTemplateGroup = (template) => {
    const baseId = Date.now();
    const groupField = {
      id: baseId,
      type: 'group',
      label: template.label.replace(' Template', ''),
      position: 'group',
      value: template.label.replace(' Template', ''),
      caption: "",
      showCaption: false,
      parentGroup: null,
      isCollapsed: false,
      children: template.children.map((child, index) => ({
        id: baseId + index + 1,
        type: child.type,
        label: child.label,
        position: child.position || (child.type === 'subheader' ? 'subheader' : child.type === 'singletext' ? 'single' : 'normal'),
        value: child.value || getDefaultValue(child.type),
        caption: "",
        showCaption: false,
        parentGroup: baseId
      }))
    };
    
    return groupField;
  };

  const ensureColumnData = (field, columnCount) => {
    const columnData = field.value.columnData || [];
    while (columnData.length < columnCount) {
      columnData.push({});
    }
    return columnData.slice(0, columnCount);
  };

  const addFieldToElectoralColumn = (electoralId, fieldType, columnIndex) => {
    const newField = {
      id: Date.now(),
      type: fieldType.type,
      label: fieldType.label,
      position: fieldType.position,
      value: getDefaultValue(fieldType.type),
      caption: "",
      showCaption: false,
      parentGroup: electoralId,
      columnIndex: columnIndex
    };
    
    setFields(fields.map(field => 
      field.id === electoralId 
        ? { ...field, children: [...(field.children || []), newField] }
        : field
    ));
  };

  const getElectoralColumnChildren = (field, columnIndex) => {
    return (field.children || []).filter(child => 
      (child.columnIndex ?? 0) === columnIndex
    );
  };

  const removeFieldFromGroup = (groupId, fieldId) => {
    setFields(fields.map(field => 
      field.id === groupId 
        ? { ...field, children: field.children.filter(child => child.id !== fieldId) }
        : field
    ));
  };

  const renderElectoralChildControls = (field, child, childIndex, currentColumn, columnChildren) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {/* Standard move up/down within current column */}
        {childIndex > 0 && (
          <button
            className='move-btn'
            onClick={() => moveFieldInGroup(field.id, childIndex, childIndex - 1)}
            title="Move up in column"
          >
            ↑
          </button>
        )}
        {childIndex < columnChildren.length - 1 && (
          <button
            className='move-btn'
            onClick={() => moveFieldInGroup(field.id, childIndex, childIndex + 1)}
            title="Move down in column"
          >
            ↓
          </button>
        )}
        
        {/* Column management buttons - only show if multiple columns exist */}
        {parseInt(field.value.columns) > 1 && (
          <>
            <button
              className='move-btn'
              onClick={() => duplicateFieldToColumn(field.id, child.id, (currentColumn + 1) % parseInt(field.value.columns))}
              title="Duplicate to next column"
            >
              ⟶
            </button>
            
            {/* Show move to column dropdown if more than 2 columns */}
            {parseInt(field.value.columns) > 2 && (
              <select
                onChange={(e) => moveFieldBetweenColumns(field.id, child.id, currentColumn, parseInt(e.target.value))}
                value={currentColumn}
                style={{ fontSize: '10px', padding: '1px' }}
                title="Move to column"
              >
                {Array.from({ length: parseInt(field.value.columns) }).map((_, i) => (
                  <option key={i} value={i}>Col {i + 1}</option>
                ))}
              </select>
            )}
          </>
        )}
        
        <button
          className='remove-btn'
          onClick={() => removeFieldFromGroup(field.id, child.id)}
        >
          ×
        </button>
      </div>
    );
  };

  const renderFieldValue = (field) => {
    switch (field.type) {
      case 'electionheader':
        return (
          <>
            <input
                className="wikibox-field-input wikibox-date-input"
                type="text"
                value={field.value.first}
                onChange={(e) => {
                  const newList = JSON.parse(JSON.stringify(field.value));
                  newList.first = e.target.value;
                  updateField(field.id, newList);
                }}
            />
            <textarea
                className="wikibox-field-input"
                value={field.value.middle}
                onChange={(e) => {
                  const newList = JSON.parse(JSON.stringify(field.value));
                  newList.middle = e.target.value;
                  updateField(field.id, newList);
                }}
                placeholder="Enter text here"
            />
            <input
                className="wikibox-field-input wikibox-date-input"
                type="text"
                value={field.value.last}
                onChange={(e) => {
                  const newList = JSON.parse(JSON.stringify(field.value));
                  newList.last = e.target.value;
                  updateField(field.id, newList);
                }}
            />
          </>
        );
      case 'singletext':
      case 'text':
        return (
          <textarea
            className="wikibox-field-input"
            value={field.value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder="Enter text here"
          />
        );
      
      case 'line':
        return (<></>);
      
      case 'subheader':
        return (
          <textarea
            className="wikibox-field-input"
            type='text'
            value={field.value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder="Enter text here"
          />
        );
      
      case 'date':
        return (
          <input
            className="wikibox-field-input wikibox-date-input"
            type="date"
            value={field.value}
            onChange={(e) => updateField(field.id, e.target.value)}
          />
        );
      
      case 'image':
        return (
          <div className="wikibox-image-container">
            <input
              className="wikibox-field-input wikibox-image-input"
              type="url"
              placeholder="Image URL"
              value={field.value}
              onChange={(e) => updateField(field.id, e.target.value)}
            />
            {field.value && (
              <>
                <img 
                  className="wikibox-image"
                  src={field.value} 
                  alt="wikibox" 
                  style={{ maxWidth: '100px', height: 'auto', marginBottom: '4px' }}
                  onError={(e) => e.target.style.display = 'none'}
                />
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <input
                    type="checkbox"
                    checked={field.showCaption}
                    onChange={(e) => toggleCaption(field.id, e.target.checked)}
                  />
                  Show Caption
                </label>
                {field.showCaption && (
                  <input
                    className="wikibox-field-input wikibox-caption-input"
                    type="text"
                    placeholder="Enter caption"
                    value={field.caption}
                    onChange={(e) => updateCaption(field.id, e.target.value)}
                  />
                )}
              </>
            )}
          </div>
        );
      
      case 'thumbnail':
        return (
          <div className="wikibox-image-container">
            <input
              className="wikibox-field-input wikibox-image-input"
              type="url"
              placeholder="Image URL"
              value={field.value}
              onChange={(e) => updateField(field.id, e.target.value)}
            />
            {field.value && (
              <img 
                className="wikibox-image"
                src={field.value} 
                alt="wikibox" 
                style={{ maxWidth: '50px', height: 'auto', marginBottom: '4px' }}
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
          </div>
        );
      
      case 'inlineimage':
        return (
          <div className="wikibox-image-container">
            <input
              className="wikibox-field-input wikibox-image-input"
              type="url"
              placeholder="Image URL"
              value={field.value}
              onChange={(e) => updateField(field.id, e.target.value)}
            />
            {field.value && (
              <img 
                className="wikibox-image"
                src={field.value} 
                alt="wikibox" 
                style={{ maxWidth: '50px', height: 'auto', marginBottom: '4px' }}
                onError={(e) => e.target.style.display = 'none'}
              />
            )}
          </div>
        );
      
      case 'treelist':
      case 'list':
        return (
          <div className="wikibox-list-container">
            {field.value.map((item, index) => (
              <div key={index} className="wikibox-list-item" style={{ display: 'flex', marginBottom: '2px' }}>
                <input
                  className="wikibox-field-input wikibox-list-input"
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newList = [...field.value];
                    newList[index] = e.target.value;
                    updateField(field.id, newList);
                  }}
                  style={{ flex: 1 }}
                />
                <button
                  className="remove-btn"
                  onClick={() => {
                    const newList = field.value.filter((_, i) => i !== index);
                    updateField(field.id, newList);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              className="wikibox-list-add-btn"
              onClick={() => updateField(field.id, [...field.value, 'New item'])}
            >
              + Add Item
            </button>
          </div>
        );
      
      case 'link':
        return (
          <div className="wikibox-link-container">
            <input
              className="wikibox-field-input wikibox-link-text-input"
              type="text"
              placeholder="Link text"
              value={field.value.text}
              onChange={(e) => updateField(field.id, { ...field.value, text: e.target.value })}
              style={{ marginBottom: '2px' }}
            />
            <input
              className="wikibox-field-input wikibox-link-url-input"
              type="url"
              placeholder="URL"
              value={field.value.url}
              onChange={(e) => updateField(field.id, { ...field.value, url: e.target.value })}
            />
          </div>
        );
      
      case 'electoral':
        { const currentColumn = electoralColumnViews[field.id] || 0;
        const columnCount = parseInt(field.value.columns) || 1;
        
        return (
          <div className="wikibox-group-container">
            <div className="wikibox-group-header">
              <input
                className="wikibox-field-input"
                type="number"
                min="1"
                value={field.value.columns}
                onChange={(e) => {
                  const newColumns = parseInt(e.target.value) || 1;
                  const newColumnData = ensureColumnData(field, newColumns);
                  updateField(field.id, {
                    ...field.value,
                    columns: newColumns,
                    columnData: newColumnData
                  });
                }}
                style={{ flex: 1 }}
              />
              
              {/* Column navigation controls - only show if more than 1 column */}
              {columnCount > 1 && (
                <div style={{ 
                  display: 'flex', 
                  gap: '4px', 
                  marginLeft: '8px',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={() => setElectoralColumnViews({
                      ...electoralColumnViews,
                      [field.id]: Math.max(0, currentColumn - 1)
                    })}
                    disabled={currentColumn === 0}
                    style={{ 
                      padding: '2px 6px', 
                      fontSize: '12px',
                      background: currentColumn === 0 ? '#ccc' : '#fff',
                      border: '1px solid #999',
                      cursor: currentColumn === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    ←
                  </button>
                  <span style={{ 
                    padding: '2px 6px', 
                    fontSize: '12px',
                    minWidth: '60px',
                    textAlign: 'center',
                    background: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '2px'
                  }}>
                    Col {currentColumn + 1}/{columnCount}
                  </span>
                  <button
                    onClick={() => setElectoralColumnViews({
                      ...electoralColumnViews,
                      [field.id]: Math.min(columnCount - 1, currentColumn + 1)
                    })}
                    disabled={currentColumn === columnCount - 1}
                    style={{ 
                      padding: '2px 6px', 
                      fontSize: '12px',
                      background: currentColumn === columnCount - 1 ? '#ccc' : '#fff',
                      border: '1px solid #999',
                      cursor: currentColumn === columnCount - 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    →
                  </button>
                </div>
              )}
              
              <button
                onClick={() => toggleGroupCollapse(field.id)}
                style={{ 
                  padding: '4px 8px', 
                  background: '#2196F3', 
                  color: 'white', 
                  border: 'none', 
                  cursor: 'pointer',
                  marginLeft: '8px'
                }}
              >
                {field.isCollapsed ? '▼' : '▲'}
              </button>
            </div>
            
            {!field.isCollapsed && (
              <div 
                className="wikibox-group-drop-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (draggedItem && draggedItem.position === 'normal') {
                    addFieldToElectoralColumn(field.id, draggedItem, currentColumn);
                    setDraggedItem(null);
                  }
                }}
                style={{ 
                  minHeight: '100px', 
                  border: '1px dashed #999', 
                  padding: '8px', 
                  background: '#f9f9f9',
                  marginBottom: '8px'
                }}
              >
                {/* Show header indicating current column */}
                <div style={{
                  background: '#e3f2fd',
                  padding: '4px 8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: '#1976d2'
                }}>
                  Editing Column {currentColumn + 1} of {columnCount}
                </div>

                {/* Filter and display children for current column only */}
                {getElectoralColumnChildren(field, currentColumn).length > 0 ? (
                  getElectoralColumnChildren(field, currentColumn).map((child, childIndex) => (
                    <div key={child.id} style={{ 
                      marginBottom: '8px', 
                      padding: '8px', 
                      background: 'white', 
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        marginBottom: '4px' 
                      }}>
                        <input
                          type="text"
                          value={child.label}
                          onChange={(e) => updateGroupChildLabel(field.id, child.id, e.target.value)}
                          style={{ 
                            fontWeight: 'bold', 
                            border: 'none', 
                            background: 'transparent', 
                            outline: 'none', 
                            flex: 1 
                          }}
                        />
                        {renderElectoralChildControls(field, child, childIndex, currentColumn, getElectoralColumnChildren(field, currentColumn))}
                      </div>
                      
                      {/* Render the child field's input based on its type */}
                      {(() => {
                        switch (child.type) {
                          case 'text':
                          case 'singletext':
                            return (
                              <textarea
                                className="wikibox-field-input"
                                value={child.value}
                                onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                                placeholder="Enter text here"
                              />
                            );
                          
                          case 'line':
                            return (<></>);
                          
                          case 'electionheader':
                            return (
                              <>
                                <input
                                  className="wikibox-field-input wikibox-date-input"
                                  type="text"
                                  value={child.value.first || ''}
                                  onChange={(e) => {
                                    const newList = JSON.parse(JSON.stringify(child.value));
                                    newList.first = e.target.value;
                                    updateGroupChild(field.id, child.id, newList);
                                  }}
                                  placeholder="Previous election"
                                  style={{ marginBottom: '4px' }}
                                />
                                <textarea
                                  className="wikibox-field-input"
                                  value={child.value.middle || ''}
                                  onChange={(e) => {
                                    const newList = JSON.parse(JSON.stringify(child.value));
                                    newList.middle = e.target.value;
                                    updateGroupChild(field.id, child.id, newList);
                                  }}
                                  placeholder="Current election details"
                                  style={{ marginBottom: '4px' }}
                                />
                                <input
                                  className="wikibox-field-input wikibox-date-input"
                                  type="text"
                                  value={child.value.last || ''}
                                  onChange={(e) => {
                                    const newList = JSON.parse(JSON.stringify(child.value));
                                    newList.last = e.target.value;
                                    updateGroupChild(field.id, child.id, newList);
                                  }}
                                  placeholder="Next election"
                                />
                              </>
                            );
                          
                          case 'subheader':
                            return (
                              <textarea
                                className="wikibox-field-input"
                                value={child.value}
                                onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                                placeholder="Subheader text"
                              />
                            );
                          
                          case 'date':
                            return (
                              <input
                                className="wikibox-field-input wikibox-date-input"
                                type="date"
                                value={child.value}
                                onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                              />
                            );
                          
                          case 'thumbnail':
                            return (
                              <div>
                                <input
                                  className="wikibox-field-input"
                                  type="url"
                                  placeholder="Image URL"
                                  value={child.value}
                                  onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                                  style={{ marginBottom: '4px' }}
                                />
                                {child.value && (
                                  <img 
                                    src={child.value} 
                                    alt="preview" 
                                    style={{ maxWidth: '50px', height: 'auto' }}
                                    onError={(e) => e.target.style.display = 'none'}
                                  />
                                )}
                              </div>
                            );
                          
                          case 'image':
                            return (
                              <div>
                                <input
                                  className="wikibox-field-input"
                                  type="url"
                                  placeholder="Image URL"
                                  value={child.value}
                                  onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                                  style={{ marginBottom: '4px' }}
                                />
                                {child.value && (
                                  <img 
                                    src={child.value} 
                                    alt="preview" 
                                    style={{ maxWidth: '100px', height: 'auto' }}
                                    onError={(e) => e.target.style.display = 'none'}
                                  />
                                )}
                              </div>
                            );
                          
                          case 'inlineimage':
                            return (
                              <div>
                                <input
                                  className="wikibox-field-input"
                                  type="url"
                                  placeholder="Image URL"
                                  value={child.value}
                                  onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                                  style={{ marginBottom: '4px' }}
                                />
                                {child.value && (
                                  <img 
                                    src={child.value} 
                                    alt="preview" 
                                    style={{ maxWidth: '50px', height: 'auto' }}
                                    onError={(e) => e.target.style.display = 'none'}
                                  />
                                )}
                              </div>
                            );
                          
                          case 'treelist':
                          case 'list':
                            return (
                              <div>
                                {(child.value || []).map((item, index) => (
                                  <div key={index} style={{ display: 'flex', marginBottom: '2px' }}>
                                    <input
                                      className="wikibox-field-input"
                                      type="text"
                                      value={item}
                                      onChange={(e) => {
                                        const newList = [...(child.value || [])];
                                        newList[index] = e.target.value;
                                        updateGroupChild(field.id, child.id, newList);
                                      }}
                                      style={{ flex: 1, marginRight: '4px' }}
                                    />
                                    <button
                                      className='remove-btn'
                                      onClick={() => {
                                        const newList = (child.value || []).filter((_, i) => i !== index);
                                        updateGroupChild(field.id, child.id, newList);
                                      }}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                <button
                                  className="wikibox-list-add-btn"
                                  onClick={() => updateGroupChild(field.id, child.id, [...(child.value || []), 'New item'])}
                                >
                                  + Add Item
                                </button>
                              </div>
                            );
                          
                          case 'link':
                            return (
                              <div>
                                <input
                                  className="wikibox-field-input"
                                  type="text"
                                  placeholder="Link text"
                                  value={(child.value || {}).text || ''}
                                  onChange={(e) => updateGroupChild(field.id, child.id, { 
                                    ...(child.value || {}), 
                                    text: e.target.value 
                                  })}
                                  style={{ marginBottom: '2px' }}
                                />
                                <input
                                  className="wikibox-field-input"
                                  type="url"
                                  placeholder="URL"
                                  value={(child.value || {}).url || ''}
                                  onChange={(e) => updateGroupChild(field.id, child.id, { 
                                    ...(child.value || {}), 
                                    url: e.target.value 
                                  })}
                                />
                              </div>
                            );
                          
                          default:
                            return <span>{child.value}</span>;
                        }
                      })()}
                    </div>
                  ))
                ) : (
                  <div style={{ 
                    textAlign: 'center', 
                    color: '#666', 
                    padding: '20px',
                    fontStyle: 'italic'
                  }}>
                    Drop fields here to add to Column {currentColumn + 1}
                  </div>
                )}
              </div>
            )}
          </div>
        ); }
      
      case 'group':
        return (
          <div className="wikibox-group-container">
            <div className="wikibox-group-header">
              <button
                onClick={() => toggleGroupCollapse(field.id)}
                style={{ padding: '4px 8px', background: '#2196F3', color: 'white', border: 'none', cursor: 'pointer' }}
              >
                {field.isCollapsed ? '▼' : '▲'}
              </button>
            </div>
            
            {!field.isCollapsed && (
              <div 
                className="wikibox-group-drop-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (draggedItem && draggedItem.type !== 'group' && draggedItem.type !== 'electoral') {
                    addFieldToGroup(field.id, draggedItem);
                    setDraggedItem(null);
                  }
                }}
                style={{ 
                  minHeight: '100px', 
                  border: '1px dashed #999', 
                  padding: '8px', 
                  background: '#f9f9f9',
                  marginBottom: '8px'
                }}
              >
              {field.children && field.children.length > 0 ? (
                field.children.map((child, childIndex) => (
                  <div key={child.id} style={{ marginBottom: '8px', padding: '8px', background: 'white', border: '1px solid #ddd' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <input
                        type="text"
                        value={child.label}
                        onChange={(e) => updateGroupChildLabel(field.id, child.id, e.target.value)}
                        style={{ fontWeight: 'bold', border: 'none', background: 'transparent', outline: 'none', flex: 1 }}
                      />
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {childIndex > 0 && (
                          <button
                            className='move-btn'
                            onClick={() => moveFieldInGroup(field.id, childIndex, childIndex - 1)}
                          >
                            ↑
                          </button>
                        )}
                        {childIndex < field.children.length - 1 && (
                          <button
                            className='move-btn'
                            onClick={() => moveFieldInGroup(field.id, childIndex, childIndex + 1)}
                          >
                            ↓
                          </button>
                        )}
                        <button
                          className='remove-btn'
                          onClick={() => removeFieldFromGroup(field.id, child.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    {/* Rest of the child rendering code stays the same */}
                    {(() => {
                      switch (child.type) {
                        case 'text':
                        case 'singletext':
                          return (
                            <textarea
                              className="wikibox-field-input"
                              value={child.value}
                              onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                              placeholder="Enter text here"
                            />
                          );
      
                        case 'line':
                          return (<></>);

                        
                        case 'electionheader':
                          return (
                            <>
                              <input
                                className="wikibox-field-input wikibox-date-input"
                                type="text"
                                value={field.value.first}
                                onChange={(e) => {
                                const newList = JSON.parse(JSON.stringify(child.value));
                                newList.first = e.target.value;
                                updateGroupChild(field.id, child.id, newList);
                                }}
                                />
                              <textarea
                                className="wikibox-field-input"
                                value={field.value.middle}
                                onChange={(e) => {
                                const newList = JSON.parse(JSON.stringify(child.value));
                                newList.middle = e.target.value;
                                updateGroupChild(field.id, child.id, newList);
                                }}
                                placeholder="Enter text here"
                              />
                              <input
                                className="wikibox-field-input wikibox-date-input"
                                type="text"
                                value={field.value.last}
                                onChange={(e) => {
                                const newList = JSON.parse(JSON.stringify(field.value));
                                newList.last = e.target.value;
                                updateGroupChild(field.id, newList);
                                }}
                              />
                            </>
                          );
                        
                        case 'subheader':
                          return (
                            <input
                              className="wikibox-field-input"
                              type='text'
                              value={child.value}
                              onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                            />
                          );
                        
                        case 'date':
                          return (
                            <input
                              className="wikibox-field-input"
                              type="date"
                              value={child.value}
                              onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                            />
                          );
                        
                        case 'thumbnail':
                          return (
                            <div>
                              <input
                                className="wikibox-field-input"
                                type="url"
                                placeholder="Image URL"
                                value={child.value}
                                onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                                style={{ marginBottom: '4px' }}
                              />
                              {child.value && (
                                <img 
                                  src={child.value} 
                                  alt="preview" 
                                  style={{ maxWidth: '50px', height: 'auto' }}
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              )}
                            </div>
                          );
                        
                        case 'image':
                          return (
                            <div>
                              <input
                                className="wikibox-field-input"
                                type="url"
                                placeholder="Image URL"
                                value={child.value}
                                onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                                style={{ marginBottom: '4px' }}
                              />
                              {child.value && (
                                <img 
                                  src={child.value} 
                                  alt="preview" 
                                  style={{ maxWidth: '100px', height: 'auto' }}
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              )}
                            </div>
                          );
                        
                        case 'inlineimage':
                          return (
                            <div>
                              <input
                                className="wikibox-field-input"
                                type="url"
                                placeholder="Image URL"
                                value={child.value}
                                onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                                style={{ marginBottom: '4px' }}
                              />
                              {child.value && (
                                <img 
                                  src={child.value} 
                                  alt="preview" 
                                  style={{ maxWidth: '50px', height: 'auto' }}
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              )}
                            </div>
                          );
                        
                        case 'treelist':
                        case 'list':
                          return (
                            <div>
                              {child.value.map((item, index) => (
                                <div key={index} style={{ display: 'flex', marginBottom: '2px' }}>
                                  <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => {
                                      const newList = [...child.value];
                                      newList[index] = e.target.value;
                                      updateGroupChild(field.id, child.id, newList);
                                    }}
                                    style={{ flex: 1, padding: '2px', border: '1px solid #ccc', marginRight: '4px' }}
                                  />
                                  <button
                                    className='remove-btn'
                                    onClick={() => {
                                      const newList = child.value.filter((_, i) => i !== index);
                                      updateGroupChild(field.id, child.id, newList);
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                              <button
                                className="wikibox-list-add-btn"
                                onClick={() => updateGroupChild(field.id, child.id, [...child.value, 'New item'])}
                              >
                                + Add Item
                              </button>
                            </div>
                          );
                        
                        case 'link':
                          return (
                            <div>
                              <input
                                className="wikibox-field-input"
                                type="text"
                                placeholder="Link text"
                                value={child.value.text}
                                onChange={(e) => updateGroupChild(field.id, child.id, { ...child.value, text: e.target.value })}
                                style={{ marginBottom: '2px' }}
                              />
                              <input
                                className="wikibox-field-input"
                                type="url"
                                placeholder="URL"
                                value={child.value.url}
                                onChange={(e) => updateGroupChild(field.id, child.id, { ...child.value, url: e.target.value })}
                              />
                            </div>
                          );
                        
                        default:
                          return <span>{child.value}</span>;
                      }
                    })()}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                  Drop fields here to add to group
                </div>
              )}
              </div>
            )}
          </div>
        );
      
      default:
        return <span className="wikibox-field-value">{field.value}</span>;
    }
  };

  const renderPreviewValue = (field) => {
    switch (field.type) {
      case 'thumbnail':
        return field.value ? (
          <div style={{ textAlign: 'center' }}>
            <img 
              className="wikibox-preview-image"
              src={field.value} 
              alt="Preview" 
              style={{ maxWidth: '50px', height: 'auto' }}
              onError={(e) => e.target.style.display = 'none'}
            />
            {field.showCaption && field.caption && (
              <div className="wikibox-preview-caption">
                {parseTextWithSpans(field.caption)}
              </div>
            )}
          </div>
        ) : 'No image';
      
      case 'line':
        return <hr/>;
      
      case 'image':
        return field.value ? (
          <div style={{ textAlign: 'center' }}>
            <img 
              className="wikibox-preview-image"
              src={field.value} 
              alt="Preview" 
              style={{ maxWidth: '100%', height: 'auto' }}
              onError={(e) => e.target.style.display = 'none'}
            />
            {field.showCaption && field.caption && (
              <div className="wikibox-preview-caption">
                {parseTextWithSpans(field.caption)}
              </div>
            )}
          </div>
        ) : 'No image';
      
      case 'inlineimage':
        return field.value ? (
          <div style={{ textAlign: 'center' }}>
            <img 
              className="wikibox-preview-image"
              src={field.value} 
              alt="Preview" 
              style={{ maxWidth: '150px', height: 'auto' }}
              onError={(e) => e.target.style.display = 'none'}
            />
            {field.showCaption && field.caption && (
              <div className="wikibox-preview-caption">
                {parseTextWithSpans(field.caption)}
              </div>
            )}
          </div>
        ) : 'No image';
      
      case 'list':
        return (
          <ul className="wikibox-preview-list" style={{ margin: 0, paddingLeft: '16px' }}>
            {field.value.map((item, index) => (
              <li key={index} className="wikibox-preview-list-item">{item}</li>
            ))}
          </ul>
        );
      
      case 'treelist':
        return (
          <ul className="wikibox-preview-treelist" style={{ margin: 0, paddingLeft: '16px' }}>
            {field.value.map((item, index) => (
              <li key={index} className="wikibox-preview-treelist-item">{item}</li>
            ))}
          </ul>
        );
      
      case 'link':
        return (
          <a 
            className="wikibox-preview-link"
            href={field.value.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: '#0645ad', textDecoration: 'underline' }}
          >
            {field.value.text}
          </a>
        );
      
      case 'group':
        return (
            field.children && field.children.map((child) => (
              renderPreviewValue(child)
            ))
          );
      
      case 'electoral':
        return (
            field.children && field.children.map((child) => (
              renderPreviewValue(child)
            ))
          );
      
      case 'electionheader':
      return <>
        {field.value.first && <div>← {parseTextWithSpans(field.value.first)}</div>}
        <div><b>{parseTextWithSpans(field.value.middle)}</b></div>
        {field.value.last && <div>{parseTextWithSpans(field.value.last)} →</div>}
      </>
      
      default:
        return <span className="wikibox-preview-value">{parseTextWithSpans(field.value)}</span>;
    }
  };

  const renderTableRow = (field) => {
    if (field.position === 'normal') {
      return (
        <>
          <tr key={field.id} className="wikibox-preview-row">
            <td className="wikibox-preview-label">
              {parseTextWithSpans(field.label)}
            </td>
            <td className="wikibox-preview-value-container">
              {renderPreviewValue(field)}
            </td>
          </tr>
          <tr><td colSpan="2" className="middle"></td></tr>
        </>
      );
    }
    else if (field.position === 'single') {
      return (
        <>
          <tr key={field.id} className="wikibox-preview-row">
            <td colSpan="2" className="wikibox-preview-value-single-container">
              {renderPreviewValue(field)}
            </td>
          </tr>
          <tr><td colSpan="2" className="middle"></td></tr>
        </>
      );
    }
    else if (field.position === 'ternary') {
      return (
        <>
          <tr key={field.id} className="wikibox-preview-row">
            <td colSpan="2" className="wikibox-preview-value-ternary-container">
              {renderPreviewValue(field)}
            </td>
          </tr>
          <tr><td colSpan="2" className="middle"></td></tr>
        </>
      );
    }
    else if (field.position === 'subheader') {
      return (
        <tr key={field.id} className="wikibox-preview-row">
          <td colSpan="2" className="wikibox-preview-subheader">
            <div className="wikibox-preview-subheader">
              {renderPreviewValue(field)}
            </div>
          </td>
        </tr>
      );
    }
    else if (field.position === 'thumbnail' || field.position === 'image') {
      return (
        <tr key={field.id} className="wikibox-preview-row">
          <td colSpan="2" className="wikibox-preview-image">
            {renderPreviewValue(field)}
          </td>
        </tr>
      );
    }
    else if (field.position === 'group') {
      return (
        field.children && field.children.map((child) => {
          // Handle any field with 'single' position OR types that should be single-width
          if (child.position === 'single' || child.type === 'line' || child.type === 'singletext') {
            return (
              <>
                <tr key={child.id} className="wikibox-preview-row">
                  <td colSpan="2" className="wikibox-preview-value-single-container">
                    {renderPreviewValue(child)}
                  </td>
                </tr>
                <tr><td colSpan="2" className="middle"></td></tr>
              </>
            );
          }
          // Handle subheaders specially
          else if (child.position === 'subheader' || child.type === 'subheader') {
            return (
              <tr key={child.id} className="wikibox-preview-row">
                <td colSpan="2" className="wikibox-preview-subheader">
                  <div className="wikibox-preview-subheader">
                    {renderPreviewValue(child)}
                  </div>
                </td>
              </tr>
            );
          }
          // Handle ternary fields specially
          else if (child.position === 'ternary' || child.type === 'electionheader') {
            return (
              <>
                <tr key={child.id} className="wikibox-preview-row">
                  <td colSpan="2" className="wikibox-preview-value-ternary-container">
                    {renderPreviewValue(child)}
                  </td>
                </tr>
                <tr><td colSpan="2" className="middle"></td></tr>
              </>
            );
          }
          // Handle thumbnails and images in groups specially
          else if (child.type === 'thumbnail' || child.type === 'image') {
            return (
              <tr key={child.id} className="wikibox-preview-row">
                <td colSpan="2" className="wikibox-preview-image">
                  {renderPreviewValue(child)}
                </td>
              </tr>
            );
          }
          // For other field types, use the normal renderTableRow logic
          return renderTableRow(child);
        })
      );
    }
    else if (field.position === 'electoral') {
      if (!field.children || field.children.length <= 0) {
        return null;
      }

      const columns = parseInt(field.value.columns) || 1;
      ensureColumnData(field, columns);
      
      // Group children by their labels (this creates rows)
      // Each row can have multiple columns with different content
      const rowGroups = {};
      field.children.forEach(child => {
        const rowKey = child.label;
        
        // Initialize row if it doesn't exist
        if (!rowGroups[rowKey]) {
          rowGroups[rowKey] = {};
        }
        
        // Place child in appropriate column (default to column 0 if no columnIndex)
        const columnIndex = child.columnIndex ?? 0;
        rowGroups[rowKey][columnIndex] = child;
      });
      
      return (
        <>
          <tr>
            <td colSpan="2" className="wikibox-preview-wrapper-electoral">
              <table className="wikibox-preview-wrapper-electoral-table">
                <tbody>
                  {Object.entries(rowGroups).map(([rowLabel, columnData]) => (
                    <tr key={rowLabel} className="wikibox-preview-row">
                      {/* Row label column */}
                      <td className="wikibox-preview-label">
                        {parseTextWithSpans(rowLabel)}
                      </td>
                      
                      {/* Data columns - one for each electoral column */}
                      {Array.from({ length: columns }).map((_, columnIndex) => (
                        <td key={columnIndex} className="wikibox-preview-value-container">
                          {columnData[columnIndex] ? 
                            renderPreviewValue(columnData[columnIndex]) : 
                            <span className="empty-cell">—</span>
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td colSpan="2" className="middle"></td>
          </tr>
        </>
      );

    }
  };

  return (
    <div className="wikibox-builder-container" style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
      {/* Sidebar */}
      <div className="wikibox-sidebar">
        <h3 className="wikibox-sidebar-title" style={{ marginTop: 0 }}>Field Types</h3>
        <div className="wikibox-field-types">
          {fieldTypes.map((fieldType) => (
            <div
              key={fieldType.type}
              className="wikibox-field-type-item"
              draggable
              onDragStart={(e) => handleDragStart(e, fieldType)}
              style={{
                padding: '12px',
                margin: '8px 0',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'grab',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span className="wikibox-field-type-icon">{fieldType.icon}</span>
              <span className="wikibox-field-type-label">{fieldType.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="wikibox-main-content" style={{ flex: 1, padding: '20px', display: 'flex', gap: '20px' }}>
        {/* Editor */}
        <div className="wikibox-editor" style={{ flex: 1 }}>
          <h2 className="wikibox-editor-title">Wikibox Editor – Elections</h2>
          
          <div className="wikibox-title-editor" style={{ marginBottom: '20px' }}>
            <label className="wikibox-title-label" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
              Wikibox Title:
            </label>
            <input
              className="wikibox-title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Wikibox name"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div
            className="wikibox-drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDragEnter={(e) => { e.preventDefault(); dragCounter.current++; }}
            onDragLeave={(e) => { e.preventDefault(); dragCounter.current--; }}
            onDrop={handleDrop}
            style={{
              minHeight: '400px',
              border: '2px dashed #ccc',
              borderRadius: '8px',
              padding: '20px',
              background: dragCounter.current > 0 ? '#f0f8ff' : '#fafafa'
            }}
          >
            {fields.length === 0 ? (
              <div className="wikibox-drop-placeholder" style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                Drag field types here to build your wikibox
              </div>
            ) : (
              <div className="wikibox-fields-list">
                {fields.map((field, index) => (
                  <div key={field.id} className="wikibox-field-editor">
                    <div className="wikibox-field-header">
                      <input
                        className="wikibox-field-label-input"
                        type="text"
                        value={parseTextWithSpans(field.label)}
                        onChange={(e) => updateFieldLabel(field.id, e.target.value)}
                        style={{ fontWeight: 'bold', border: 'none', background: 'transparent', outline: 'none' }}
                      />
                      <div className="wikibox-field-controls">
                        {index > 0 && (
                          <button
                            className="list-move-btn"
                            onClick={() => moveField(index, index - 1)}
                          >
                            ↑
                          </button>
                        )}
                        {index < fields.length - 1 && (
                          <button
                            className="list-move-btn"
                            onClick={() => moveField(index, index + 1)}
                          >
                            ↓
                          </button>
                        )}
                        <button
                          className='remove-btn'
                          onClick={() => removeField(field.id)}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="wikibox-field-content">
                      {renderFieldValue(field)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Preview */}
        <div className="wikibox-preview-container">
          <h3 className="wikibox-preview-title">Preview</h3>
          <div className="wikibox-preview-header">{title}</div>
          <table className="wikibox-preview">
            <thead>
              <tr><th colSpan="2" className="wikibox-preview-header"></th></tr>
            </thead>
            <tbody className="wikibox-preview-content">
              {fields.map((field) => renderTableRow(field))}
              <tr><td colspan="2" className="bottom"></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ElectionBuilder;
