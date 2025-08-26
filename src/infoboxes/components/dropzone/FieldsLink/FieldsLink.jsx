import "./FieldsLink.css"

export default function FieldsLink({ text, url, onChange1, onChange2 }) {
  return (
    <div className="wikibox-link-container">
      <input
        className="wikibox-field-input"
        type="text"
        placeholder="Link text"
        value={text}
        onChange={onChange1}
        style={{ marginBottom: '2px' }}
      />
      <input
        className="wikibox-field-input"
        type="url"
        placeholder="URL"
        value={url}
        onChange={onChange2}
      />
    </div>
  )
}
