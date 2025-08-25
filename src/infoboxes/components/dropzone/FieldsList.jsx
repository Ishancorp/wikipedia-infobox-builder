const FieldsList = ({ fields, parseTextWithSpans, updateFieldLabel, moveField, removeField, renderFieldValue }) => (
  <div className="wikibox-fields-list">
    {fields.map((field, index) => (
      <div key={field.id} className="wikibox-field-editor">
        <div className="wikibox-field-header">
          <input
            className="wikibox-field-label-input"
            type="text"
            value={parseTextWithSpans(field.label)}
            onChange={(e) => updateFieldLabel(field.id, e.target.value)}
            style={{ fontWeight: 'bold', border: 'none', background: 'transparent', outline: 'none' }}
          />
          <div className="wikibox-field-controls">
            {index > 0 && (
              <button
                className="list-move-btn"
                onClick={() => moveField(index, index - 1)}
              >
                ↑
              </button>
            )}
            {index < fields.length - 1 && (
              <button
                className="list-move-btn"
                onClick={() => moveField(index, index + 1)}
              >
                ↓
              </button>
            )}
            <button
              className='remove-btn'
              onClick={() => removeField(field.id)}
            >
              ×
            </button>
          </div>
        </div>
        <div className="wikibox-field-content">
          {renderFieldValue(field)}
        </div>
      </div>
    ))}
  </div>
);

export default FieldsList;
