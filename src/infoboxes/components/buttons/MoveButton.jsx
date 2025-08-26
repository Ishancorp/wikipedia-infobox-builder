import "./Buttons.css"

export default function MoveButton({ onClick, title, type }) {
  return (        
    <button
        className='move-btn'
        onClick={onClick}
        title={title}
    >
        {type === 'up' ? "↑" : type === 'down' ? "↓" : type === 'star' ? "★" : "→Col"}
    </button>
  )
}
