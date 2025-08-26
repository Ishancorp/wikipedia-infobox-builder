import "./Buttons.css"

export default function RemoveButton({ onClick, title, small }) {
  return (        
    <button
      className='remove-btn'
      onClick={onClick}
      title={title}
    >{small? "×" : "x"}</button>
  )
}
