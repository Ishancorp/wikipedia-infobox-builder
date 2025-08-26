export default function FieldsDate({ field, onChange }) {
  return (
    <input
      className="wikibox-field-input"
      type="date"
      value={field.value}
      onChange={onChange}
    />
  )
}
