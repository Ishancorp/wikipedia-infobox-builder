const Sidebar = ({ fieldTypes, handleDragStart }) => (
  <div className="wikibox-sidebar">
    <h3 className="wikibox-sidebar-title" style={{ marginTop: 0 }}>Field Types</h3>
    <div className="wikibox-field-types">
      {console.log(fieldTypes)}
      {fieldTypes.map((fieldType) => (
        <div key={fieldType.type}>
          <h4>{fieldType.type}</h4>
          {fieldType.list.map((field) => (
            <div
              key={field.type}
              className="wikibox-field-type-item"
              draggable
              onDragStart={(e) => handleDragStart(e, field)}
              style={{
                padding: "12px",
                margin: "8px 0",
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "4px",
                cursor: "grab",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span className="wikibox-field-type-icon">{field.icon}</span>
              <span className="wikibox-field-type-label">{field.label}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Sidebar;
