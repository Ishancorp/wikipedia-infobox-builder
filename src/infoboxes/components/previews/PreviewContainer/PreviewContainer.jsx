import './PreviewContainer.css';

const PreviewContainer = ({ children }) => (
  <div className="wikibox-preview-container">
    <h3 className="wikibox-preview-title">Preview</h3>
    {children}
  </div>
);

export default PreviewContainer;
