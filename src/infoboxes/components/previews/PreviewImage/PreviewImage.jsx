import './PreviewImage.css';
import helpers from '../../../helpers/helpers.jsx'
const { parseTextWithSpans } = helpers;

const PreviewImage = ({ field, maxWidth, noCaption, inline }) => {
  if (!field.value) return 'No image';

  const imgStyle = {
    maxWidth,
    height: 'auto',
    ...(inline && { display: 'block', margin: '0 auto' })
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <img
        className="wikibox-preview-image"
        src={field.value}
        alt="Preview"
        style={imgStyle}
        onError={(e) => (e.target.style.display = 'none')}
      />
      {!noCaption && field.showCaption && field.caption && (
        <div className="wikibox-preview-caption">
          {parseTextWithSpans(field.caption)}
        </div>
      )}
    </div>
  );
};

export default PreviewImage;
