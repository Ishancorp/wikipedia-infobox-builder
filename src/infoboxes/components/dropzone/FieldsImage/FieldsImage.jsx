import React, { useState } from 'react';
import "./FieldsImage.css"

export default function FieldsImage({ field, imageUpload, onUrlChange, onClickCaption, onEditCaption, noCaption }) {
  const [imageInputMode, setImageInputMode] = useState('url');
  return (
    <div className="wikibox-image-container">
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', alignItems: 'center' }}>
        <button
          onClick={() => imageInputMode === 'url' ? setImageInputMode('file') : setImageInputMode('url')}
          style={{
            padding: '4px 8px',
            fontSize: '11px',
            background: imageInputMode === 'url' ? '#2196F3' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            minWidth: '45px'
          }}
          title={`Switch to ${imageInputMode === 'url' ? 'File' : 'URL'} input`}
        >
          {imageInputMode === 'url' ? 'URL' : 'File'}
        </button>
        
        {imageInputMode === 'url' ? (
          <input
            className="wikibox-field-input wikibox-image-input"
            type="url"
            placeholder="Image URL"
            value={field.value.startsWith('data:') ? '' : field.value}
            onChange={onUrlChange}
            style={{ flex: 1 }}
          />
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                imageUpload(file);
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
                  onChange={onClickCaption}
                />
                Show Caption
              </label>
              {field.showCaption && (
                <textarea
                  className="wikibox-field-input wikibox-caption-input"
                  type="text"
                  placeholder="Enter caption"
                  value={field.caption}
                  onChange={onEditCaption}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
