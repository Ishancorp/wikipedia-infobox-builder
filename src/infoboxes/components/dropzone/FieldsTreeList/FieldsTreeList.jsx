import "./FieldsTreeList.css";
import RemoveButton from "../../buttons/RemoveButton";
import MoveButton from "../../buttons/MoveButton";
import { useMemo } from "react";
import WikiboxListAddButton from "../../buttons/WikiboxListAddButton";

export default function FieldsTreeList({ field, fieldUpdater }) {
  const moveItem = (fromIndex, toIndex) => {
    const newList = [...field.value];
    const [movedItem] = newList.splice(fromIndex, 1);
    newList.splice(toIndex, 0, movedItem);
    fieldUpdater(newList);
  };

  const maxButtonWidth = useMemo(() => {
    let maxButtons = 0;
    
    field.value.forEach((_, index) => {
      let buttonCount = 1;
      
      if (index > 0) buttonCount++;
      if (index < field.value.length - 1) buttonCount++;
      
      if (buttonCount > maxButtons) {
        maxButtons = buttonCount;
      }
    });
    
    const buttonWidth = 20;
    const gapWidth = 2;
    return maxButtons * buttonWidth + (maxButtons - 1) * gapWidth + 2;
  }, [field.value]);

  return (
    <div className="wikibox-list-container">
      {field.value.map((item, index) => (
        <div key={index} className="wikibox-list-item" style={{ display: 'flex', alignItems: 'center', marginBottom: '2px', gap: '2px' }}>
          <input
            className="wikibox-field-input wikibox-list-input"
            type="text"
            value={item}
            onChange={(e) => {
              const newList = [...field.value];
              newList[index] = e.target.value;
              fieldUpdater(newList);
            }}
            style={{ width: `calc(100% - ${maxButtonWidth + 4}px)`, flexShrink: 0 }}
          />
          <div 
            style={{ 
              display: 'flex', 
              gap: '2px', 
              width: `${maxButtonWidth}px`,
              justifyContent: 'flex-end',
              flexShrink: 0
            }}
          >
            {index > 0 && (
              <MoveButton 
                type='up' 
                onClick={() => moveItem(index, index - 1)} 
              />
            )}
            {index < field.value.length - 1 && (
              <MoveButton 
                type='down' 
                onClick={() => moveItem(index, index + 1)} 
              />
            )}
            <RemoveButton 
              small
              onClick={() => {
                const newList = field.value.filter((_, i) => i !== index);
                fieldUpdater(newList);
              }}
            />
          </div>
        </div>
      ))}
      <WikiboxListAddButton onClick={() => fieldUpdater([...field.value, 'New item'])}/>
    </div>
  );
}
