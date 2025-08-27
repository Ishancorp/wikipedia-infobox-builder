import ElectoralButton from "../../buttons/ElectoralButton";

export default function FieldsElectoralControls({ columnCount, currentColumn, leftClick, rightClick }) {
  return (
    columnCount > 1 && (
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        marginLeft: '8px',
        alignItems: 'center'
      }}>
        <ElectoralButton onClick={leftClick} disabled={currentColumn === 0} direction="left"/>
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
        <ElectoralButton onClick={rightClick} disabled={currentColumn >= columnCount - 1} direction="right"/>
      </div>
    )
  );
}
