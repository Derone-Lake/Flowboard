
import { useEffect, useRef, useState } from 'react'
import Board from './components/board'
import TaskModal from './components/TaskModal'
import './App.css'

import { getOrCreateGuestSession } from './services/authService'

import {
  getTasks,
  createTask,
  updateTaskStatus,
  deleteTask,
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

  // Task operation state
  const [isMoving, setIsMoving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [moveError, setMoveError] = useState('')
  const [deleteError, setDeleteError] = useState('')

  // Prevent overlapping task modifications.
  const operationInProgress = useRef(false)

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
    if (operationInProgress.current) return

    operationInProgress.current = true
    setIsMoving(true)
    setMoveError('')
    setDeleteError('')

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
      operationInProgress.current = false
      setIsMoving(false)
    }
  }

  // Delete a task only after Supabase confirms success.
  async function handleDeleteTask(taskId) {
    if (operationInProgress.current) return

    if (!userId) {
      setDeleteError('Your session is not ready.')
      return
    }

    operationInProgress.current = true
    setIsDeleting(true)
    setDeleteError('')
    setMoveError('')

    try {
      await deleteTask(taskId, userId)

      // Remove the task from React after database confirmation.
      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => String(task.id) !== String(taskId)
        )
      )
    } catch (error) {
      console.error('Task deletion failed:', error)

      setDeleteError(
        'Could not delete the task. Please try again.'
      )
    } finally {
      operationInProgress.current = false
      setIsDeleting(false)
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
          disabled={
            isLoading ||
            !userId ||
            Boolean(loadError) ||
            isMoving ||
            isDeleting
          }
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

        {deleteError && (
          <p role="alert" className="form-error">
            {deleteError}
          </p>
        )}

        {isMoving && (
          <p role="status">Saving task movement...</p>
        )}

        {isDeleting && (
          <p role="status">Deleting task...</p>
        )}

        {!isLoading && !loadError && (
          <Board
            tasks={tasks}
            onMoveTask={handleMoveTask}
            onDeleteTask={handleDeleteTask}
            isMoving={isMoving || isDeleting}
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
