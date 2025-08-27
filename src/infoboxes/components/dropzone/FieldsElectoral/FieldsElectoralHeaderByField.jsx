import MoveButton from "../../buttons/MoveButton";
import RemoveButton from "../../buttons/RemoveButton";

export default function FieldsElectoralHeaderByField({ headerIndex, field, child, onChangeName, upClick, downClick, columnClick, removeClick }) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '4px' 
    }}>
      <input
        type="text"
        value={child.label}
        onChange={onChangeName}
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
            onClick={upClick}
            title="Move header up"
          />
        )}
        {headerIndex < field.children.filter(child => child.columnIndex === -1).length - 1 && (
          <MoveButton
            type='down'
            onClick={downClick}
            title="Move header down"
          />
        )}
        
        <MoveButton
          type='col'
          onClick={columnClick}
          title="Move to column 1"
        />
        
        <RemoveButton small onClick={removeClick} title="Remove header" />
      </div>
    </div>
  );
}
