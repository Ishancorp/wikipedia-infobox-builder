import "./FieldsImage.css"
import helpers from "../../../helpers/helpers";
const { handleImageUpload } = helpers;

export default function FieldsImage({ field, imageInputModes, toggleImageInputMode, updateField, toggleCaption, updateCaption, noCaption }) {
    const getImageInputMode = (fieldId) => {
    return imageInputModes[fieldId] || 'url';
  };

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
          {!noCaption && (
            <>
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
        </>
      )}
    </div>
  )
}
