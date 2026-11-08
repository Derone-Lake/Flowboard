
import { useEffect, useState } from 'react'
import Board from './components/board'
import TaskModal from './components/TaskModal'
import './App.css'

import { getOrCreateGuestSession } from './services/authService'

import {
  getTasks,
  createTask,
  updateTaskStatus,
} from './services/taskService'

// Map PostgreSQL's task_id to the id used by React components.
function toBoardTask(task) {
  return {
    ...task,
    id: task.task_id,
  }
}

function App() {
  // Application state
  const [tasks, setTasks] = useState([])
  const [userId, setUserId] = useState(null)

  // Interface state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  // Drag-and-drop state
  const [isMoving, setIsMoving] = useState(false)
  const [moveError, setMoveError] = useState('')

  // Authenticate and retrieve saved tasks.
  useEffect(() => {
    let cancelled = false

    async function loadBoard() {
      try {
        const user = await getOrCreateGuestSession()

        if (cancelled) return

        setUserId(user.id)

        const savedTasks = await getTasks()

        if (cancelled) return

        setTasks(savedTasks.map(toBoardTask))
        setLoadError('')
      } catch (error) {
        console.error('Unable to load FlowBoard:', error)

        if (!cancelled) {
          setLoadError(
            'Unable to load your tasks. Refresh to try again.'
          )
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadBoard()

    return () => {
      cancelled = true
    }
  }, [])

  // Create a task and wait for database confirmation.
  async function handleCreateTask(taskDetails) {
    if (!userId) {
      throw new Error('Your session is not ready.')
    }

    const savedTask = await createTask(userId, {
      title: taskDetails.title.trim(),
      description: taskDetails.description.trim(),
      priority: taskDetails.priority,
    })

    setTasks((previousTasks) => [
      toBoardTask(savedTask),
      ...previousTasks,
    ])

    setIsModalOpen(false)
  }

  // Move a task between columns and persist its status.
  async function handleMoveTask(taskId, newStatus) {
    if (isMoving) return

    setIsMoving(true)
    setMoveError('')

    try {
      const updatedTask = await updateTaskStatus(
        taskId,
        newStatus
      )

      // Update the board only after PostgreSQL confirms.
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          String(task.id) === String(taskId)
            ? toBoardTask(updatedTask)
            : task
        )
      )
    } catch (error) {
      console.error('Task movement failed:', error)

      setMoveError(
        'Could not save the task movement. Please try again.'
      )
    } finally {
      setIsMoving(false)
    }
  }

  return (
    <main className="app">
      <header className="app-header">
        <h1>FlowBoard</h1>
        <p>Organize your work. Track your progress.</p>
      </header>

      <section className="board">
        <h2>My Task Board</h2>

        <button
          type="button"
          className="new-task-button"
          disabled={isLoading || !userId || Boolean(loadError)}
          onClick={() => setIsModalOpen(true)}
        >
          + New Task
        </button>

        {isLoading && (
          <p role="status">Loading your tasks...</p>
        )}

        {loadError && (
          <p role="alert" className="form-error">
            {loadError}
          </p>
        )}

        {moveError && (
          <p role="alert" className="form-error">
            {moveError}
          </p>
        )}

        {isMoving && (
          <p role="status">Saving task movement...</p>
        )}

        {!isLoading && !loadError && (
          <Board
            tasks={tasks}
            onMoveTask={handleMoveTask}
            isMoving={isMoving}
          />
        )}
      </section>

      {isModalOpen && (
        <TaskModal
          onClose={() => setIsModalOpen(false)}
          onCreateTask={handleCreateTask}
        />
      )}
    </main>
  )
}

export default App
