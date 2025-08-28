import './ElectionBuilderPreview.css';
import WikiboxBuilderBase, { FieldRenderer, PreviewRenderer } from '../base/WikiboxBuilderBase';
import helpers from '../helpers/helpers.jsx';
import FieldsElectionHeader from '../components/dropzone/FieldsElectionHeader/FieldsElectionHeader.jsx';
import FieldsElectionFooter from '../components/dropzone/FieldsElectionFooter/FieldsElectionFooter.jsx';
import FieldsColor from '../components/dropzone/FieldsColor/FieldsColor.jsx';
import FieldsImage from '../components/dropzone/FieldsImage/FieldsImage.jsx';
import FieldsLine from '../components/dropzone/FieldsLine/FieldsLine.jsx';
import FieldsTextArea from '../components/dropzone/FieldsTextArea/FieldsTextArea.jsx';
import FieldsDate from '../components/dropzone/FieldsDate/FieldsDate.jsx';
import FieldsLink from '../components/dropzone/FieldsLink/FieldsLink.jsx';
import CollapseButton from '../components/buttons/CollapseButton.jsx';
import FieldsElectoralControls from '../components/dropzone/FieldsElectoral/FieldsElectoralControls.jsx';
import FieldsElectoralControlsByField from '../components/dropzone/FieldsElectoral/FieldsElectoralControlsByField.jsx';
import FieldsElectoralHeaderByField from '../components/dropzone/FieldsElectoral/FieldsElectoralHeaderByField.jsx';
import FieldsGroupControlsByField from '../components/dropzone/FieldsGroup/FieldsGroupControlsByField.jsx';
import RenderEmptyRow from '../components/render/RenderEmptyRow.jsx';
import RenderElectoralTable from '../components/render/RenderElectoralTable.jsx';

const { parseTextWithSpans, handleImageUpload, handleGroupImageUpload, getDefaultValue } = helpers;

class ElectionFieldRenderer extends FieldRenderer {
  renderFieldValue(field) {
    const { 
      setShowTitleInBox,
      updateField, 
      toggleCaption, 
      updateCaption, 
    } = this.context;

    setShowTitleInBox(false);

    switch (field.type) {
      case 'electionheader':
        return (
          <FieldsElectionHeader
            field={field}
            fieldChange={(newList) => updateField(field.id, newList)}
          />
        );

      case 'electionfooter':
        return (
          <FieldsElectionFooter
            field={field}
            fieldChange={(newList) => updateField(field.id, newList)}
          />
        );

      case 'singletext':
      case 'text':
        return this.renderBasicTextField(field, (e) => updateField(field.id, e.target.value));

      case 'color':
        return (
          <FieldsColor 
            field={field} 
            onChange={(e) => updateField(field.id, e.target.value)}
          />
        );

      case 'line':
        return <FieldsLine/>;

      case 'date':
        return this.renderDateField(field, (e) => updateField(field.id, e.target.value));

      case 'image':
        return this.renderImageField(
          field,
          (e) => updateField(field.id, e.target.value),
          (e) => toggleCaption(field.id, e.target.checked),
          (e) => updateCaption(field.id, e.target.value),
          (file) => handleImageUpload(file, field.id, updateField)
        );

      case 'thumbnail':
      case 'inlineimage':
        return this.renderImageField(
          field,
          (e) => updateField(field.id, e.target.value),
          (e) => toggleCaption(field.id, e.target.checked),
          (e) => updateCaption(field.id, e.target.value),
          (file) => handleImageUpload(file, field.id, updateField),
          true // noCaption
        );

      case 'link':
        return this.renderLinkField(
          field,
          (e) => updateField(field.id, { ...field.value, text: e.target.value }),
          (e) => updateField(field.id, { ...field.value, url: e.target.value })
        );

      case 'electoral':
        return this.renderElectoralField(field);

      case 'group':
        return this.renderRegularGroupField(field);

      default:
        return <span className="wikibox-field-value">{field.value}</span>;
    }
  }

