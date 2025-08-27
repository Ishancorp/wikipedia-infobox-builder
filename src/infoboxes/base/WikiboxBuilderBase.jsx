import '../css/WikiboxBuilderField.css';
import React, { useState, useRef } from 'react';
import helpers from '../helpers/helpers.jsx';
import PreviewContainer from '../components/previews/PreviewContainer/PreviewContainer.jsx';
import PreviewTable from '../components/previews/PreviewTable/PreviewTable.jsx';
import Sidebar from '../components/sidebar/sidebar.jsx';
import TitleEditor from '../components/title/TitleEditor.jsx';
import FieldsList from '../components/dropzone/FieldsList/FieldsList.jsx';
import FieldsLink from '../components/dropzone/FieldsLink/FieldsLink.jsx';
import FieldsImage from '../components/dropzone/FieldsImage/FieldsImage.jsx';
import FieldsTextArea from '../components/dropzone/FieldsTextArea/FieldsTextArea.jsx';
import CollapseButton from '../components/buttons/CollapseButton.jsx';
import PreviewImage from '../components/previews/PreviewImage/PreviewImage.jsx';
import PreviewLink from '../components/previews/PreviewLink/PreviewLink.jsx';
import RenderEmptyRow from '../components/render/RenderEmptyRow.jsx';

const { generateTemplate, getDefaultValue, parseTextWithSpans } = helpers;

