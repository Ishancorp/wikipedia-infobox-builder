import "./Buttons.css"

export default function WikiboxListAddButton({ onClick }) {
  return (        
    <button
      className="wikibox-list-add-btn"
      onClick={onClick}
    >
      + Add Item
    </button>
  )
}