  renderElectoralField(field) {
    const { 
      draggedItem,
      setDraggedItem,
      toggleGroupCollapse,
      customStateValues,
      setCustomStateValues,
      removeFieldFromGroup
    } = this.context;

    const { electoralColumnViews = {} } = customStateValues;
    const currentColumn = electoralColumnViews[field.id] || 0;
    const columnCount = parseInt(field.value.columns) || 1;

    // Electoral-specific methods
    const addFieldToElectoralColumn = (electoralId, fieldType) => {
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
      
      this.context.setFields(fields => fields.map(f => 
        f.id === electoralId 
          ? { ...f, children: [...(f.children || []), ...newFields] }
          : f
      ));
    };

    const getElectoralColumnChildren = (field, columnIndex) => {
      return (field.children || []).filter(child => 
        (child.columnIndex ?? 0) === columnIndex
      );
    };

    const updateElectoralChildLabel = (groupId, oldLabel, newLabel) => {
      this.context.setFields(fields => fields.map(field => 
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

    const removeFieldFromElectoral = (groupId, fieldLabel) => {
      this.context.setFields(fields => fields.map(field => 
        field.id === groupId 
          ? { ...field, children: field.children.filter(child => child.label !== fieldLabel) }
          : field
      ));
    };

  const moveFieldBetweenColumns = (groupId, fieldId, fromColumn, toColumn) => {
    const { fields, setFields } = this.context;

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

  const moveFieldInElectoral = (groupId, fromIndex, toIndex) => {
    const { fields, setFields } = this.context;

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

  const moveHeaderField = (fieldId, headerChildId, direction) => {
    const { fields, setFields } = this.context;

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

              this.context.setFields(fields =>
                fields.map(f => {
                  if (f.id !== field.id) return f;

                  const oldColumns = parseInt(f.value.columns) || 1;
                  let updatedChildren = [...(f.children || [])];

                  if (newColumns > oldColumns) {
                    const groupedByLabel = {};
                    updatedChildren.forEach(child => {
                      if (child.columnIndex === -1) return;
                      if (!groupedByLabel[child.label]) {
                        groupedByLabel[child.label] = [];
                      }
                      groupedByLabel[child.label].push(child);
                    });

                    const baseId = Date.now();
                    Object.entries(groupedByLabel).forEach(([, children]) => {
                      const template = children[0];
                      for (let colIndex = oldColumns; colIndex < newColumns; colIndex++) {
                        updatedChildren.push({
                          ...template,
                          id: baseId + colIndex + Math.random(),
                          columnIndex: colIndex,
                          value: getDefaultValue(template.type)
                        });
                      }
                    });
                  } else if (newColumns < oldColumns) {
                    updatedChildren = updatedChildren.filter(c =>
                      c.columnIndex === -1 || c.columnIndex < newColumns
                    );
                  }

                  return {
                    ...f,
                    value: { ...f.value, columns: newColumns },
                    children: updatedChildren
                  };
                })
              );
            }}
            style={{ flex: 1 }}
          />
          
          <FieldsElectoralControls
            columnCount={columnCount}
            currentColumn={currentColumn}
            leftClick={() => setCustomStateValues(prev => ({
              ...prev,
              electoralColumnViews: {
                ...prev.electoralColumnViews,
                [field.id]: Math.max(0, currentColumn - 1)
              }
            }))}
            rightClick={() => setCustomStateValues(prev => ({
              ...prev,
              electoralColumnViews: {
                ...prev.electoralColumnViews,
                [field.id]: Math.min(columnCount - 1, currentColumn + 1)
              }
            }))}
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
            {/* Header fields */}
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
                      
                      {this.renderElectoralChildField(headerChild, field.id)}
                    </div>
                  ))
                }
              </div>
            )}

            {/* Column indicator */}
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

            {/* Column fields */}
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
                  
