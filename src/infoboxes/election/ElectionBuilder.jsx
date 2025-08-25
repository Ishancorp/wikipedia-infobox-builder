import React, { useState, useRef } from 'react';
import './ElectionBuilderPreview.css';
import '../css/WikiboxBuilderField.css';
import helpers from '../helpers/helpers.jsx'
import PreviewContainer from '../components/previews/PreviewContainer/PreviewContainer.jsx';
import PreviewTable from '../components/previews/PreviewTable/PreviewTable.jsx';
import Sidebar from '../components/sidebar/sidebar.jsx';
import TitleEditor from '../components/title/TitleEditor.jsx';
import FieldsList from '../components/dropzone/FieldsList.jsx';
const { parseTextWithSpans, handleImageUpload, handleGroupImageUpload } = helpers;

const ElectionBuilder = () => {
  const [fields, setFields] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [title, setTitle] = useState('');
  const dragCounter = useRef(0);
  const [electoralColumnViews, setElectoralColumnViews] = useState({});
  const [imageInputModes, setImageInputModes] = useState({});

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
    {
      type: "electoral-template",
      label: "Electoral Template (Presidential)",
      icon: '📄',
      position: "electoral",
      isTemplate: true,
      value: {
        title: "Electoral Title",
        columns: 2,
        columnData: [{}, {}]
      },
      caption: "", 
      showCaption: false,
      parentGroup: null,
      children: [
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Turnout', 
          value: '61.6%^{*[1]*}{{increase}} 1.5 *pp*' ,
          columnIndex: -1
        },
        {
          type: "inlineimage",
          label: " ",
          position: "normal",
          value: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Obama_portrait_crop.jpg",
          caption: "", 
          showCaption: false,
          columnIndex: 0
        },
        { type: 'color', position: 'normal', label: '', value: '#3333FF', columnIndex: 0},
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Nominee', 
          value: '\'\'\'*Barack Obama*\'\'\'' ,
          columnIndex: 0
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Party', 
          value: '*Democratic*' ,
          columnIndex: 0
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Home state', 
          value: '*Illinois*' ,
          columnIndex: 0
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Running mate', 
          value: '\'\'\'*Joe Biden*\'\'\'' ,
          columnIndex: 0
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Electoral vote', 
          value: '\'\'\'365\'\'\'' ,
          columnIndex: 0
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'States carried', 
          value: '\'\'\'28 + *DC* + *NE-02*\'\'\'' ,
          columnIndex: 0
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Popular vote', 
          value: '\'\'\'69,498,516\'\'\'' ,
          columnIndex: 0
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Percentage', 
          value: '\'\'\'52.9%\'\'\'' ,
          columnIndex: 0
        },
        {
          type: "inlineimage",
          label: " ",
          position: "normal",
          value: "https://upload.wikimedia.org/wikipedia/commons/d/d6/John_McCain_official_portrait_2009_%28cropped%29.jpg",
          caption: "", 
          showCaption: false,
          columnIndex: 1
        },
        { type: 'color', position: 'normal', label: '', value: '#E81B23', columnIndex: 1},
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Nominee', 
          value: '*John McCain*' ,
          columnIndex: 1
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Party', 
          value: '*Republican*' ,
          columnIndex: 1
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Home state', 
          value: '*Arizona*' ,
          columnIndex: 1
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Running mate', 
          value: '*Sarah Palin*' ,
          columnIndex: 1
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Electoral vote', 
          value: '173' ,
          columnIndex: 1
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'States carried', 
          value: '22' ,
          columnIndex: 1
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Popular vote', 
          value: '59,948,323' ,
          columnIndex: 1
        },
        { 
          type: 'text', 
          position: 'normal', 
          label: 'Percentage', 
          value: '45.7%' ,
          columnIndex: 1
        },
      ],
      isCollapsed: false
    },
    { 
      type: 'group-template', 
      position: 'group', 
      label: 'Bottom Footer Template', 
      icon: '📄',
      isTemplate: true,
      children: [
        { 
          type: 'line', 
          label: 'Line', 
          value: '--' 
        },
        {
          type: "image",
          label: " ",
          position: "single",
          value: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/ElectoralCollege2008.svg/2560px-ElectoralCollege2008.svg.png",
          caption: "Presidential election results map. Blue denotes states won by Obama/Biden and red denotes those won by McCain/Palin. Numbers indicate *electoral votes* cast by each state and the District of Columbia.", 
          showCaption: true,
          columnIndex: 1
        },
        { 
          type: 'line', 
          label: 'Line', 
          value: '--' 
        },
        { 
          type: 'electionfooter', 
          position: 'binary', 
          value: {
            first: '\'\'\'President before election\'\'\'', 
            middle: '', 
            last: '\'\'\'Elected President\'\'\''
          } 
        },
        { 
          type: 'electionfooter', 
          position: 'binary', 
          value: {
            first: '*George W. Bush*\n*Republican*', 
            middle: '', 
            last: '*Barack Obama*\n*Democratic*'
          } 
        },
      ]
    },
    { type: 'electoral', position: 'electoral', label: 'Electoral', icon: '📁' },
    { type: 'group', position: 'group', label: 'Group', icon: '📁' },
    { type: 'text', position: 'normal', label: 'Text Field', icon: '📝' },
    { type: 'color', position: 'normal', label: 'Color', icon: '🔴' },
    { type: 'singletext', position: 'single', label: 'Single Text', icon: '📝' },
    { type: 'line', position: 'single', label: 'Line', icon: '—' },
    { type: 'electionheader', position: 'ternary', label: 'Election Header', icon: '📝' },
    { type: 'electionfooter', position: 'binary', label: 'Election Footer', icon: '📝' },
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

  const generateElectoralTemplate = (template) => {
    const baseId = Date.now();
    const electoralField = {
      id: baseId,
      type: 'electoral',
      label: template.label.replace(' Template', ''),
      position: 'electoral',
      value: {
        title: template.value.title,
        columns: template.value.columns,
        columnData: template.value.columnData
      },
      caption: template.value.caption || "",
      showCaption: template.value.showCaption || false,
      parentGroup: null,
      isCollapsed: false,
      children: template.children.map((child, index) => ({
        id: baseId + index + 1,
        type: child.type,
        label: child.label,
        position: child.position,
        value: child.value || getDefaultValue(child.type),
        caption: child.caption || "",
        showCaption: child.showCaption || false,
        parentGroup: baseId,
        columnIndex: child.columnIndex || 0
      }))
    };
    
    return electoralField;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragCounter.current = 0;
    
    if (draggedItem) {
      let newField;
      
      if (draggedItem.isTemplate || draggedItem.type === 'electoral-template') {
        if (draggedItem.type === 'electoral-template') {
          newField = generateElectoralTemplate(draggedItem);
        } else {
          newField = generateTemplateGroup(draggedItem);
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

  const getDefaultValue = (type) => {
    switch (type) {
      case 'text': return '';
      case 'color': return '#FFFFFF';
      case 'singletext': return '';
      case 'line': return '';
      case 'electionheader': return {first: '', middle: '', last: ''};
      case 'electionfooter': return {first: '', middle: '', last: ''};
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
      value: getDefaultValue(sourceField.type)
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
      const currentColumn = electoralColumnViews[groupId] || 0;
      const currentColumnChildren = getElectoralColumnChildren(parentField, currentColumn);
      
      if (fromIndex >= currentColumnChildren.length || toIndex >= currentColumnChildren.length) {
        return;
      }
      
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
                ? { ...child, label: newLabel }
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
        caption: child.caption || "",
        showCaption: child.showCaption || false,
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
                return field.children; // No change if out of bounds
              }
              
              // Create new header array with swapped positions
              const newHeaderChildren = [...headerChildren];
              [newHeaderChildren[currentIndex], newHeaderChildren[targetIndex]] = 
              [newHeaderChildren[targetIndex], newHeaderChildren[currentIndex]];
              
              // Combine headers and non-headers back together
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

  const renderElectoralChildControls = (field, child, childIndex, currentColumn, columnChildren) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        <button
          className='move-btn'
          onClick={() => moveFieldBetweenColumns(field.id, child.id, currentColumn, -1)}
          title="Make header row"
          style={{ background: child.columnIndex === -1 ? '#ff9800' : '#666' }}
        >
          ★
        </button>
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
        
        {parseInt(field.value.columns) > 1 && (
          <>
            <button
              className='move-btn'
              onClick={() => duplicateFieldToColumn(field.id, child.id, (currentColumn + 1) % parseInt(field.value.columns))}
              title="Duplicate to next column"
            >
              ⟶
            </button>
            
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
      case 'electionfooter':
        return (
          <>
            <textarea
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
            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
              <button
                onClick={() => toggleImageInputMode(field.id)}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  background: getImageInputMode(field.id) === 'url' ? '#2196F3' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  minWidth: '45px'
                }}
                title={`Switch to ${getImageInputMode(field.id) === 'url' ? 'File' : 'URL'} input`}
              >
                {getImageInputMode(field.id) === 'url' ? 'URL' : 'File'}
              </button>
              
              {getImageInputMode(field.id) === 'url' ? (
                <input
                  className="wikibox-field-input wikibox-image-input"
                  type="url"
                  placeholder="Image URL"
                  value={field.value.startsWith('data:') ? '' : field.value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  style={{ flex: 1 }}
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleImageUpload(file, field.id, updateField);
                    }
                  }}
                  style={{ flex: 1, fontSize: '11px' }}
                />
              )}
            </div>
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
            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
              <button
                onClick={() => toggleImageInputMode(field.id)}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  background: getImageInputMode(field.id) === 'url' ? '#2196F3' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  minWidth: '45px'
                }}
                title={`Switch to ${getImageInputMode(field.id) === 'url' ? 'File' : 'URL'} input`}
              >
                {getImageInputMode(field.id) === 'url' ? 'URL' : 'File'}
              </button>
              
              {getImageInputMode(field.id) === 'url' ? (
                <input
                  className="wikibox-field-input wikibox-image-input"
                  type="url"
                  placeholder="Image URL"
                  value={field.value.startsWith('data:') ? '' : field.value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  style={{ flex: 1 }}
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleImageUpload(file, field.id, updateField);
                    }
                  }}
                  style={{ flex: 1, fontSize: '11px' }}
                />
              )}
            </div>
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
            <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
              <button
                onClick={() => toggleImageInputMode(field.id)}
                style={{
                  padding: '4px 8px',
                  fontSize: '11px',
                  background: getImageInputMode(field.id) === 'url' ? '#2196F3' : '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  minWidth: '45px'
                }}
                title={`Switch to ${getImageInputMode(field.id) === 'url' ? 'File' : 'URL'} input`}
              >
                {getImageInputMode(field.id) === 'url' ? 'URL' : 'File'}
              </button>
              
              {getImageInputMode(field.id) === 'url' ? (
                <input
                  className="wikibox-field-input wikibox-image-input"
                  type="url"
                  placeholder="Image URL"
                  value={field.value.startsWith('data:') ? '' : field.value}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  style={{ flex: 1 }}
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      handleImageUpload(file, field.id, updateField);
                    }
                  }}
                  style={{ flex: 1, fontSize: '11px' }}
                />
              )}
            </div>
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
                  if (draggedItem && draggedItem.type !== 'group' && draggedItem.type !== 'electoral') {
                    const currentColumn = electoralColumnViews[field.id] || 0;
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
                
                {/* Header Section - shows fields with columnIndex: -1 */}
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
                          {/* Header controls row */}
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '4px' 
                          }}>
                            <input
                              type="text"
                              value={headerChild.label}
                              onChange={(e) => updateGroupChildLabel(field.id, headerChild.id, e.target.value)}
                              style={{ 
                                fontWeight: 'bold', 
                                border: 'none', 
                                background: 'transparent', 
                                outline: 'none', 
                                flex: 1 
                              }}
                              placeholder="Header label"
                            />
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {/* Move up/down within headers */}
                              {headerIndex > 0 && (
                                <button
                                  className='move-btn'
                                  onClick={() => moveHeaderField(field.id, headerChild.id, 'up')}
                                  title="Move header up"
                                >
                                  ↑
                                </button>
                              )}
                              {headerIndex < field.children.filter(child => child.columnIndex === -1).length - 1 && (
                                <button
                                  className='move-btn'
                                  onClick={() => moveHeaderField(field.id, headerChild.id, 'down')}
                                  title="Move header down"
                                >
                                  ↓
                                </button>
                              )}
                              
                              {/* Move to column */}
                              <button
                                className='move-btn'
                                onClick={() => moveFieldBetweenColumns(field.id, headerChild.id, -1, 0)}
                                title="Move to column 1"
                                style={{ background: '#2196F3' }}
                              >
                                →Col
                              </button>
                              
                              {/* Remove */}
                              <button
                                className='remove-btn'
                                onClick={() => removeFieldFromGroup(field.id, headerChild.id)}
                                title="Remove header"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                          
                          {/* Header value editing */}
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
                              
                              case 'subheader':
                                return (
                                  <textarea
                                    className="wikibox-field-input"
                                    value={headerChild.value}
                                    onChange={(e) => updateGroupChild(field.id, headerChild.id, e.target.value)}
                                    placeholder="Subheader text"
                                    style={{ 
                                      width: '100%', 
                                      minHeight: '30px',
                                      fontWeight: 'bold'
                                    }}
                                  />
                                );
                              
                              case 'inlineimage':
                              case 'image':
                              case 'thumbnail':
                                return (
                                  <div>
                                    <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
                                      <button
                                        onClick={() => toggleImageInputMode(`${field.id}-${headerChild.id}`)}
                                        style={{
                                          padding: '2px 6px',
                                          fontSize: '10px',
                                          background: getImageInputMode(`${field.id}-${headerChild.id}`) === 'url' ? '#2196F3' : '#4CAF50',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '2px',
                                          cursor: 'pointer',
                                          minWidth: '35px'
                                        }}
                                      >
                                        {getImageInputMode(`${field.id}-${headerChild.id}`) === 'url' ? 'URL' : 'File'}
                                      </button>
                                      
                                      {getImageInputMode(`${field.id}-${headerChild.id}`) === 'url' ? (
                                        <input
                                          className="wikibox-field-input"
                                          type="url"
                                          placeholder="Image URL"
                                          value={headerChild.value.startsWith('data:') ? '' : headerChild.value}
                                          onChange={(e) => updateGroupChild(field.id, headerChild.id, e.target.value)}
                                          style={{ flex: 1 }}
                                        />
                                      ) : (
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                              handleGroupImageUpload(file, field.id, headerChild.id, updateGroupChild);
                                            }
                                          }}
                                          style={{ flex: 1, fontSize: '10px' }}
                                        />
                                      )}
                                    </div>
                                    {headerChild.value && (
                                      <img 
                                        src={headerChild.value} 
                                        alt="header preview" 
                                        style={{ 
                                          maxWidth: headerChild.type === 'thumbnail' ? '50px' : '100px', 
                                          height: 'auto',
                                          display: 'block',
                                          margin: '4px auto'
                                        }}
                                        onError={(e) => e.target.style.display = 'none'}
                                      />
                                    )}
                                  </div>
                                );
                              
                              case 'list':
                              case 'treelist':
                                return (
                                  <div>
                                    {(headerChild.value || []).map((item, index) => (
                                      <div key={index} style={{ display: 'flex', marginBottom: '2px' }}>
                                        <input
                                          className="wikibox-field-input"
                                          type="text"
                                          value={item}
                                          onChange={(e) => {
                                            const newList = [...(headerChild.value || [])];
                                            newList[index] = e.target.value;
                                            updateGroupChild(field.id, headerChild.id, newList);
                                          }}
                                          style={{ flex: 1, marginRight: '4px' }}
                                        />
                                        <button
                                          className='remove-btn'
                                          onClick={() => {
                                            const newList = (headerChild.value || []).filter((_, i) => i !== index);
                                            updateGroupChild(field.id, headerChild.id, newList);
                                          }}
                                        >
                                          ×
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      className="wikibox-list-add-btn"
                                      onClick={() => updateGroupChild(field.id, headerChild.id, [...(headerChild.value || []), 'New item'])}
                                      style={{ fontSize: '11px', padding: '2px 6px' }}
                                    >
                                      + Add Item
                                    </button>
                                  </div>
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
                            return (
                              <>
                                <textarea
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
                                    style={{ maxWidth: '50px', height: 'auto' }}
                                    onError={(e) => e.target.style.display = 'none'}
                                  />
                                )}
                              </div>
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
                                )}
                              </div>
                            );
                          
                          case 'inlineimage':
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
                          return (
                            <>
                              <textarea
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
                                  style={{ maxWidth: '50px', height: 'auto' }}
                                  onError={(e) => e.target.style.display = 'none'}
                                />
                              )}
                            </div>
                          );

                        case 'image':
                          console.log(child);
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
                              )}
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
                        
                        case 'inlineimage':
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
              style={{ maxWidth: '150px', height: 'auto', display: 'block', margin: '0 auto' }}
              onError={(e) => e.target.style.display = 'none'}
            />
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
      console.log(field)
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
    else if (field.position === 'binary') {
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
      ensureColumnData(field, columns);
      
      // Separate header rows (columnIndex: -1) from regular rows
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
      
      return (
        <>
          <tr>
            <td colSpan="2" className="wikibox-preview-wrapper-electoral">
              <table className="wikibox-preview-wrapper-electoral-table">
                <tbody>
                  {/* Render header rows first */}
                  {headerRows.map((headerChild) => (
                    <tr key={`header-${headerChild.id}`} className="wikibox-preview-row">
                      <td className="wikibox-preview-label">
                        {parseTextWithSpans(headerChild.label)}
                      </td>
                      <td colSpan={columns + 1} className="wikibox-preview-value-container">
                        {headerChild.type === 'color' ? (
                          <div style={{ height: '6px', backgroundColor: headerChild.value, width: '100%' }}></div>
                        ) : (
                          renderPreviewValue(headerChild)
                        )}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Render regular rows */}
                  {Object.entries(rowGroups).map(([rowLabel, columnData]) => (
                    <tr key={rowLabel} className="wikibox-preview-row">
                      <td className="wikibox-preview-label">
                        {parseTextWithSpans(rowLabel)}
                      </td>
                      
                      {Array.from({ length: columns }).map((_, columnIndex) => (
                        <td key={columnIndex} className="wikibox-preview-value-container">
                          {(() => {
                            const cellData = columnData[columnIndex];
                            if (!cellData) {
                              return <span className="empty-cell">—</span>;
                            }
                            if (cellData.type === 'color') {
                              return <div style={{ height: '6px', backgroundColor: cellData.value, width: '100%' }}></div>;
                            }
                            return renderPreviewValue(cellData);
                          })()}
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
      <Sidebar fieldTypes={fieldTypes} handleDragStart={handleDragStart}/>

      <div className="wikibox-main-content" style={{ flex: 1, padding: '20px', display: 'flex', gap: '20px' }}>
        <div className="wikibox-editor" style={{ flex: 1 }}>
          <h2 className="wikibox-editor-title">Wikibox Editor — Elections</h2>
          
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
            {fields.length === 0 ? (
              <div className="wikibox-drop-placeholder" style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
                Drag field types here to build your wikibox
              </div>
            ) : (
              <FieldsList
                fields={fields}
                parseTextWithSpans={parseTextWithSpans}
                updateFieldLabel={updateFieldLabel}
                moveField={moveField}
                removeField={removeField}
                renderFieldValue={renderFieldValue}
              />
            )}
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
