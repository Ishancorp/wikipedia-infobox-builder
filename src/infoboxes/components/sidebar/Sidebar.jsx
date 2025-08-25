const Sidebar = ({ fieldTypes, handleDragStart }) => (
  <div className="wikibox-sidebar">
    <h3 className="wikibox-sidebar-title" style={{ marginTop: 0 }}>Field Types</h3>
    <div className="wikibox-field-types">
      {fieldTypes.map((fieldType) => (
        <div
          key={fieldType.type}
          className="wikibox-field-type-item"
          draggable
          onDragStart={(e) => handleDragStart(e, fieldType)}
          style={{
            padding: '12px',
            margin: '8px 0',
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span className="wikibox-field-type-icon">{fieldType.icon}</span>
          <span className="wikibox-field-type-label">{fieldType.label}</span>
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;
