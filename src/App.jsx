
import { useState } from 'react'
import Board from './components/board'
import TaskModal from './components/TaskModal'
import './App.css'

function App() {
  const [tasks, setTasks] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  function handleCreateTask(taskDetails) {
    const newTask = {
      id: crypto.randomUUID(),
      title: taskDetails.title.trim(),
      description: taskDetails.description.trim(),
      priority: taskDetails.priority,
      status: 'To Do',
    }

    setTasks((previousTasks) => [
      ...previousTasks,
      newTask,
    ])

    setIsModalOpen(false)
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
          onClick={() => setIsModalOpen(true)}
        >
          + New Task
        </button>

        <Board tasks={tasks} />
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
