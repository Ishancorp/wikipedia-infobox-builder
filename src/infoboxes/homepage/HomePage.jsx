import './HomePage.css'
import helpers from '../helpers/helpers';
const { parseTextWithSpans } = helpers;

export default function HomePage() {
  return (
    <div className="outer-div">
      <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1>Wikibox Builder</h1>
          <p className='top-p'>
            A React application for creating Wikipedia-style infoboxes with drag-and-drop editing, live preview, and rich text formatting support.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginBottom: '4rem'
        }}>
          <div className="box">
            <h2>Key Features</h2>
            <ul>
              <li>Drag & drop interface</li>
              <li>Real-time preview</li>
              <li>Multiple templates</li>
              <li>Image + media support</li>
              <li>Flexible field types</li>
            </ul>
          </div>

          <div className="box">
            <div>
              <h2>Rich Text Formatting</h2>
            </div>
            <p style={{
              color: '#374151',
              marginBottom: '1rem'
            }}>
              Use Wikipedia-style markup in text fields:
            </p>
            <ul>
              {[`'''bold'''`, `''italics''`, `*bold*`, `x^{sup}`, `{{increase}}`, `{{decrease}}`, `--`, "{{ color | #ff0000 | red}}"].map( format =>
                <li>
                  <code>{format}</code> → {parseTextWithSpans(format)}
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
