
import TaskCard from './TaskCard'

function Column({ title, tasks }) {
  return (
    <section className="board-column">
      <h3>{title}</h3>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))
      )}
    </section>
  )
}

export default Column
