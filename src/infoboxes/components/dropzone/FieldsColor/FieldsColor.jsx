export default function FieldsColor({ field, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="color"
        value={field.value}
        onChange={onChange}
        style={{ width: '40px', height: '30px' }}
      />
      <input
        className="wikibox-field-input"
        value={field.value}
        onChange={onChange}
        placeholder="Color code"
      />
    </div>
  )
}
