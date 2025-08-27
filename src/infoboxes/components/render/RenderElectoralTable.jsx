import './render.css'

export default function RenderElectoralTable({children}){
  return(
    <tr>
      <td colSpan="2" className="wikibox-preview-wrapper-electoral">
        <table className="wikibox-preview-wrapper-electoral-table">
          <tbody>
            {children}
          </tbody>
        </table>
      </td>
    </tr>
  );
}
