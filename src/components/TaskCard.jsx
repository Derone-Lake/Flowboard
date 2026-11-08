
import { useDraggable } from '@dnd-kit/core'

function TaskCard({ task, disabled = false, onDeleteTask }) {
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
    position: 'relative',
    zIndex: isDragging ? 10 : 'auto',
  }

  function handleDelete() {
    if (disabled || !onDeleteTask) return

    const confirmed = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    )

    if (confirmed) {
      onDeleteTask(task.id)
    }
  }

  return (
    <article
      ref={setNodeRef}
      className="task-card"
      style={style}
    >
      <div
        {...attributes}
        {...listeners}
        style={{
          cursor: disabled ? 'wait' : 'grab',
          touchAction: 'none',
        }}
      >
        <h4>{task.title}</h4>
        <p>{task.description}</p>

        <span className="task-priority">
          {task.priority}
        </span>
      </div>

      <button
        type="button"
        className="delete-task-button"
        onClick={handleDelete}
        disabled={disabled}
        aria-label={`Delete ${task.title}`}
      >
        Delete
      </button>
    </article>
  )
}

export default TaskCard
