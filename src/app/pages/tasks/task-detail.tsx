import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, type Resolver } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '~/app/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/app/components/ui/form'
import { Input } from '~/app/components/ui/input'
import { Textarea } from '~/app/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/app/components/ui/tabs'
import { Badge } from '~/app/components/ui/badge'
import { SelectPriority } from '~/app/components/ui/select-priority'
import { Select } from '~/app/components/ui/select-wrapper'
import { DatePicker } from '~/app/components/ui/date-picker'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '~/app/components/ui/dialog'
import { taskSchema } from '~/app/schemas/task.schema'
import { TaskFormValues, TaskStatus } from '~/app/types/task/task.type'
import { useTaskDetail } from '~/app/hooks/use-task-detail'
import { mockUsers, mockTaskDetail } from '~/app/fixtures/task.fixtures'
import { Trash2, Plus, MessageSquare, CheckCircle2, Circle } from 'lucide-react'

const taskStatusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
  { value: 'archived', label: 'Archived' },
]

export function TaskDetail() {
  const navigate = useNavigate()
  const { taskId } = useParams<{ taskId: string }>()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  // Use mock data for now (remove when backend ready)
  const task = mockTaskDetail

  const {
    updateTask,
    isUpdating,
    deleteTask,
    isDeleting,
  } = useTaskDetail(task?.id)

  const form = useForm<TaskFormValues>({
    // yupResolver's inferred types can be broad; cast to match our form values
    resolver: yupResolver(taskSchema) as unknown as Resolver<TaskFormValues>,
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
      priority: task?.priority || 'medium',
      assigneeIds: task?.assignees?.map(a => a.id) || [],
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      startDate: task?.startDate ? new Date(task.startDate) : undefined,
      labels: task?.labels || [],
      estimatedHours: task?.estimatedHours || 0,
    },
  })

  const onSubmit = async (data: TaskFormValues) => {
    if (!task?.id) return
    try {
      await updateTask({
        id: task.id,
        body: {
          title: data.title,
          description: data.description || undefined,
          status: data.status,
          priority: data.priority,
          assigneeIds: data.assigneeIds,
          dueDate: data.dueDate || undefined,
          startDate: data.startDate || undefined,
          labels: data.labels || undefined,
          estimatedHours: data.estimatedHours || undefined,
        },
      })
      navigate('/tasks')
    } catch (error) {
      console.error('Failed to update task:', error)
    }
  }

  const handleDelete = async () => {
    if (!task?.id) return
    try {
      await deleteTask(task.id)
      navigate('/tasks')
    } catch (error) {
      console.error('Failed to delete task:', error)
    } finally {
      setShowDeleteConfirm(false)
    }
  }

  const handleRemoveAssignee = (userId: string) => {
    const currentAssignees = form.getValues('assigneeIds')
    form.setValue(
      'assigneeIds',
      currentAssignees.filter((id: string) => id !== userId)
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">{task?.id}</h1>
            <div className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              task?.priority === 'critical' 
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {task?.priority}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/tasks')}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }: any) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Task title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tabs */}
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="subtasks">Subtasks</TabsTrigger>
                      <TabsTrigger value="comments">Comments</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6 mt-6">
                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Task description"
                                rows={6}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Priority & Status */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }: any) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <FormControl>
                                <SelectPriority
                                  value={field.value}
                                  onValueChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }: any) => (
                            <FormItem>
                              <FormLabel>Status</FormLabel>
                              <FormControl>
                                <Select
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  options={taskStatusOptions}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Dates */}
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startDate"
                          render={({ field }: any) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <DatePicker
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="dueDate"
                          render={({ field }: any) => (
                            <FormItem>
                              <FormLabel>Due Date</FormLabel>
                              <FormControl>
                                <DatePicker
                                  value={field.value}
                                  onChange={field.onChange}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Estimated Hours */}
                      <FormField
                        control={form.control}
                        name="estimatedHours"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Estimated Hours</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value ? parseFloat(e.target.value) : 0
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Assignees */}
                      <FormField
                        control={form.control}
                        name="assigneeIds"
                        render={({ field }: any) => (
                          <FormItem>
                            <FormLabel>Assignees</FormLabel>
                            <FormControl>
                              <div className="space-y-3">
                                <div className="flex flex-wrap gap-2">
                                  {field.value?.map((assigneeId: string) => {
                                    const user = mockUsers.find(u => u.id === assigneeId)
                                    return user ? (
                                      <Badge
                                        key={user.id}
                                        variant="secondary"
                                        onRemove={() => handleRemoveAssignee(user.id)}
                                      >
                                        {user.name}
                                      </Badge>
                                    ) : null
                                  })}
                                </div>
                                <div className="flex gap-2">
                                  {mockUsers
                                    .filter(user => !field.value?.includes(user.id))
                                    .map(user => (
                                      <Button
                                        key={user.id}
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          field.onChange([...(field.value || []), user.id])
                                        }
                                      >
                                        <Plus className="w-3 h-3 mr-1" />
                                        {user.name}
                                      </Button>
                                    ))}
                                </div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Attached Files */}
                      {task?.attachments && task.attachments.length > 0 && (
                        <div className="space-y-2">
                          <FormLabel>Files</FormLabel>
                          <div className="space-y-2">
                            {task.attachments.map(attachment => (
                              <div
                                key={attachment.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded border"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{attachment.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(attachment.size / 1024).toFixed(2)} KB
                                  </p>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Submit Buttons */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button
                          type="submit"
                          disabled={isUpdating || isDeleting}
                        >
                          Save Changes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => navigate('/tasks')}
                        >
                          Cancel
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Subtasks Tab */}
                    <TabsContent value="subtasks" className="mt-6">
                      <div className="space-y-3">
                        {task?.subtasks?.map(subtask => (
                          <div
                            key={subtask.id}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded hover:bg-gray-100"
                          >
                            <button className="mt-0.5 text-gray-400 hover:text-blue-500">
                              {subtask.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                              ) : (
                                <Circle className="w-5 h-5" />
                              )}
                            </button>
                            <div className="flex-1">
                              <p
                                className={`text-sm font-medium ${
                                  subtask.completed ? 'line-through text-gray-500' : ''
                                }`}
                              >
                                {subtask.title}
                              </p>
                              {subtask.assignee && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Assigned to: {subtask.assignee.name}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                        <Button type="button" variant="outline" size="sm" className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Subtask
                        </Button>
                      </div>
                    </TabsContent>

                    {/* Comments Tab */}
                    <TabsContent value="comments" className="mt-6">
                      <div className="space-y-4">
                        {task?.comments?.map(comment => (
                          <div key={comment.id} className="p-3 bg-gray-50 rounded">
                            <div className="flex items-start gap-3">
                              <img
                                src={comment.author.avatar}
                                alt={comment.author.name}
                                className="w-8 h-8 rounded-full"
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{comment.author.name}</p>
                                <p className="text-sm text-gray-600 mt-1">{comment.content}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-4 border-t">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            className="flex-1 px-3 py-2 border rounded text-sm"
                          />
                          <Button type="button" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Comment
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </form>
              </Form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 space-y-6">
              {/* Task Info */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Task Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-500">ID</p>
                    <p className="font-mono">{task?.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Status</p>
                    <p className="capitalize font-medium">{task?.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Priority</p>
                    <p className="capitalize font-medium">{task?.priority}</p>
                  </div>
                  {task?.dueDate && (
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p>
                        {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                  )}
                  {task?.estimatedHours && (
                    <div>
                      <p className="text-gray-500">Estimated Hours</p>
                      <p>{task.estimatedHours}h</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reporter */}
              {task?.reporter && (
                <div>
                  <h3 className="text-sm font-semibold mb-3">Reporter</h3>
                  <div className="flex items-center gap-2">
                    <img
                      src={task.reporter.avatar}
                      alt={task.reporter.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="text-sm">
                      <p className="font-medium">{task.reporter.name}</p>
                      <p className="text-gray-500">{task.reporter.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Progress */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Time Spent</span>
                    <span>{task?.timeSpent || 0}h</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${task?.estimatedHours ? ((task?.timeSpent || 0) / task.estimatedHours) * 100 : 0}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    {task?.estimatedHours ? `${((task?.timeSpent || 0) / task.estimatedHours * 100).toFixed(0)}% Complete` : 'No estimate'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            This action cannot be undone. The task will be permanently deleted.
          </p>
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              Delete Task
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
