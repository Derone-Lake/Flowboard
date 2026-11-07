
import { useState } from 'react'

function TaskModal({ onClose, onCreateTask }) {
  // State for task information
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Medium')

  // State for validation and review
  const [error, setError] = useState('')
  const [isReviewing, setIsReviewing] = useState(false)

  // Validate the form before displaying the review screen
  function handleReview(event) {
    event.preventDefault()

    if (!title.trim()) {
      setError('Please enter a task title.')
      return
    }

    setError('')
    setIsReviewing(true)
  }

  // Return to the form without losing entered information
  function handleEdit() {
    setIsReviewing(false)
  }

  // Send the confirmed task information to App.jsx
  function handleConfirm() {
    if (!title.trim()) {
      setError('Please enter a task title.')
      setIsReviewing(false)
      return
    }

    onCreateTask({
      title: title.trim(),
      description: description.trim(),
      priority: priority,
    })
  }

  return (
    <div className="modal-overlay">
      <section
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
      >
        <div className="modal-header">
          <h2 id="task-modal-title">
            {isReviewing ? 'Review Task' : 'Create New Task'}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close task form"
          >
            ×
          </button>
        </div>

        {!isReviewing ? (
          <form
            className="task-form"
            onSubmit={handleReview}
          >
            <label htmlFor="task-title">
              Task Title
            </label>

            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value)
                setError('')
              }}
              placeholder="Enter task title"
              maxLength={100}
              required
            />

            <label htmlFor="task-description">
              Description
            </label>

            <textarea
              id="task-description"
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="Describe the task"
              rows={4}
            />

            <label htmlFor="task-priority">
              Priority
            </label>

            <select
              id="task-priority"
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Review Task
              </button>
            </div>
          </form>
        ) : (
          <div className="task-review">
            <p>
              <strong>Title:</strong> {title.trim()}
            </p>

            <p>
              <strong>Description:</strong>{' '}
              {description.trim() || 'None'}
            </p>

            <p>
              <strong>Priority:</strong> {priority}
            </p>

            <div className="form-actions">
              <button
                type="button"
                onClick={handleEdit}
              >
                Edit
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleConfirm}
              >
                Confirm Task
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

export default TaskModal
