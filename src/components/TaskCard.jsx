
function TaskCard({ task }) {
  return (
    <article className="task-card">
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <span className="task-priority">
        {task.priority}
      </span>
    </article>
  )
}

export default TaskCard
