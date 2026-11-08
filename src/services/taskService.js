
import { supabase } from './supabaseClient'

// Retrieve tasks belonging to the authenticated user.
// Supabase Row Level Security restricts visible records.
export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data
}

// Create a new task in PostgreSQL.
export async function createTask(userId, task) {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      user_id: userId,
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      status: 'To Do',
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Update a task's Kanban status.
export async function updateTaskStatus(taskId, status) {
  const validStatuses = [
    'To Do',
    'In Progress',
    'In Review',
    'Done',
  ]

  if (!validStatuses.includes(status)) {
    throw new Error('Invalid task status.')
  }

  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('task_id', taskId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

// Permanently delete a task owned by the current user.
export async function deleteTask(taskId, userId) {
  if (!taskId || !userId) {
    throw new Error('Task ID and user ID are required.')
  }

  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('task_id', taskId)
    .eq('user_id', userId)
    .select('task_id')
    .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error(
      'Task was not deleted. It may not exist or you may not have permission.'
    )
  }

  return data
}
