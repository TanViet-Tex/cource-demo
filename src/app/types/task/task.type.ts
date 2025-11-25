// Task Status
export type TaskStatus = "backlog" | "todo" | "in-progress" | "review" | "done" | "archived"

// Task Priority
export type TaskPriority = "critical" | "high" | "medium" | "low"

// Assignee/User
export interface TaskUser {
  id: string
  name: string
  email: string
  avatar?: string
}

// Attachment
export interface TaskAttachment {
  id: string
  name: string
  size: number
  type: string
  url: string
  createdAt: Date
  uploadedBy?: TaskUser
}

// Subtask
export interface TaskSubtask {
  id: string
  title: string
  completed: boolean
  assignee?: TaskUser
  dueDate?: Date
  completedAt?: Date
}

// Comment
export interface TaskComment {
  id: string
  author: TaskUser
  content: string
  createdAt: Date
  updatedAt?: Date
  replies?: TaskComment[]
}

// Main Task Detail
export interface TaskDetail {
  id: string
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assignees: TaskUser[]
  reporter?: TaskUser
  dueDate?: Date
  startDate?: Date
  createdAt: Date
  updatedAt: Date
  attachments: TaskAttachment[]
  subtasks: TaskSubtask[]
  comments: TaskComment[]
  labels?: string[]
  estimatedHours?: number
  timeSpent?: number
  projectId?: string
  parentTaskId?: string
}

// Create/Update Request Types
export interface CreateTaskRequest {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeIds: string[]
  dueDate?: Date
  startDate?: Date
  labels?: string[]
  estimatedHours?: number
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {}

// API Response Types
export interface TaskDetailResponse {
  data: TaskDetail
  statusCode: number
  isSuccess: boolean
}

export interface TaskListResponse {
  data: TaskDetail[]
  totalItems: number
  pageNumber: number
  pageSize: number
  totalPages: number
  statusCode: number
  isSuccess: boolean
}

// Form Types (for react-hook-form)
export interface TaskFormValues {
  title: string
  description?: string
  status: TaskStatus
  priority: TaskPriority
  assigneeIds: string[]
  dueDate?: Date | null
  startDate?: Date | null
  labels?: string[]
  estimatedHours?: number
}
