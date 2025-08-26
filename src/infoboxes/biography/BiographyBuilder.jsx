import React, { useState, useRef } from 'react';
import './BiographyBuilderPreview.css';
import '../css/WikiboxBuilderField.css';
import helpers from '../helpers/helpers.jsx'
import PreviewContainer from '../components/previews/PreviewContainer/PreviewContainer.jsx';
import PreviewTable from '../components/previews/PreviewTable/PreviewTable.jsx';
import Sidebar from '../components/sidebar/sidebar.jsx';
import TitleEditor from '../components/title/TitleEditor.jsx';
import FieldsList from '../components/dropzone/FieldsList/FieldsList.jsx';
import RemoveButton from '../components/buttons/RemoveButton.jsx';
import CollapseButton from '../components/buttons/CollapseButton.jsx';
import MoveButton from '../components/buttons/MoveButton.jsx';
import PreviewImage from '../components/previews/PreviewImage/PreviewImage.jsx';
import PreviewLink from '../components/previews/PreviewLink/PreviewLink.jsx';
import FieldsLink from '../components/dropzone/FieldsLink/FieldsLink.jsx';
import FieldsImage from '../components/dropzone/FieldsImage/FieldsImage.jsx';
const { parseTextWithSpans, handleGroupImageUpload } = helpers;

