
import { supabase } from "./supabaseClient";

// Retrieve tasks belonging to the authenticated user.
export async function getTasks() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}

// Create a new task in PostgreSQL.
export async function createTask(userId, task) {
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      user_id: userId,
      title: task.title,
      description: task.description ?? "",
      priority: task.priority,
      status: "To Do"
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

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


