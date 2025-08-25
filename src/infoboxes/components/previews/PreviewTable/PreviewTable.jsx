const PreviewTable = ({ title, children }) => (
  <table className="wikibox-preview">
    <thead>
      <tr>
        <th colSpan="2" className="wikibox-preview-header">
          {title}
        </th>
        </tr>
      </thead>
      <tbody className="wikibox-preview-content">
        {children}
        <tr><td colspan="2" className="bottom"></td></tr>
      </tbody>
    </table>
);

export default PreviewTable;
