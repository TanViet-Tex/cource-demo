import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { taskQueryApi } from '~/app/apis/task/query/task.query.api'
import { taskCommandApi } from '~/app/apis/task/command/task.command.api'
import {
  TaskDetail,
  CreateTaskRequest,
  UpdateTaskRequest,
} from '~/app/types/task/task.type'
import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'

const TASK_QUERY_KEY = 'task'

export function useTaskDetail(taskId?: string) {
  const queryClient = useQueryClient()
  const { messageSuccess, messageError } = useToastMessageAsync()

  // Query: Fetch task detail
  const {
    data: taskDetail,
    isLoading: isLoadingDetail,
    error: detailError,
    refetch: refetchDetail,
  } = useQuery({
    queryKey: [TASK_QUERY_KEY, 'detail', taskId],
    queryFn: async () => {
      if (!taskId) return null
      try {
        const data = await taskQueryApi.getTaskDetail(taskId)
        return data
      } catch (error) {
        console.error('Failed to fetch task detail:', error)
        throw error
      }
    },
    enabled: !!taskId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })

  // Mutation: Create task
  const createTaskMutation = useMutation({
    mutationFn: async (body: CreateTaskRequest) => {
      try {
        const data = await taskCommandApi.createTask(body)
        messageSuccess('Task created successfully')
        return data
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.message || 'Failed to create task'
            : 'Failed to create task'
        messageError(message)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY] })
    },
  })

  // Mutation: Update task
  const updateTaskMutation = useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string
      body: UpdateTaskRequest
    }) => {
      try {
        const data = await taskCommandApi.updateTask(id, body)
        messageSuccess('Task updated successfully')
        return data
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.message || 'Failed to update task'
            : 'Failed to update task'
        messageError(message)
        throw error
      }
    },
    onSuccess: (data) => {
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: [TASK_QUERY_KEY, 'detail', data.id],
        })
      }
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY] })
    },
  })

  // Mutation: Delete task
  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        await taskCommandApi.deleteTask(id)
        messageSuccess('Task deleted successfully')
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.message || 'Failed to delete task'
            : 'Failed to delete task'
        messageError(message)
        throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_QUERY_KEY] })
    },
  })

  // Mutation: Upload attachment
  const uploadAttachmentMutation = useMutation({
    mutationFn: async ({
      taskId: id,
      file,
    }: {
      taskId: string
      file: File
    }) => {
      try {
        const response = await taskCommandApi.uploadTaskAttachment(id, file)
        messageSuccess('File uploaded successfully')
        return response
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.message || 'Failed to upload file'
            : 'Failed to upload file'
        messageError(message)
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [TASK_QUERY_KEY, 'detail', variables.taskId],
      })
    },
  })

  // Mutation: Delete attachment
  const deleteAttachmentMutation = useMutation({
    mutationFn: async ({
      taskId: id,
      attachmentId,
    }: {
      taskId: string
      attachmentId: string
    }) => {
      try {
        await taskCommandApi.deleteAttachment(id, attachmentId)
        messageSuccess('Attachment deleted successfully')
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.message || 'Failed to delete attachment'
            : 'Failed to delete attachment'
        messageError(message)
        throw error
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [TASK_QUERY_KEY, 'detail', variables.taskId],
      })
    },
  })

  return {
    // Data
    taskDetail,
    isLoadingDetail,
    detailError,

    // Refetch
    refetchDetail,

    // Mutations
    createTask: createTaskMutation.mutateAsync,
    isCreating: createTaskMutation.isPending,
    updateTask: updateTaskMutation.mutateAsync,
    isUpdating: updateTaskMutation.isPending,
    deleteTask: deleteTaskMutation.mutateAsync,
    isDeleting: deleteTaskMutation.isPending,
    uploadAttachment: uploadAttachmentMutation.mutateAsync,
    isUploadingAttachment: uploadAttachmentMutation.isPending,
    deleteAttachment: deleteAttachmentMutation.mutateAsync,
    isDeletingAttachment: deleteAttachmentMutation.isPending,
  }
}
