import React, { useState, useRef } from 'react';
import './BiographyBuilderPreview.css';
import '../css/WikiboxBuilderField.css';

const BiographyBuilder = () => {
  const [fields, setFields] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [title, setTitle] = useState('');
  const dragCounter = useRef(0);

  const fieldTypes = [
    { 
      type: 'group-template', 
      position: 'group', 
      label: 'Political Office Template', 
      icon: '📄',
      isTemplate: true,
      children: [
        { type: 'subheader', label: 'Overview', value: 'Political *Office*' },
        { type: 'singletext', label: 'Description', value: '\'\'\'In office\'\'\'\nMarch 12, 2022 -- March 14, 2024' },
        { type: 'text', label: 'Chieftain', value: '*Lord Foppington*' },
        { type: 'text', label: 'Preceded by', value: '*Lincoln Chesworth*' },
        { type: 'text', label: 'Succeeded by', value: '*Lincoln Chesworth*' }
      ]
    },
    { 
      type: 'group-template', 
      position: 'group', 
      label: 'Personal Details Template', 
      icon: '📄',
      isTemplate: true,
      children: [
        { type: 'subheader', label: 'Overview', value: 'Personal details' },
        { type: 'text', label: 'Born', value: 'Squire Payne\nMay 5, 1954\n*New Cat City*, *New Cat State*, *United Cats*' },
        { type: 'text', label: 'Died', value: 'Not Yet' },
        { type: 'text', label: 'Political party', value: '*Imperial Reactionary*' },
        { type: 'text', label: 'Other political affiliations', value: '*Imperial Sanoe* (1989)' },
        { type: 'text', label: 'Spouse', value: '*Lady Payne*' },
        { type: 'text', label: 'Education', value: '*Feline University*' }
      ]
    },
    { 
      type: 'group-template', 
      position: 'group', 
      label: 'Military Service Template', 
      icon: '📄',
      isTemplate: true,
      children: [
        { type: 'subheader', label: 'Overview', value: 'Military service' },
        { type: 'text', label: 'Allegiance', value: '*United Cats*' },
        { type: 'text', label: 'Branch/service', value: '*United Cats Volunteers*\n(*United Cats Army*)' },
        { type: 'text', label: 'Years of service', value: '1968--1972' },
        { type: 'text', label: 'Rank', value: '*Imperial Stadtholder*' },
        { type: 'text', label: 'Battles/wars', value: '*Cat-Mice War*' },
      ]
    },
    { type: 'group', position: 'group', label: 'Group', icon: '📁' },
    { type: 'text', position: 'normal', label: 'Text Field', icon: '📝' },
    { type: 'singletext', position: 'single', label: 'Single Text', icon: '📝' },
    { type: 'subheader', position: 'subheader', label: 'Subheader', icon: '📝' },
    { type: 'image', position: 'image', label: 'Image', icon: '🖼️' },
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
          children: draggedItem.type === 'group' ? [] : undefined,
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
      case 'subheader': return '';
      case 'image': return '';
      case 'date': return new Date().toLocaleDateString();
      case 'list': return ['Item 1', 'Item 2'];
      case 'treelist': return ['Item 1', 'Item 2'];
      case 'link': return { text: 'Link Text', url: 'https://example.com' };
      case 'group': return 'Group Title';
      default: return '';
    }
  };// Add this helper before the component return

  const parseTextWithSpans = (text) => {
    // Replace escaped asterisks with a placeholder
    const placeholder = "__AST__";
    const safeText = text.replace(/\\\*/g, placeholder);

    // Split by *...*, ''...'', and '''...''' sections
    const parts = safeText.split(/(\*[^*]+\*|''[^'']+''|'''[^']+''')/g);

    return parts.map((part, i) => {
      if (/^\*[^*]+\*$/.test(part)) {
        // Remove * and wrap in span
        return <span className="linktext" key={i}>{part.slice(1, -1)}</span>;
      } else if (/^''[^'']+''$/.test(part)) {
        // Remove '' and wrap in <em> for italic
        return <em key={i}>{part.slice(2, -2)}</em>;
      } else if (/^'''[^']+'''$/.test(part)) {
        // Remove ''' and wrap in <strong> for bold
        return <strong key={i}>{part.slice(3, -3)}</strong>;
      }
      // Restore escaped asterisks
      return part.replace(new RegExp(placeholder, "g"), "*").replace(/--/g, "–");
    });
  };

  const addFieldToGroup = (groupId, fieldType) => {
    const newField = {
      id: Date.now(),
      type: fieldType.type,
      label: fieldType.label,
      position: fieldType.position,
      value: getDefaultValue(fieldType.type),
      caption: "",
      showCaption: false,
      parentGroup: groupId
    };
    
    setFields(fields.map(field => 
      field.id === groupId 
        ? { ...field, children: [...(field.children || []), newField] }
        : field
    ));
  };

  const removeFieldFromGroup = (groupId, fieldId) => {
    setFields(fields.map(field => 
      field.id === groupId 
        ? { ...field, children: field.children.filter(child => child.id !== fieldId) }
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
              child.id === childId ? { ...child, value: newValue } : child
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

  const moveFieldInGroup = (groupId, fromIndex, toIndex) => {
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
  };

  const updateGroupChildLabel = (groupId, childId, newLabel) => {
    setFields(fields.map(field => 
      field.id === groupId 
        ? { 
            ...field, 
            children: field.children.map(child => 
              child.id === childId ? { ...child, label: newLabel } : child
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

  const renderFieldValue = (field) => {
    switch (field.type) {
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
                  if (draggedItem && draggedItem.type !== 'group') {
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
              <div key={child.id} style={{ marginBottom: '2px', paddingLeft: '12px' }}>
                <strong>{child.label}:</strong> {renderPreviewValue(child)}
              </div>
            ))
          );
      
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
          <tr><td colspan="2" className="middle"></td></tr>
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
          <tr><td colspan="2" className="middle"></td></tr>
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
    else if (field.position === 'image') {
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
        field.children && field.children.map((child) => (
          renderTableRow(child)
        ))
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
          <h2 className="wikibox-editor-title">Wikibox Editor – Biography</h2>
          
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
          <table className="wikibox-preview">
            <thead>
              <tr>
                <th colSpan="2" className="wikibox-preview-header">
                  {title}
                </th>
              </tr>
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

export default BiographyBuilder;
