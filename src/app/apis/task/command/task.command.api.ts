import http from '~/app/utils/http.util'
import {
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskDetail,
} from '~/app/types/task/task.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const taskCommandApi = {
  createTask: async (body: CreateTaskRequest) => {
    const url = '/v1/tasks'
    const response = (await http.post<ResponseMessageType<TaskDetail>>(
      url,
      body
    )) as unknown as ResponseMessageType<TaskDetail>
    return response.data
  },

  updateTask: async (taskId: string, body: UpdateTaskRequest) => {
    const url = `/v1/tasks/${taskId}`
    const response = (await http.put<ResponseMessageType<TaskDetail>>(
      url,
      body
    )) as unknown as ResponseMessageType<TaskDetail>
    return response.data
  },

  deleteTask: async (taskId: string) => {
    const url = `/v1/tasks/${taskId}`
    const response = (await http.delete<ResponseMessageType<null>>(
      url
    )) as unknown as ResponseMessageType<null>
    return response.data
  },

  uploadTaskAttachment: async (taskId: string, file: File) => {
    const url = `/v1/tasks/${taskId}/attachments`
    const formData = new FormData()
    formData.append('file', file)

    const response = (await http.post<ResponseMessageType<{ url: string; name: string }>>(
      url,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )) as unknown as ResponseMessageType<{ url: string; name: string }>
    return response.data
  },

  deleteAttachment: async (taskId: string, attachmentId: string) => {
    const url = `/v1/tasks/${taskId}/attachments/${attachmentId}`
    const response = (await http.delete<ResponseMessageType<null>>(
      url
    )) as unknown as ResponseMessageType<null>
    return response.data
  },
}
