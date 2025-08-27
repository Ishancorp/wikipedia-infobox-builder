import React, { useState, useRef } from 'react';
import './BiographyBuilderPreview.css';
import '../css/WikiboxBuilderField.css';
import helpers from '../helpers/helpers.jsx'
import PreviewContainer from '../components/previews/PreviewContainer/PreviewContainer.jsx';
import PreviewTable from '../components/previews/PreviewTable/PreviewTable.jsx';
import Sidebar from '../components/sidebar/sidebar.jsx';
import TitleEditor from '../components/title/TitleEditor.jsx';
import FieldsList from '../components/dropzone/FieldsList/FieldsList.jsx';
import CollapseButton from '../components/buttons/CollapseButton.jsx';
import PreviewImage from '../components/previews/PreviewImage/PreviewImage.jsx';
import PreviewLink from '../components/previews/PreviewLink/PreviewLink.jsx';
import FieldsLink from '../components/dropzone/FieldsLink/FieldsLink.jsx';
import FieldsImage from '../components/dropzone/FieldsImage/FieldsImage.jsx';
import FieldsTreeList from '../components/dropzone/FieldsTreeList/FieldsTreeList.jsx';
import FieldsDate from '../components/dropzone/FieldsDate/FieldsDate.jsx';
import FieldsGroupControlsByField from '../components/dropzone/FieldsGroup/FieldsGroupControlsByField.jsx';
import allFieldTypes from '../../jsons/allFieldTypes.json';
const { parseTextWithSpans, handleImageUpload, handleGroupImageUpload, getDefaultValue, generateTemplate } = helpers;

const BiographyBuilder = () => {
  const [fields, setFields] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [title, setTitle] = useState('');
  const dragCounter = useRef(0);

  const fieldTypes = allFieldTypes.Biography;

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
        newField = generateTemplate(draggedItem);
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
          <FieldsDate
            field={field}
            onChange={(e) => updateField(field.id, e.target.value)}
          />
        );
      
      case 'image':
        return (
          <FieldsImage
            field={field}
            onUrlChange={(e) => updateField(field.id, e.target.value)}
            onClickCaption={(e) => toggleCaption(field.id, e.target.checked)}
            onEditCaption={(e) => updateCaption(field.id, e.target.value)}
            imageUpload={(file) => handleImageUpload(file, field.id, updateField)}
          />
        );
      
      case 'treelist':
      case 'list':
        return (
          <FieldsTreeList
            field={field}
            fieldUpdater={(newList) => updateField(field.id, newList)}
          />
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
                      <FieldsGroupControlsByField 
                        field={field} 
                        childIndex={childIndex}
                        upClick={() => moveFieldInGroup(field.id, childIndex, childIndex - 1)}
                        downClick={() => moveFieldInGroup(field.id, childIndex, childIndex + 1)}
                        removeClick={() => removeFieldFromGroup(field.id, child.id)}
                      />
                    </div>
                    {(() => {
                      switch (child.type) {
                        case 'subheader':
                        case 'text':
                        case 'singletext':
                          return (
                            <textarea
                              className="wikibox-field-input"
                              type='text'
                              value={child.value}
                              onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                              placeholder="Enter text here"
                            />
                          );
                        
                        case 'date':
                          return (
                            <FieldsDate
                              field={field}
                              onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                            />
                          );
                        
                        case 'image':
                          return (
                            <FieldsImage
                              field={child}
                              onUrlChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                              onClickCaption={(e) => toggleCaptionGroup(field.id, child.id, e.target.checked)}
                              onEditCaption={(e) => updateCaptionGroup(field.id, child.id, e.target.value)}
                              imageUpload={(file) => handleGroupImageUpload(file, field.id, child.id, updateGroupChild)}
                            />
                          );
                        
                        case 'treelist':
                        case 'list':
                          return (
                            <FieldsTreeList
                              field={child}
                              fieldUpdater={(newList) => updateGroupChild(field.id, child.id, newList)}
                            />
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
          <h2 className="wikibox-editor-title">Wikibox Builder — Biography</h2>
          
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
