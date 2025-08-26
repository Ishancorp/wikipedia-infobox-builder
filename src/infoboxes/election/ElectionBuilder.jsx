import React, { useState, useRef } from 'react';
import './ElectionBuilderPreview.css';
import '../css/WikiboxBuilderField.css';
import helpers from '../helpers/helpers.jsx'
import PreviewContainer from '../components/previews/PreviewContainer/PreviewContainer.jsx';
import PreviewTable from '../components/previews/PreviewTable/PreviewTable.jsx';
import Sidebar from '../components/sidebar/sidebar.jsx';
import TitleEditor from '../components/title/TitleEditor.jsx';
import FieldsList from '../components/dropzone/FieldsList.jsx';
import RemoveButton from '../components/buttons/RemoveButton.jsx';
import CollapseButton from '../components/buttons/CollapseButton.jsx';
import MoveButton from '../components/buttons/MoveButton.jsx';
import PreviewImage from '../components/previews/PreviewImage/PreviewImage.jsx';
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
      type: "Templates",
      list: [
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
          type: "electoral-template",
          label: "Electoral Template (Parliamentary)",
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
              label: 'Leader', 
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
              label: 'Leader\'s seat', 
              value: '*Illinois*' ,
              columnIndex: 0
            },
            { 
              type: 'text', 
              position: 'normal', 
              label: 'Last election', 
              value: '203 seats, 45.5%' ,
              columnIndex: 0
            },
            { 
              type: 'text', 
              position: 'normal', 
              label: 'Seats before', 
              value: '365' ,
              columnIndex: 0
            },
            { 
              type: 'text', 
              position: 'normal', 
              label: 'Seats won', 
              value: '\'\'\'365\'\'\'' ,
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
              type: 'text', 
              position: 'normal', 
              label: 'Swing', 
              value: '{{increase}} 7.5 *pp*' ,
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
              label: 'Leader', 
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
              label: 'Leader\'s seat', 
              value: '*Arizona*' ,
              columnIndex: 1
            },
            { 
              type: 'text', 
              position: 'normal', 
              label: 'Last election', 
              value: '203 seats, 45.5%' ,
              columnIndex: 1
            },
            { 
              type: 'text', 
              position: 'normal', 
              label: 'Seats before', 
              value: '365' ,
              columnIndex: 1
            },
            { 
              type: 'text', 
              position: 'normal', 
              label: 'Seats won', 
              value: '265' ,
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
            { 
              type: 'text', 
              position: 'normal', 
              label: 'Swing', 
              value: '{{increase}} 7.5 *pp*' ,
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
      ]
    },
    {
      type: "Elements",
      list: [
        { type: 'electoral', position: 'electoral', label: 'Electoral', icon: '📁' },
        { type: 'group', position: 'group', label: 'Group', icon: '📁' },
        { type: 'text', position: 'normal', label: 'Text Field', icon: '📝' },
        { type: 'color', position: 'normal', label: 'Color', icon: '🔴' },
        { type: 'singletext', position: 'single', label: 'Single Text', icon: '📝' },
        { type: 'line', position: 'single', label: 'Line', icon: '—' },
        { type: 'electionheader', position: 'ternary', label: 'Election Header', icon: '📝' },
        { type: 'electionfooter', position: 'binary', label: 'Election Footer', icon: '📝' },
        { type: 'image', position: 'image', label: 'Image', icon: '🖼️' },
        { type: 'thumbnail', position: 'image', label: 'Thumbnail', icon: '🖼️' },
        { type: 'inlineimage', position: 'normal', label: 'Inline Image', icon: '🖼️' },
        { type: 'date', position: 'normal', label: 'Date', icon: '📅' },
        { type: 'link', position: 'normal', label: 'Link', icon: '🔗' },
      ]
    },
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
      case 'image': return '';
      case 'inlineimage': return '';
      case 'thumbnail': return '';
      case 'date': return new Date().toLocaleDateString();
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
        position: child.position || (child.type === 'singletext' ? 'single' : 'normal'),
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

  const renderElectoralChildControls = (field, child, childIndex, currentColumn, columnChildren) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        <MoveButton
          type='star'
          onClick={() => moveFieldBetweenColumns(field.id, child.id, currentColumn, -1)}
          title="Make header row"
        />
        {childIndex > 0 && (
          <MoveButton
            type='up'
            onClick={() => moveFieldInElectoral(field.id, childIndex, childIndex - 1)}
            title="Move up in column"
          />
        )}
        {childIndex < columnChildren.length - 1 && (
          <MoveButton
            type='down'
            onClick={() => moveFieldInElectoral(field.id, childIndex, childIndex + 1)}
            title="Move down in column"
          />
        )}
        
        <RemoveButton small onClick={() => removeFieldFromElectoral(field.id, child.label)} />
      </div>
    );
  };

  const renderFieldValue = (field) => {
    switch (field.type) {
      case 'electionheader':
        return (
          <>
            <input
                className="wikibox-field-input"
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
                className="wikibox-field-input"
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
                className="wikibox-field-input"
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
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            marginBottom: '4px' 
                          }}>
                            <input
                              type="text"
                              value={headerChild.label}
                              onChange={(e) => updateElectoralChildLabel(field.id, headerChild.label, e.target.value)}
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
                              {headerIndex > 0 && (
                                <MoveButton
                                  type='up'
                                  onClick={() => moveHeaderField(field.id, headerChild.id, 'up')}
                                  title="Move header up"
                                />
                              )}
                              {headerIndex < field.children.filter(child => child.columnIndex === -1).length - 1 && (
                                <MoveButton
                                  type='down'
                                  onClick={() => moveHeaderField(field.id, headerChild.id, 'down')}
                                  title="Move header down"
                                />
                              )}
                              
                              <MoveButton
                                type='col'
                                onClick={() => moveFieldBetweenColumns(field.id, headerChild.id, -1, 0)}
                                title="Move to column 1"
                              />
                              
                              <RemoveButton small onClick={() => removeFieldFromGroup(field.id, headerChild.id)} title="Remove header" />
                            </div>
                          </div>
                          
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
                                  className="wikibox-field-input"
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
                                  className="wikibox-field-input"
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
                                  className="wikibox-field-input"
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
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {childIndex > 0 && (
                          <MoveButton
                            type='up'
                            onClick={() => moveFieldInGroup(field.id, childIndex, childIndex - 1)}
                          />
                        )}
                        {childIndex < field.children.length - 1 && (
                          <MoveButton
                            type='down'
                            onClick={() => moveFieldInGroup(field.id, childIndex, childIndex + 1)}
                          />
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
                                className="wikibox-field-input"
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
                                className="wikibox-field-input"
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
                                className="wikibox-field-input"
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
        return <PreviewImage field={field} maxWidth={'50px'}/>;
      
      case 'line':
        return <hr/>;
      
      case 'image':
        return <PreviewImage field={field} maxWidth={'100%'}/>
      
      case 'inlineimage':
        return <PreviewImage field={field} maxWidth={'150px'} noCaption inline/>
      
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
                        {headerChild.type === 'color' ? (
                          <div style={{ height: '6px', backgroundColor: headerChild.value, width: '100%' }}></div>
                        ) : (
                          renderPreviewValue(headerChild)
                        )}
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
                                  if (cellData.type === 'color') {
                                    return <div style={{ height: '6px', backgroundColor: cellData.value, width: '100%' }}></div>;
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
