import './BiographyBuilderPreview.css';
import WikiboxBuilderBase, { FieldRenderer, PreviewRenderer } from '../base/WikiboxBuilderBase';
import allFieldTypes from '../../jsons/allFieldTypes.json';
import helpers from '../helpers/helpers.jsx';
import FieldsTextArea from '../components/dropzone/FieldsTextArea/FieldsTextArea.jsx';
import FieldsTreeList from '../components/dropzone/FieldsTreeList/FieldsTreeList.jsx';
import FieldsDate from '../components/dropzone/FieldsDate/FieldsDate.jsx';
import FieldsImage from '../components/dropzone/FieldsImage/FieldsImage.jsx';
import FieldsLink from '../components/dropzone/FieldsLink/FieldsLink.jsx';
import CollapseButton from '../components/buttons/CollapseButton.jsx';
import FieldsGroupControlsByField from '../components/dropzone/FieldsGroup/FieldsGroupControlsByField.jsx';
import PreviewImage from '../components/previews/PreviewImage/PreviewImage.jsx';
import PreviewLink from '../components/previews/PreviewLink/PreviewLink.jsx';
import RenderEmptyRow from '../components/render/RenderEmptyRow.jsx';

const { parseTextWithSpans, handleImageUpload, handleGroupImageUpload } = helpers;

class BiographyFieldRenderer extends FieldRenderer {
  renderFieldValue(field) {
    const { 
      updateField, 
      toggleCaption, 
      updateCaption,
      draggedItem,
      setDraggedItem,
      addFieldToGroup,
      toggleGroupCollapse,
      updateGroupChild,
      updateGroupChildLabel,
      moveFieldInGroup,
      removeFieldFromGroup,
      updateCaptionGroup,
      toggleCaptionGroup
    } = this.context;
    
    switch (field.type) {
      case 'singletext':
      case 'text':
      case 'subheader':
        return (
          <FieldsTextArea 
            field={field} 
            onChange={(e) => updateField(field.id, e.target.value)}
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
            url={field.value.url} 
            text={field.value.text}
            onChange1={(e) => updateField(field.id, { ...field.value, text: e.target.value })}
            onChange2={(e) => updateField(field.id, { ...field.value, url: e.target.value })}
          />
        );
      
      case 'group':
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
                      
                      {(() => {
                        switch (child.type) {
                          case 'subheader':
                          case 'text':
                          case 'singletext':
                            return (
                              <FieldsTextArea 
                                field={child} 
                                onChange={(e) => updateGroupChild(field.id, child.id, e.target.value)}
                              />
                            );
                          
                          case 'date':
                            return (
                              <FieldsDate
                                field={child}
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
  }
}

class BiographyPreviewRenderer extends PreviewRenderer {
  renderPreviewValue(field) {
    switch (field.type) {
      case 'image':
        return <PreviewImage field={field} maxWidth={'100%'}/>;
      
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
        return <PreviewLink field={field}/>;
      
      case 'group':
        return (
          field.children && field.children.map((child) => (
            <div key={child.id} style={{ marginBottom: '2px', paddingLeft: '12px' }}>
              <strong>{child.label}:</strong> {this.renderPreviewValue(child)}
            </div>
          ))
        );
      
      default:
        return <span className="wikibox-preview-value">{parseTextWithSpans(field.value)}</span>;
    }
  }

  renderTableRow(field, context) {
    if (field.position === 'normal') {
      return (
        <>
          <tr key={field.id} className="wikibox-preview-row">
            <td className="wikibox-preview-label">
              {parseTextWithSpans(field.label)}
            </td>
            <td className="wikibox-preview-value-container" style={{textAlign: 'left'}}>
              {this.renderPreviewValue(field)}
            </td>
          </tr>
          <RenderEmptyRow/>
        </>
      );
    }
    else if (field.position === 'single') {
      return (
        <>
          <tr key={field.id} className="wikibox-preview-row">
            <td colSpan="2" className="wikibox-preview-value-single-container">
              {this.renderPreviewValue(field)}
            </td>
          </tr>
          <RenderEmptyRow/>
        </>
      );
    }
    else if (field.position === 'subheader') {
      return (
        <tr key={field.id} className="wikibox-preview-row">
          <td colSpan="2" className="wikibox-preview-subheader">
            <div className="wikibox-preview-subheader">
              {this.renderPreviewValue(field)}
            </div>
          </td>
        </tr>
      );
    }
    else if (field.position === 'image') {
      return (
        <tr key={field.id} className="wikibox-preview-row">
          <td colSpan="2" className="wikibox-preview-image">
            {this.renderPreviewValue(field)}
          </td>
        </tr>
      );
    }
    else if (field.position === 'group') {
      return (
        field.children && field.children.map((child) => (
          this.renderTableRow(child, context)
        ))
      );
    }
  }
}

const BiographyBuilder = () => {
  const fieldTypes = allFieldTypes.Biography;
  const fieldRenderer = new BiographyFieldRenderer();
  const previewRenderer = new BiographyPreviewRenderer();

  const renderFieldValue = (field, context) => {
    fieldRenderer.context = context;
    return fieldRenderer.renderFieldValue(field);
  };

  const renderTableRow = (field, context) => {
    return previewRenderer.renderTableRow(field, context);
  };

  return (
    <WikiboxBuilderBase
      builderType="Biography"
      fieldTypes={fieldTypes}
      renderFieldValue={renderFieldValue}
      renderTableRow={renderTableRow}
    />
  );
};

export default BiographyBuilder;
