import './PreviewLink.css';
import helpers from '../../../helpers/helpers.jsx'
const { parseTextWithSpans } = helpers;

const PreviewLink = ({ field }) => (
  <a 
    className="wikibox-preview-link"
    href={field.value.url} 
    target="_blank" 
    rel="noopener noreferrer"
  >
    {parseTextWithSpans(field.value.text)}
  </a>
);

export default PreviewLink;
