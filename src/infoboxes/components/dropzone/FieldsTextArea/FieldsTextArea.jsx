export default function FieldsTextArea({ field, onChange }) {
  return (
    <textarea
      className="wikibox-field-input"
      type='text'
      value={field.value}
      onChange={onChange}
      placeholder="Enter text here"
    />
  );
}
