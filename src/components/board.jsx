
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core'

import Column from './Column'

const statuses = [
  'To Do',
  'In Progress',
  'In Review',
  'Done',
]

function Board({ tasks, onMoveTask, isMoving }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor)
  )

  function detectCollision(args) {
    const pointer = pointerWithin(args)

    if (pointer.length > 0) {
      return pointer
    }

    return rectIntersection(args)
  }

  async function handleDragEnd(event) {
    const { active, over } = event
    console.log("Task being moved:", active.id)
    console.log("Destination:", over?.id)

    if (!over || isMoving) return

    const taskId = String(active.id)
    const targetStatus = String(over.id).replace(
      'column:',
      ''
    )

    const task = tasks.find(
      (item) => String(item.id) === taskId
    )

    if (!task) return
    if (!statuses.includes(targetStatus)) return
    if (task.status === targetStatus) return

    await onMoveTask(taskId, targetStatus)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={detectCollision}
      onDragEnd={handleDragEnd}
    >
      <div className="board-columns">
        {statuses.map((status) => (
          <Column
            key={status}
            title={status}
            tasks={tasks.filter(
              (task) => task.status === status
            )}
            isMoving={isMoving}
          />
        ))}
      </div>
    </DndContext>
  )
}

export default Board
