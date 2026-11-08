
import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'

function Column({ title, tasks, isMoving }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column:${title}`,
  })

  return (
    <section
      ref={setNodeRef}
      className="board-column"
      style={{
        outline: isOver
          ? '2px solid #60a5fa'
          : 'none',
        outlineOffset: '-2px',
      }}
    >
      <h3>{title}</h3>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            disabled={isMoving}
          />
        ))
      )}
    </section>
  )
}

export default Column
