
import Column from './Column'

const statuses = [
  'To Do',
  'In Progress',
  'In Review',
  'Done',
]

function Board({ tasks }) {
  return (
    <div className="board-columns">
      {statuses.map((status) => (
        <Column
          key={status}
          title={status}
          tasks={tasks.filter(
            (task) => task.status === status
          )}
        />
      ))}
    </div>
  )
}

export default Board
