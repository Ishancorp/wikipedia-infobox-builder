import React, { useState, useRef } from 'react';
import './ElectionBuilderPreview.css';
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
import FieldsDate from '../components/dropzone/FieldsDate/FieldsDate.jsx';
import FieldsElectionFooter from '../components/dropzone/FieldsElectionFooter/FieldsElectionFooter.jsx';
import FieldsElectionHeader from '../components/dropzone/FieldsElectionHeader/FieldsElectionHeader.jsx';
import FieldsGroupControlsByField from '../components/dropzone/FieldsGroup/FieldsGroupControlsByField.jsx';
import FieldsElectoralControlsByField from '../components/dropzone/FieldsElectoral/FieldsElectoralControlsByField.jsx';
import FieldsElectoralControls from '../components/dropzone/FieldsElectoral/FieldsElectoralControls.jsx';
import allFieldTypes from '../../jsons/allFieldTypes.json';
import FieldsElectoralHeaderByField from '../components/dropzone/FieldsElectoral/FieldsElectoralHeaderByField.jsx';
const { parseTextWithSpans, handleImageUpload, handleGroupImageUpload, getDefaultValue, generateTemplate } = helpers;

const ElectionBuilder = () => {
  const [fields, setFields] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [title, setTitle] = useState('');
  const dragCounter = useRef(0);
  const [electoralColumnViews, setElectoralColumnViews] = useState({});

  const fieldTypes = allFieldTypes.Election;

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
        if (draggedItem.type === 'electoral-template') {
          newField = generateTemplate(draggedItem);
        } else {
          newField = generateTemplate(draggedItem);
          console.log(newField);
        }
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
          children: draggedItem.type === 'group' || draggedItem.type === 'electoral' ? [] : undefined,
          columns: draggedItem.type === 'electoral' ? 1 : undefined,
          isCollapsed: false
        };
      }
      
      setFields([...fields, newField]);
      setDraggedItem(null);
    }
  };

  const addFieldToGroup = (groupId, fieldType) => {
    const parentField = fields.find(field => field.id === groupId);
    const isElectoral = parentField && parentField.type === 'electoral';
    
    const newField = {
      id: Date.now(),
      type: fieldType.type,
      label: fieldType.label,
      position: fieldType.position,
      value: getDefaultValue(fieldType.type),
      caption: fieldType.caption || "",
      showCaption: fieldType.showCaption || false,
      parentGroup: groupId,
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
                ? { ...child, value: newValue }
                : child
            )
          }
        : field
    ));
  };

  const duplicateColumnFields = (field, newColumnCount) => {
    if (!field.children || field.children.length === 0) {
      return field.children || [];
    }

    const currentColumnCount = parseInt(field.value.columns) || 1;
    
    if (newColumnCount <= currentColumnCount) {
      return field.children;
    }

    const firstColumnChildren = field.children.filter(child => 
      (child.columnIndex ?? 0) === 0
    );

    const newChildren = [...field.children];
    
    for (let newColIndex = currentColumnCount; newColIndex < newColumnCount; newColIndex++) {
      firstColumnChildren.forEach((originalChild, childIndex) => {
        const duplicatedChild = {
          ...originalChild,
          id: Date.now() + (newColIndex * 1000) + childIndex,
          columnIndex: newColIndex,
          value: getDefaultValue(originalChild.type)
        };
        newChildren.push(duplicatedChild);
      });
    }

    return newChildren;
  };

  const updateField = (id, newValue) => {
    setFields(fields.map(field => {
      if (field.id === id) {
        if (field.type === 'electoral' && field.value.columns !== newValue.columns) {
          const newColumnCount = parseInt(newValue.columns) || 1;
          const updatedChildren = duplicateColumnFields(field, newColumnCount);
          
          return {
            ...field,
            value: newValue,
            children: updatedChildren
          };
        }
        
        return { ...field, value: newValue };
      }
      return field;
    }));
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

  const moveFieldBetweenColumns = (groupId, fieldId, fromColumn, toColumn) => {
    const electoralField = fields.find(field => field.id === groupId);
    if (!electoralField) return;
    
    const sourceField = electoralField.children.find(child => child.id === fieldId);
    if (!sourceField) return;
    
    const columnCount = parseInt(electoralField.value.columns) || 1;
    
    setFields(fields.map(field => {
      if (field.id !== groupId) return field;
      
      let updatedChildren = [...field.children];
      
      // Case 1: Moving from header (column -1) to regular column (>=0)
      if (fromColumn === -1 && toColumn >= 0) {
        // Remove the original header field
        updatedChildren = updatedChildren.filter(child => child.id !== fieldId);
        
        // Create duplicates for all columns, keeping value for toColumn, empty for others
        const baseId = Date.now();
        for (let colIndex = 0; colIndex < columnCount; colIndex++) {
          const duplicatedField = {
            ...sourceField,
            id: baseId + colIndex,
            columnIndex: colIndex,
            value: colIndex === toColumn ? sourceField.value : getDefaultValue(sourceField.type)
          };
          updatedChildren.push(duplicatedField);
        }
      }
      // Case 2: Moving from regular column (>=0) to header (column -1)
      else if (fromColumn >= 0 && toColumn === -1) {
        // Remove all fields with the same label (all column variants)
        updatedChildren = updatedChildren.filter(child => child.label !== sourceField.label);
        
        // Create new header field with the original field's value
        const headerField = {
          ...sourceField,
          id: Date.now(),
          columnIndex: -1,
          value: sourceField.value
        };
        updatedChildren.push(headerField);
      }
      // Case 3: Moving between regular columns (shouldn't happen with current UI, but keeping for completeness)
      else {
        updatedChildren = updatedChildren.map(child => 
          child.id === fieldId 
            ? { ...child, columnIndex: toColumn }
            : child
        );
      }
      
      return { ...field, children: updatedChildren };
    }));
  };

  const updateGroupChildLabel = (groupId, childId, newLabel) => {
    setFields(fields.map(field => 
      field.id === groupId 
        ? { 
            ...field, 
            children: field.children.map(child => 
              child.id === childId 
                ? { ...child, label: newLabel }
                : child
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

  const moveFieldInElectoral = (groupId, fromIndex, toIndex) => {
    const parentField = fields.find(field => field.id === groupId);
    if (!parentField) return;
    
    const currentColumn = electoralColumnViews[groupId] || 0;
    const currentColumnChildren = getElectoralColumnChildren(parentField, currentColumn);
    
    if (fromIndex >= currentColumnChildren.length || toIndex >= currentColumnChildren.length) {
      return;
    }
    
    const allChildren = parentField.children || [];
    const fieldsByLabel = {};
    
    allChildren.forEach(child => {
      if (!fieldsByLabel[child.label]) {
        fieldsByLabel[child.label] = [];
      }
      fieldsByLabel[child.label].push(child);
    });
    
    const labelOrder = currentColumnChildren.map(child => child.label);
    const [movedLabel] = labelOrder.splice(fromIndex, 1);
    labelOrder.splice(toIndex, 0, movedLabel);
    
    const reorderedChildren = [];
    
    allChildren.filter(child => child.columnIndex === -1).forEach(child => {
      reorderedChildren.push(child);
    });
    
    labelOrder.forEach(label => {
      if (fieldsByLabel[label]) {
        fieldsByLabel[label].forEach(field => {
          if (field.columnIndex !== -1) {
            reorderedChildren.push(field);
          }
        });
      }
    });
    
    setFields(fields.map(field => 
      field.id === groupId 
        ? { ...field, children: reorderedChildren }
        : field
    ));
  };

  const updateElectoralChildLabel = (groupId, oldLabel, newLabel) => {
    setFields(fields.map(field => 
      field.id === groupId 
        ? { 
            ...field, 
            children: field.children.map(child => 
              child.label === oldLabel 
                ? { ...child, label: newLabel }
                : child
            )
          }
        : field
    ));
  };

  const ensureColumnData = (field, columnCount) => {
    const columnData = field.value.columnData || [];
    while (columnData.length < columnCount) {
      columnData.push({});
    }
    return columnData.slice(0, columnCount);
  };

  const addFieldToElectoralColumn = (electoralId, fieldType) => {
    const electoralField = fields.find(field => field.id === electoralId);
    if (!electoralField) return;
    
    const columnCount = parseInt(electoralField.value.columns) || 1;
    const baseId = Date.now();
    
    const newFields = [];
    
    for (let colIndex = 0; colIndex < columnCount; colIndex++) {
      const newField = {
        id: baseId + colIndex,
        type: fieldType.type,
        label: fieldType.label,
        position: fieldType.position,
        value: getDefaultValue(fieldType.type),
        caption: "",
        showCaption: false,
        parentGroup: electoralId,
        columnIndex: colIndex
      };
      newFields.push(newField);
    }
    
    setFields(fields.map(field => 
      field.id === electoralId 
        ? { ...field, children: [...(field.children || []), ...newFields] }
        : field
    ));
  };

  const moveHeaderField = (fieldId, headerChildId, direction) => {
    setFields(fields.map(field => 
      field.id === fieldId 
        ? { 
            ...field, 
            children: (() => {
              const headerChildren = field.children.filter(child => child.columnIndex === -1);
              const nonHeaderChildren = field.children.filter(child => child.columnIndex !== -1);
              
              const currentIndex = headerChildren.findIndex(child => child.id === headerChildId);
              const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
              
              if (targetIndex < 0 || targetIndex >= headerChildren.length) {
                return field.children;
              }
              
              const newHeaderChildren = [...headerChildren];
              [newHeaderChildren[currentIndex], newHeaderChildren[targetIndex]] = 
              [newHeaderChildren[targetIndex], newHeaderChildren[currentIndex]];
              
              return [...newHeaderChildren, ...nonHeaderChildren];
            })()
          }
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

  const removeFieldFromElectoral = (groupId, fieldLabel) => {
    setFields(fields.map(field => 
      field.id === groupId 
        ? { ...field, children: field.children.filter(child => child.label !== fieldLabel) }
        : field
    ));
  };

  const renderFieldValue = (field) => {
    switch (field.type) {
      case 'electionheader':
      case 'electionfooter':
        return (
          <FieldsElectionHeader
            field={field}
            fieldChange={(newList) => updateField(field.id, newList)}
          />
        )
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
      
      case 'color':
        return (
          <input
            className="wikibox-field-input"
            value={field.value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder="Enter color here"
          />
        );
      
      case 'line':
        return (<></>);
      
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

      case 'thumbnail':
      case 'inlineimage':
        return (
          <FieldsImage
            field={field}
            onUrlChange={(e) => updateField(field.id, e.target.value)}
            onClickCaption={(e) => toggleCaption(field.id, e.target.checked)}
            onEditCaption={(e) => updateCaption(field.id, e.target.value)}
            imageUpload={(file) => handleImageUpload(file, field.id, updateField)}
            noCaption
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
              
              <FieldsElectoralControls
                columnCount={columnCount}
                currentColumn={currentColumn}
                leftClick={() => setElectoralColumnViews({
                  ...electoralColumnViews,
                  [field.id]: Math.max(0, currentColumn - 1)
                })}
                rightClick={() => setElectoralColumnViews({
                  ...electoralColumnViews,
                  [field.id]: Math.min(columnCount - 1, currentColumn + 1)
                })}
              />
              
              <CollapseButton 
                onClick={() => toggleGroupCollapse(field.id)}
                isCollapsed={field.isCollapsed}
                style={{marginLeft: '8px'}}
              />
            </div>
            
            {!field.isCollapsed && (
              <div 
                className="wikibox-group-drop-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (draggedItem && draggedItem.type !== 'group' && draggedItem.type !== 'electoral') {
                    addFieldToElectoralColumn(field.id, draggedItem);
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
                
                {field.children.filter(child => child.columnIndex === -1).length > 0 && (
                  <div style={{ 
                    background: '#fff3e0', 
                    padding: '8px', 
                    marginBottom: '12px', 
                    borderRadius: '4px',
                    border: '1px solid #ffb74d'
                  }}>
                    <div style={{ 
                      fontWeight: 'bold', 
                      marginBottom: '8px', 
                      color: '#e65100',
                      fontSize: '12px',
                      letterSpacing: '0.5px',
                      textAlign: 'center',
                    }}>
                      Header Rows (Full Width)
                    </div>
                    
                    {field.children
                      .filter(child => child.columnIndex === -1)
                      .map((headerChild, headerIndex) => (
                        <div key={headerChild.id} style={{ 
                          marginBottom: '8px', 
                          padding: '8px', 
                          background: 'white', 
                          border: '1px solid #ddd',
                          borderRadius: '4px'
                        }}>
                          <FieldsElectoralHeaderByField
                            headerIndex={headerIndex}
                            field={field}
                            child={headerChild}
                            onChangeName={(e) => updateElectoralChildLabel(field.id, headerChild.label, e.target.value)}
                            upClick={() => moveHeaderField(field.id, headerChild.id, 'up')}
                            downClick={() => moveHeaderField(field.id, headerChild.id, 'down')}
                            columnClick={() => moveFieldBetweenColumns(field.id, headerChild.id, -1, 0)}
                            removeClick={() => removeFieldFromGroup(field.id, headerChild.id)}
                          />
                          
                          {(() => {
                            switch (headerChild.type) {
                              case 'text':
                              case 'singletext':
                                return (
                                  <textarea
                                    className="wikibox-field-input"
                                    value={headerChild.value}
                                    onChange={(e) => updateGroupChild(field.id, headerChild.id, e.target.value)}
                                    placeholder="Enter header text"
                                    style={{ width: '100%', minHeight: '40px' }}
                                  />
                                );

                              case 'color':
                                return (
                                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <input
                                      type="color"
                                      value={headerChild.value}
                                      onChange={(e) => updateGroupChild(field.id, headerChild.id, e.target.value)}
                                      style={{ width: '40px', height: '30px' }}
                                    />
                                    <input
                                      className="wikibox-field-input"
                                      value={headerChild.value}
                                      onChange={(e) => updateGroupChild(field.id, headerChild.id, e.target.value)}
                                      placeholder="Color code"
                                      style={{ flex: 1 }}
                                    />
                                  </div>
                                );
                              
                              case 'line':
                                return (
                                  <div style={{ 
                                    padding: '4px 8px', 
                                    background: '#f5f5f5', 
                                    borderRadius: '2px',
                                    fontSize: '12px',
                                    color: '#666',
                                    fontStyle: 'italic'
                                  }}>
                                    Horizontal line separator
                                  </div>
                                );
                              
                              case 'inlineimage':
                              case 'image':
                              case 'thumbnail':
                                return (
                                  <FieldsImage
                                    field={headerChild}
                                    onUrlChange={(e) => updateGroupChild(field.id, headerChild.id, e.target.value)}
                                    onClickCaption={(e) => toggleCaptionGroup(field.id, headerChild.id, e.target.checked)}
                                    onEditCaption={(e) => updateCaptionGroup(field.id, headerChild.id, e.target.value)}
                                    imageUpload={(file) => handleGroupImageUpload(file, field.id, headerChild.id, updateGroupChild)}
                                    noCaption
                                  />
                                );
                              
                              default:
                                return (
                                  <input
                                    className="wikibox-field-input"
                                    value={headerChild.value || ''}
                                    onChange={(e) => updateGroupChild(field.id, headerChild.id, e.target.value)}
                                    placeholder="Enter value"
                                    style={{ width: '100%' }}
                                  />
                                );
                            }
                          })()}
                        </div>
                      ))
                    }
                  </div>
                )}
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
                          onChange={(e) => updateElectoralChildLabel(field.id, child.label, e.target.value)}
                          style={{ 
                            fontWeight: 'bold', 
                            border: 'none', 
                            background: 'transparent', 
                            outline: 'none', 
                            flex: 1 
                          }}
                        />
                        <FieldsElectoralControlsByField
                          childIndex={childIndex}
                          columnChildren={getElectoralColumnChildren(field, currentColumn).length}
                          starClick={() => moveFieldBetweenColumns(field.id, child.id, currentColumn, -1)}
                          upClick={() => moveFieldInElectoral(field.id, childIndex, childIndex - 1)}
                          downClick={() => moveFieldInElectoral(field.id, childIndex, childIndex + 1)}
                          removeClick={() => removeFieldFromElectoral(field.id, child.label)}
                        />
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

                          case 'color':
                            return (
                              <input
                                className="wikibox-field-input"
                                value={child.value}
                                onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                                placeholder="Enter text here"
                              />
                            );
                          
                          case 'line':
                            return (<></>);
                          
                          case 'electionfooter':
                          case 'electionheader':
                            return (
                              <FieldsElectionFooter
                                field={child}
                                fieldChange={(newList) => updateGroupChild(field.id, child.id, newList)}
                              />
                            );
                          
                          case 'date':
                            return (
                              <FieldsDate
                                field={field}
                                onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                              />
                            );
                          
                          case 'thumbnail':
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
                          
                          case 'inlineimage':
                            return (
                              <FieldsImage
                                field={child}
                                onUrlChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                                onClickCaption={(e) => toggleCaptionGroup(field.id, child.id, e.target.checked)}
                                onEditCaption={(e) => updateCaptionGroup(field.id, child.id, e.target.value)}
                                imageUpload={(file) => handleGroupImageUpload(file, field.id, child.id, updateGroupChild)}
                                noCaption
                              />
                            );
                          
                          case 'link':
                            return (
                              <FieldsLink
                                text={(child.value || {}).text || ''}
                                url={(child.value || {}).url || ''}
                                onChange1={(e) => updateGroupChild(field.id, child.id, { 
                                    ...(child.value || {}), 
                                    text: e.target.value 
                                  })}
                                  onChange2={(e) => updateGroupChild(field.id, child.id, { 
                                    ...(child.value || {}), 
                                    url: e.target.value 
                                  })}
                                />
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
              <CollapseButton onClick={() => toggleGroupCollapse(field.id)} isCollapsed={field.isCollapsed}/>
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

                        case 'color':
                          return (
                            <input
                              className="wikibox-field-input"
                              value={child.value}
                              onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                              placeholder="Enter text here"
                            />
                          );
      
                        case 'line':
                          return (<></>);
                        
                        case 'electionheader':
                        case 'electionfooter':
                          return (
                            <FieldsElectionFooter
                              field={child}
                              fieldChange={(newList) => updateGroupChild(field.id, child.id, newList)}
                            />
                          );
                        
                        case 'date':
                          return (
                            <FieldsDate
                              field={field}
                              onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                            />
                          );
                        
                        case 'thumbnail':
                        case 'inlineimage':
                          return (
                            <FieldsImage
                              field={child}
                              onUrlChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                              onClickCaption={(e) => toggleCaptionGroup(field.id, child.id, e.target.checked)}
                              onEditCaption={(e) => updateCaptionGroup(field.id, child.id, e.target.value)}
                              imageUpload={(file) => handleGroupImageUpload(file, field.id, child.id, updateGroupChild)}
                              noCaption
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
      case 'thumbnail':
        return <PreviewImage field={field} maxWidth={'50px'}/>;
      
      case 'line':
        return <hr/>;
      
      case 'image':
        return <PreviewImage field={field} maxWidth={'100%'}/>
      
      case 'inlineimage':
        return <PreviewImage field={field} maxWidth={'150px'} noCaption inline/>
      
      case 'color':
        return <div style={{ height: '6px', backgroundColor: field.value, width: '100%' }}></div>
      
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
              renderPreviewValue(child)
            ))
          );
      
      case 'electoral':
        return (
            field.children && field.children.map((child) => (
              renderPreviewValue(child)
            ))
          );
      
      case 'electionfooter':
      return <>
        {field.value.first && <div style={{textAlign: 'left'}}>{parseTextWithSpans(field.value.first)}</div>}
        {field.value.last && <div style={{textAlign: 'right'}}>{parseTextWithSpans(field.value.last)}</div>}
      </>
      
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
            {
              field.type === 'color' ? (
                <td
                  className="wikibox-preview-value-container"
                  style={{ height: '6px', backgroundColor: field.value }}
                ></td>
              ) : (
                <td className="wikibox-preview-value-container">
                  {renderPreviewValue(field)}
                </td>
              )
            }
          </tr>
          <tr>
            <td colSpan="2" className="middle"></td>
          </tr>
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
    else if (field.position === 'ternary' || field.position === 'binary') {
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
          else if (child.position === 'binary' || child.type === 'electionfooter') {
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
          else if (child.type === 'thumbnail' || child.type === 'image') {
            return (
              <tr key={child.id} className="wikibox-preview-row">
                <td colSpan="2" className="wikibox-preview-image">
                  {renderPreviewValue(child)}
                </td>
              </tr>
            );
          }
          return renderTableRow(child);
        })
      );
    }
    else if (field.position === 'electoral') {
      if (!field.children || field.children.length <= 0) {
        return null;
      }

      const columns = parseInt(field.value.columns) || 1;
      var maxColumnsPerRow = 3;
      if (columns === 4) {
        maxColumnsPerRow = 2;
      }
      ensureColumnData(field, columns);
      
      const headerRows = field.children.filter(child => child.columnIndex === -1);
      const regularChildren = field.children.filter(child => child.columnIndex !== -1);
      
      const rowGroups = {};
      regularChildren.forEach(child => {
        const rowKey = child.label;
        
        if (!rowGroups[rowKey]) {
          rowGroups[rowKey] = {};
        }
        
        const columnIndex = child.columnIndex ?? 0;
        rowGroups[rowKey][columnIndex] = child;
      });
      
      const columnChunks = Math.ceil(columns / maxColumnsPerRow);
      
      return (
        <>
          <tr>
            <td colSpan="2" className="wikibox-preview-wrapper-electoral">
              <table className="wikibox-preview-wrapper-electoral-table">
                <tbody>
                  {headerRows.map((headerChild) => (
                    <tr key={`header-${headerChild.id}`} className="wikibox-preview-row">
                      <td className="wikibox-preview-label" style={{ paddingBottom: '1em' }}>
                        {parseTextWithSpans(headerChild.label)}
                      </td>
                      <td 
                        colSpan={Math.min(columns, maxColumnsPerRow)} 
                        className="wikibox-preview-value-container" 
                      >
                        {renderPreviewValue(headerChild)}
                      </td>
                    </tr>
                  ))}
                  
                  {Array.from({ length: columnChunks }).map((_, chunkIndex) => (
                    Object.entries(rowGroups).map(([rowLabel, columnData]) => {
                      const startColumn = chunkIndex * maxColumnsPerRow;
                      const endColumn = Math.min(startColumn + maxColumnsPerRow, columns);
                      
                      return (
                        <tr key={`${rowLabel}-chunk-${chunkIndex}`} className="wikibox-preview-row">
                          <td className="wikibox-preview-label">
                            {parseTextWithSpans(rowLabel)}
                          </td>
                          
                          {Array.from({ length: endColumn - startColumn }).map((_, colIndex) => {
                            const actualColumnIndex = startColumn + colIndex;
                            
                            const style = {
                              ...(colIndex !== 0 && { paddingLeft: "1px" }),
                              ...(colIndex !== endColumn - startColumn - 1 && { paddingRight: "1px" })
                            };
                            
                            return (
                              <td key={colIndex} className="wikibox-preview-value-container" style={style}>
                                {(() => {
                                  const cellData = columnData[actualColumnIndex];
                                  if (!cellData) {
                                    return <span className="empty-cell">—</span>;
                                  }
                                  return renderPreviewValue(cellData);
                                })()}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })
                  )).flat()}
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
    <div className="wikibox-builder-container" style={{ display: 'flex', minHeight: '100vh', maxWidth: '95vw', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar fieldTypes={fieldTypes} handleDragStart={handleDragStart}/>

      <div className="wikibox-main-content" style={{ flex: 1, padding: '20px', display: 'flex', gap: '20px' }}>
        <div className="wikibox-editor" style={{ flex: 1 }}>
          <h2 className="wikibox-editor-title">Wikibox Builder — Elections</h2>
          
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
          <div className="wikibox-preview-wrapper">
            <div className="wikibox-preview-header">{title}</div>
            <PreviewTable title="">
              {fields.map((field) => renderTableRow(field))}
            </PreviewTable>
          </div>
        </PreviewContainer>
      </div>
    </div>
  );
};

export default ElectionBuilder;
