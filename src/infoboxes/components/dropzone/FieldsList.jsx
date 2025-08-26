import ListMoveButton from "../buttons/ListMoveButton";
import RemoveButton from "../buttons/RemoveButton";
import './FieldsList.css'

const FieldsList = ({ fields, parseTextWithSpans, updateFieldLabel, moveField, removeField, renderFieldValue }) => (
  fields.length === 0 ? (
    <div className="wikibox-drop-placeholder">
      Drag field types here to build your wikibox
    </div>
  ) : (
    <div className="wikibox-fields-list">
      {fields.map((field, index) => (
        <div key={field.id} className="wikibox-field-editor">
          <div className="wikibox-field-header">
            <input
              className="wikibox-field-label-input"
              type="text"
              value={parseTextWithSpans(field.label)}
              onChange={(e) => updateFieldLabel(field.id, e.target.value)}
            />
            <div className="wikibox-field-controls">
              {index > 0 && (
                <ListMoveButton type="up" onClick={() => moveField(index, index - 1)} />
              )}
              {index < fields.length - 1 && (
                <ListMoveButton type="down" onClick={() => moveField(index, index + 1)} />
              )}
              <RemoveButton onClick={() => removeField(field.id)} />
            </div>
          </div>
          <div className="wikibox-field-content">
            {renderFieldValue(field)}
          </div>
        </div>
      ))}
    </div>
  )
);

export default FieldsList;
