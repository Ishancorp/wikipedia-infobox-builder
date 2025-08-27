import MoveButton from "../../buttons/MoveButton";
import RemoveButton from "../../buttons/RemoveButton";

export default function FieldsElectoralControlsByField({ childIndex, columnChildren, starClick, upClick, downClick, removeClick }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      <MoveButton
        type='star'
        onClick={starClick}
        title="Make header row"
      />
      {childIndex > 0 && (
        <MoveButton
          type='up'
          onClick={upClick}
          title="Move up in column"
        />
      )}
      {childIndex < columnChildren.length - 1 && (
        <MoveButton
          type='down'
          onClick={downClick}
          title="Move down in column"
        />
      )}
      
      <RemoveButton small onClick={removeClick} />
    </div>
  );
}
