import "./Buttons.css"

export default function ListMoveButton({ onClick, title, type }) {
  return (        
    <button
        className='list-move-btn'
        onClick={onClick}
        title={title}
    >
        {type === 'up' ? "↑" : "↓"}
    </button>
  )
}
