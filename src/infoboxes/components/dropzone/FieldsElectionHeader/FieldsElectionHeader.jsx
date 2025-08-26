export default function FieldsElectionHeader({ field, fieldChange }) {
  return (
    <>
      <input
          className="wikibox-field-input"
          type="text"
          value={field.value.first}
          onChange={(e) => {
            const newList = JSON.parse(JSON.stringify(field.value));
            newList.first = e.target.value;
            fieldChange(newList);
          }}
      />
      <textarea
          className="wikibox-field-input"
          value={field.value.middle}
          onChange={(e) => {
            const newList = JSON.parse(JSON.stringify(field.value));
            newList.middle = e.target.value;
            fieldChange(newList);
          }}
          placeholder="Enter text here"
      />
      <input
          className="wikibox-field-input"
          type="text"
          value={field.value.last}
          onChange={(e) => {
            const newList = JSON.parse(JSON.stringify(field.value));
            newList.last = e.target.value;
            fieldChange(newList);
          }}
      />
    </>
  )
}