const BiographyBuilder = () => {
  const [fields, setFields] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [title, setTitle] = useState('');
  const [imageInputModes, setImageInputModes] = useState({});
  const dragCounter = useRef(0);

  const fieldTypes = [
    {
      type: "Templates",
      list: [
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
      ]
    },
    {
      type: "Elements",
      list: [
        { type: 'group', position: 'group', label: 'Group', icon: '📁' },
        { type: 'text', position: 'normal', label: 'Text Field', icon: '📝' },
        { type: 'singletext', position: 'single', label: 'Single Text', icon: '📝' },
        { type: 'subheader', position: 'subheader', label: 'Subheader', icon: '📝' },
        { type: 'image', position: 'image', label: 'Image', icon: '🖼️' },
        { type: 'date', position: 'normal', label: 'Date', icon: '📅' },
        { type: 'list', position: 'normal', label: 'List', icon: '📋' },
        { type: 'treelist', position: 'normal', label: 'Tree List', icon: '📋' },
        { type: 'link', position: 'normal', label: 'Link', icon: '🔗' },
      ]
    },
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
      
      if (draggedItem.isTemplate) {
        newField = generateTemplateGroup(draggedItem);
      } else {
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
  };

  const toggleImageInputMode = (fieldId) => {
    setImageInputModes(prev => ({
      ...prev,
      [fieldId]: prev[fieldId] === 'file' ? 'url' : 'file'
    }));
  };

  const getImageInputMode = (fieldId) => {
    return imageInputModes[fieldId] || 'url';
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

  const updateCaptionGroup = (fieldId, childId, newCaption) => {
    setFields(fields.map(field => 
      field.id === fieldId 
        ? { 
            ...field, 
            children: field.children.map(child => 
              child.id === childId 
                ? { ...child, caption: newCaption }
                : child
            )
          }
        : field
    ));
  };

  const toggleCaptionGroup = (fieldId, childId, checked) => {
    setFields(fields.map(field =>
      field.id === fieldId 
        ? { 
            ...field, 
            children: field.children.map(child => 
              child.id === childId 
                ? { ...child, showCaption: checked }
                : child
            )
          }
        : field
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
            className="wikibox-field-input"
            type="date"
            value={field.value}
            onChange={(e) => updateField(field.id, e.target.value)}
          />
        );
      
      case 'image':
        return (
          <FieldsImage
            field={field}
            imageInputModes={imageInputModes}
            toggleImageInputMode={toggleImageInputMode}
            updateField={updateField}
            toggleCaption={toggleCaption}
            updateCaption={updateCaption}
          />
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
                <RemoveButton small
                  onClick={() => {
                    const newList = field.value.filter((_, i) => i !== index);
                    updateField(field.id, newList);
                  }}
                />
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
          <FieldsLink
            url={field.value.url} text={field.value.text}
            onChange1={(e) => updateField(field.id, { ...field.value, text: e.target.value })}
            onChange2={(e) => updateField(field.id, { ...field.value, url: e.target.value })}
          />
        );
      
      case 'group':
        return (
          <div className="wikibox-group-container">
            <div className="wikibox-group-header">
              <CollapseButton onClick={() => toggleGroupCollapse(field.id)} isCollapsed={field.isCollapsed}/>
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
                          <MoveButton type='up' onClick={() => moveFieldInGroup(field.id, childIndex, childIndex - 1)} />
                        )}
                        {childIndex < field.children.length - 1 && (
                          <MoveButton type='down' onClick={() => moveFieldInGroup(field.id, childIndex, childIndex + 1)} />
                        )}
                        <RemoveButton small onClick={() => removeFieldFromGroup(field.id, child.id)} />
                      </div>
                    </div>
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
                              <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
                                <button
                                  onClick={() => toggleImageInputMode(`${field.id}-${child.id}`)}
                                  style={{
                                    padding: '2px 6px',
                                    fontSize: '10px',
                                    background: getImageInputMode(`${field.id}-${child.id}`) === 'url' ? '#2196F3' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    minWidth: '35px'
                                  }}
                                  title={`Switch to ${getImageInputMode(`${field.id}-${child.id}`) === 'url' ? 'File' : 'URL'} input`}
                                >
                                  {getImageInputMode(`${field.id}-${child.id}`) === 'url' ? 'URL' : 'File'}
                                </button>
                                
                                {getImageInputMode(`${field.id}-${child.id}`) === 'url' ? (
                                  <input
                                    className="wikibox-field-input"
                                    type="url"
                                    placeholder="Image URL"
                                    value={child.value.startsWith('data:') ? '' : child.value}
                                    onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                                    style={{ flex: 1 }}
                                  />
                                ) : (
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        handleGroupImageUpload(file, field.id, child.id, updateGroupChild);
                                      }
                                    }}
                                    style={{ flex: 1, fontSize: '10px' }}
                                  />
                                )}
                              </div>
                              {child.value && (
                                <img 
                                  src={child.value} 
                                  alt="preview" 
                                  style={{ maxWidth: '100px', height: 'auto' }}
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              )}              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <input
                                type="checkbox"
                                checked={child.showCaption}
                                onChange={(e) => toggleCaptionGroup(field.id, child.id, e.target.checked)}
                              />
                              Show Caption
                            </label>
                            {child.showCaption && (
                              <input
                                className="wikibox-field-input wikibox-caption-input"
                                type="text"
                                placeholder="Enter caption"
                                value={child.caption}
                                onChange={(e) => updateCaptionGroup(field.id, child.id, e.target.value)}
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
                                  <RemoveButton small
                                    onClick={() => {
                                      const newList = child.value.filter((_, i) => i !== index);
                                      updateGroupChild(field.id, child.id, newList);
                                    }}
                                  />
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
                            <FieldsLink
                              text={child.value.text}
                              url={child.value.url}
                              onChange1={(e) => updateGroupChild(field.id, child.id, { ...child.value, text: e.target.value })}
                              onChange2={(e) => updateGroupChild(field.id, child.id, { ...child.value, url: e.target.value })}
                            />
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
        return <PreviewImage field={field} maxWidth={'100%'}/>
      
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
          <PreviewLink field={field}/>
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
            <td className="wikibox-preview-value-container" style={{textAlign: 'left'}}>
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
    <div className="wikibox-builder-container" style={{ display: 'flex', minHeight: '100vh', maxWidth: '95vw', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar fieldTypes={fieldTypes} handleDragStart={handleDragStart}/>

      <div className="wikibox-main-content" style={{ flex: 1, padding: '20px', display: 'flex', gap: '20px' }}>
        <div className="wikibox-editor" style={{ flex: 1 }}>
          <h2 className="wikibox-editor-title">Wikibox Editor — Biography</h2>
          
          <TitleEditor title={title} setTitle={setTitle}/>

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
            <FieldsList
              fields={fields}
              parseTextWithSpans={parseTextWithSpans}
              updateFieldLabel={updateFieldLabel}
              moveField={moveField}
              removeField={removeField}
              renderFieldValue={renderFieldValue}
            />
          </div>
        </div>

        <PreviewContainer>
          <PreviewTable title={title}>
            {fields.map((field) => renderTableRow(field))}
          </PreviewTable>
        </PreviewContainer>
      </div>
    </div>
  );
};

export default BiographyBuilder;