                  {this.renderElectoralChildField(child, field.id)}
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
    );
  }

  renderElectoralChildField(child, fieldId) {
    const { updateGroupChild, toggleCaptionGroup, updateCaptionGroup } = this.context;

    switch (child.type) {
      case 'text':
      case 'singletext':
        return (
          <FieldsTextArea 
            field={child} 
            onChange={(e) => updateGroupChild(fieldId, child.id, e.target.value)}
          />
        );

      case 'color':
        return (
          <FieldsColor 
            field={child} 
            onChange={(e) => updateGroupChild(fieldId, child.id, e.target.value)}
          />
        );

      case 'line':
        return (<FieldsLine/>);

      case 'electionfooter':
        return (
          <FieldsElectionFooter
            field={child}
            fieldChange={(newList) => updateGroupChild(fieldId, child.id, newList)}
          />
        );

      case 'electionheader':
        return (
          <FieldsElectionHeader
            field={child}
            fieldChange={(newList) => updateGroupChild(fieldId, child.id, newList)}
          />
        );

      case 'date':
        return (
          <FieldsDate
            field={child}
            onChange={(e) => updateGroupChild(fieldId, child.id, e.target.value)}
          />
        );

      case 'thumbnail':
      case 'image':
      case 'inlineimage':
        {
          const noCaption = child.type === 'inlineimage';
          return (
            <FieldsImage
              field={child}
              onUrlChange={(e) => updateGroupChild(fieldId, child.id, e.target.value)}
              onClickCaption={(e) => toggleCaptionGroup(fieldId, child.id, e.target.checked)}
              onEditCaption={(e) => updateCaptionGroup(fieldId, child.id, e.target.value)}
              imageUpload={(file) => handleGroupImageUpload(file, fieldId, child.id, updateGroupChild)}
              noCaption={noCaption}
            />
          );
        }

      case 'link':
        return (
          <FieldsLink
            text={(child.value || {}).text || ''}
            url={(child.value || {}).url || ''}
            onChange1={(e) => updateGroupChild(fieldId, child.id, { 
              ...(child.value || {}), 
              text: e.target.value 
            })}
            onChange2={(e) => updateGroupChild(fieldId, child.id, { 
              ...(child.value || {}), 
              url: e.target.value 
            })}
          />
        );

      default:
        return <span>{child.value}</span>;
    }
  }

  renderRegularGroupField(field) {
    const { 
      toggleGroupCollapse, 
      draggedItem, 
      setDraggedItem, 
      addFieldToGroup,
      updateGroupChildLabel,
      moveFieldInGroup,
      removeFieldFromGroup
    } = this.context;

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
                <div key={child.id} style={{ 
                  marginBottom: '8px', 
                  padding: '8px', 
                  background: 'white', 
                  border: '1px solid #ddd' 
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
                    <FieldsGroupControlsByField 
                      field={field} 
                      childIndex={childIndex}
                      upClick={() => moveFieldInGroup(field.id, childIndex, childIndex - 1)}
                      downClick={() => moveFieldInGroup(field.id, childIndex, childIndex + 1)}
                      removeClick={() => removeFieldFromGroup(field.id, child.id)}
                    />
                  </div>
                  {this.renderElectoralChildField(child, field.id)}
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
  }
}

class ElectionPreviewRenderer extends PreviewRenderer {
  renderPreviewValue(field) {
    switch (field.type) {
      case 'thumbnail':
        return super.renderImagePreview(field, '50px');

      case 'line':
        return <hr/>;

      case 'image':
        return super.renderImagePreview(field);

      case 'inlineimage':
        return super.renderImagePreview(field, '150px', true, true);

      case 'color':
        return this.renderColorPreview(field);

      case 'link':
        return super.renderLinkPreview(field);

      case 'group':
        return field.children && field.children.map((child) => 
          this.renderPreviewValue(child)
        );

      case 'electoral':
        return field.children && field.children.map((child) => 
          this.renderPreviewValue(child)
        );

      case 'electionfooter':
        return (
          <>
            {field.value.first && <div style={{textAlign: 'left'}}>{parseTextWithSpans(field.value.first)}</div>}
            {field.value.last && <div style={{textAlign: 'right'}}>{parseTextWithSpans(field.value.last)}</div>}
          </>
        );

      case 'electionheader':
        return (
          <>
            {field.value.first && <div>← {parseTextWithSpans(field.value.first)}</div>}
            <div><b>{parseTextWithSpans(field.value.middle)}</b></div>
            {field.value.last && <div>{parseTextWithSpans(field.value.last)} →</div>}
          </>
        );

      default:
        return super.renderBasicPreview(field);
    }
  }

  renderTableRow(field, context) {
    if (field.position === 'ternary' || field.position === 'binary') {
      return (
        <>
          <tr key={field.id} className="wikibox-preview-row">
            <td colSpan="2" className="wikibox-preview-value-ternary-container">
              {this.renderPreviewValue(field)}
            </td>
          </tr>
          <RenderEmptyRow/>
        </>
      );
    }
    else if (field.position === 'group') {
      return (
        field.children && field.children.map((child) => {
          return this.renderTableRow(child, context);
        })
      );
    }
    else if (field.position === 'electoral') {
      return this.renderElectoralTableRow(field, context);
    }
    return super.renderTableRow(field, this.renderPreviewValue);
  }

  renderElectoralTableRow(field, ) {
    if (!field.children || field.children.length <= 0) {
      return null;
    }

    const columns = parseInt(field.value.columns) || 1;
    var maxColumnsPerRow = 3;
    if (columns === 4) {
      maxColumnsPerRow = 2;
    }
    
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
        <RenderElectoralTable>
          {headerRows.map((headerChild) => (
            <>
              <tr key={`header-${headerChild.id}`} className="wikibox-preview-row">
                <td className="wikibox-preview-label">
                  {parseTextWithSpans(headerChild.label)}
                </td>
                <td 
                  colSpan={Math.min(columns, maxColumnsPerRow)} 
                  className="wikibox-preview-value-container" 
                >
                  {this.renderPreviewValue(headerChild)}
                </td>
              </tr>
              <RenderEmptyRow/>
              <RenderEmptyRow/>
              <RenderEmptyRow/>
            </>
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
                          return this.renderPreviewValue(cellData);
                        })()}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )).flat()}
        </RenderElectoralTable>
        <RenderEmptyRow/>
      </>
    );
  }
}

const ElectionBuilder = () => {
  const fieldRenderer = new ElectionFieldRenderer();
  const previewRenderer = new ElectionPreviewRenderer(helpers);

  // Custom state for election-specific features
  const customState = {
    initialState: {
      electoralColumnViews: {}
    }
  };

  const renderFieldValue = (field, context) => {
    fieldRenderer.context = context;
    return fieldRenderer.renderFieldValue(field);
  };

  const renderTableRow = (field, context) => {
    return previewRenderer.renderTableRow(field, context);
  };

  // Custom preview wrapper for elections
  const previewWrapper = (content, context) => (
    <div className="wikibox-preview-wrapper">
      <div className="wikibox-preview-header">{context.title}</div>
      {content}
    </div>
  );

  return (
    <WikiboxBuilderBase
      builderType="Elections"
      toJSON={'Election'}
      renderFieldValue={renderFieldValue}
      renderTableRow={renderTableRow}
      customState={customState}
      previewWrapper={previewWrapper}
    />
  );
};

export default ElectionBuilder;
