import http from '~/app/utils/http.util'
import { TaskDetail, TaskDetailResponse } from '~/app/types/task/task.type'
import { ResponseMessageType } from '~/app/types/utils/response.type'

export const taskQueryApi = {
  getTaskDetail: async (taskId: string) => {
    const url = `/v1/tasks/${taskId}`
    const response = (await http.get<ResponseMessageType<TaskDetail>>(
      url
    )) as unknown as ResponseMessageType<TaskDetail>
    return response.data
  },

  getTaskList: async (projectId?: string, status?: string, priority?: string) => {
    const url = '/v1/tasks'
    const params = new URLSearchParams()
    if (projectId) params.append('projectId', projectId)
    if (status) params.append('status', status)
    if (priority) params.append('priority', priority)

    const response = (await http.get<ResponseMessageType<TaskDetail[]>>(
      `${url}?${params.toString()}`
    )) as unknown as ResponseMessageType<TaskDetail[]>
    return response.data
  },
}
