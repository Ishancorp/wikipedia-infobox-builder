import MoveButton from "../../buttons/MoveButton";
import RemoveButton from "../../buttons/RemoveButton";

export default function FieldsGroupControlsByField({ field, childIndex, upClick, downClick, removeClick }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {childIndex > 0 && (
        <MoveButton type='up' onClick={upClick} />
      )}
      {childIndex < field.children.length - 1 && (
        <MoveButton type='down' onClick={downClick} />
      )}
      <RemoveButton small onClick={removeClick} />
    </div>
  )
}
