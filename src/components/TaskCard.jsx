
import { useDraggable } from '@dnd-kit/core'

function TaskCard({ task, disabled = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: String(task.id),
    disabled,
  })

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.65 : 1,
    cursor: disabled ? 'wait' : 'grab',
    touchAction: 'none',
    position: 'relative',
    zIndex: isDragging ? 10 : 'auto',
  }

  return (
    <article
      ref={setNodeRef}
      className="task-card"
      style={style}
      {...attributes}
      {...listeners}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>

      <span className="task-priority">
        {task.priority}
      </span>
    </article>
  )
}

export default TaskCard
