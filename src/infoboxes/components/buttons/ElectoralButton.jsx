import "./Buttons.css"

export default function ElectoralButton({ onClick, disabled, direction }) {
  return (        
    <button
      className='electoral-btn'
      onClick={onClick}
      disabled={disabled}
    >
      {direction === "left" ? "←" : "→"}
    </button>
  )
}
