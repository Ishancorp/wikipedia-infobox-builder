import "./Buttons.css"

export default function CollapseButton({ onClick, isCollapsed, style }) {
  return (        
    <button
      onClick={onClick}
      className="collapse-btn"
      style={style}
    >
      {isCollapsed ? '▼' : '▲'}
    </button>
  )
}
