const TitleEditor = ({ title, setTitle }) => (
  <div className="wikibox-title-editor" style={{ marginBottom: '20px' }}>
    <label className="wikibox-title-label" style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold' }}>
      Wikibox Title:
    </label>
    <input
      className="wikibox-title-input"
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="Wikibox name"
      style={{ width: '90%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
    />
  </div>
);

export default TitleEditor;