const WikiboxBuilderBase = ({ 
  builderType, 
  fieldTypes, 
  renderFieldValue, 
  renderTableRow,
  customState = {},
  customHandlers = {},
  previewWrapper
}) => {
  const [fields, setFields] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [title, setTitle] = useState('');
  const dragCounter = useRef(0);

  const [customStateValues, setCustomStateValues] = useState(customState.initialState || {});

  const handleDragStart = (e, fieldType) => {
    setDraggedItem(fieldType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    
    if (draggedItem) {
      let newField;
      
      if (draggedItem.isTemplate || draggedItem.type === 'electoral-template') {
        newField = generateTemplate(draggedItem);
      } else {
        newField = {
          id: Date.now(),
          type: draggedItem.type,
          label: draggedItem.label,
          position: draggedItem.position,
          value: getDefaultValue(draggedItem.type),
          caption: draggedItem.caption || "",
          showCaption: draggedItem.showCaption || false,
          parentGroup: null,
          children: ['group', 'electoral'].includes(draggedItem.type) ? [] : undefined,
          columns: draggedItem.type === 'electoral' ? 1 : undefined,
          isCollapsed: false
        };
      }
      
      setFields(prev => [...prev, newField]);
      setDraggedItem(null);
    }
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

  const builderContext = {
    // State
    fields,
    setFields,
    title,
    setTitle,
    draggedItem,
    setDraggedItem,
    customStateValues,
    setCustomStateValues,
    
    // Handlers
    updateField,
    updateCaption,
    toggleCaption,
    updateFieldLabel,
    removeField,
    moveField,
    addFieldToGroup,
    removeFieldFromGroup,
    toggleGroupCollapse,
    updateGroupChild,
    updateCaptionGroup,
    toggleCaptionGroup,
    updateGroupChildLabel,
    moveFieldInGroup,
    
    // Custom handlers
    ...customHandlers
  };

  const previewContent = previewWrapper ? (
    previewWrapper(
      <PreviewTable title={title}>
        {fields.map((field) => renderTableRow(field, builderContext))}
      </PreviewTable>,
      builderContext
    )
  ) : (
    <PreviewTable title={title}>
      {fields.map((field) => renderTableRow(field, builderContext))}
    </PreviewTable>
  );

  return (
    <div className="wikibox-builder-container" style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      maxWidth: '95vw', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <Sidebar fieldTypes={fieldTypes} handleDragStart={handleDragStart}/>

      <div className="wikibox-main-content" style={{ 
        flex: 1, 
        padding: '20px', 
        display: 'flex', 
        gap: '20px' 
      }}>
        <div className="wikibox-editor" style={{ flex: 1 }}>
          <h2 className="wikibox-editor-title">Wikibox Builder — {builderType}</h2>
          
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
              renderFieldValue={(field) => renderFieldValue(field, builderContext)}
            />
          </div>
        </div>

        <PreviewContainer>
          {previewContent}
        </PreviewContainer>
      </div>
    </div>
  );
};

export default WikiboxBuilderBase;


export class FieldRenderer {
  constructor(context) {
    this.context = context;
  }

  renderBasicTextField(field, onChange) {
    return (
      <FieldsTextArea 
        field={field} 
        onChange={onChange}
      />
    );
  }

  renderDateField(field, onChange) {
    return (
      <FieldsDate
        field={field}
        onChange={onChange}
      />
    );
  }

  renderImageField(field, onUrlChange, onClickCaption, onEditCaption, imageUpload, noCaption = false) {
    return (
      <FieldsImage
        field={field}
        onUrlChange={onUrlChange}
        onClickCaption={onClickCaption}
        onEditCaption={onEditCaption}
        imageUpload={imageUpload}
        noCaption={noCaption}
      />
    );
  }

  renderLinkField(field, onChange1, onChange2) {
    return (
      <FieldsLink
        url={field.value.url} 
        text={field.value.text}
        onChange1={onChange1}
        onChange2={onChange2}
      />
    );
  }

  renderGroupField(field, draggedItem, setDraggedItem, addFieldToGroup, allowedChildTypes = []) {
    const { toggleGroupCollapse } = this.context;
    
    return (
      <div className="wikibox-group-container">
        <div className="wikibox-group-header">
          <CollapseButton 
            onClick={() => toggleGroupCollapse(field.id)} 
            isCollapsed={field.isCollapsed}
          />
        </div>
        
        {!field.isCollapsed && (
          <div 
            className="wikibox-group-drop-zone"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (draggedItem && !allowedChildTypes.includes(draggedItem.type)) {
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
              this.renderGroupChildren(field)
            ) : (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                Drop fields here to add to group
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  renderGroupChildren(field) {
    // Override in subclasses
    return null;
  }
}


export class PreviewRenderer {
  renderBasicPreview(field) {
    return <span className="wikibox-preview-value">{parseTextWithSpans(field.value)}</span>;
  }

  renderImagePreview(field, maxWidth = '100%', inline = false, noCaption = false) {
    return <PreviewImage field={field} maxWidth={maxWidth} inline={inline} noCaption={noCaption}/>;
  }

  renderLinkPreview(field) {
    return <PreviewLink field={field}/>;
  }

  renderListPreview(field, type = 'list') {
    const className = `wikibox-preview-${type}`;
    return (
      <ul className={className} style={{ margin: 0, paddingLeft: '16px' }}>
        {field.value.map((item, index) => (
          <li key={index} className={`${className}-item`}>{item}</li>
        ))}
      </ul>
    );
  }

  renderColorPreview(field) {
    return <div style={{ height: '6px', backgroundColor: field.value, width: '100%' }}></div>;
  }

  renderTableRow(field, renderPreviewValue, position = null) {
    const pos = position || field.position;
    
    switch (pos) {
      case 'normal':
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
            <RenderEmptyRow/>
          </>
        );
      
      case 'single':
        return (
          <>
            <tr key={field.id} className="wikibox-preview-row">
              <td colSpan="2" className="wikibox-preview-value-single-container">
                {renderPreviewValue(field)}
              </td>
            </tr>
            <RenderEmptyRow/>
          </>
        );
      
      case 'image':
        return (
          <tr key={field.id} className="wikibox-preview-row">
            <td colSpan="2" className="wikibox-preview-image">
              {renderPreviewValue(field)}
            </td>
          </tr>
        );
      
      default:
        return null;
    }
  }
}
