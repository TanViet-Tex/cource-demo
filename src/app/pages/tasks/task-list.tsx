import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '~/app/components/ui/button'
import { Input } from '~/app/components/ui/input'
import { SelectPriority } from '~/app/components/ui/select-priority'
import { Select } from '~/app/components/ui/select-wrapper'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/app/components/ui/table'
import { mockTaskList } from '~/app/fixtures/task.fixtures'
import { TaskStatus } from '~/app/types/task/task.type'
import { Search, Plus, ChevronRight } from 'lucide-react'

const taskStatusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'backlog', label: 'Backlog' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
  { value: 'archived', label: 'Archived' },
]

const getStatusColor = (status: TaskStatus) => {
  const colors: Record<TaskStatus, string> = {
    backlog: 'bg-gray-100 text-gray-800',
    todo: 'bg-blue-100 text-blue-800',
    'in-progress': 'bg-orange-100 text-orange-800',
    review: 'bg-purple-100 text-purple-800',
    done: 'bg-green-100 text-green-800',
    archived: 'bg-gray-300 text-gray-900',
  }
  return colors[status]
}

const getPriorityColor = (priority: string) => {
  const colors: Record<string, string> = {
    critical: 'text-red-600',
    high: 'text-orange-600',
    medium: 'text-blue-600',
    low: 'text-gray-600',
  }
  return colors[priority] || 'text-gray-600'
}

export function TaskList() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterPriority, setFilterPriority] = useState<string>('')

  const filteredTasks = mockTaskList.filter(task => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    const matchesStatus = !filterStatus || task.status === (filterStatus as TaskStatus)
    const matchesPriority = !filterPriority || task.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Tasks</h1>
          <Button
            onClick={() => navigate('/tasks/new')}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Task
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={filterStatus}
              onValueChange={setFilterStatus}
              options={[
                { value: '', label: 'All Status' },
                ...taskStatusOptions,
              ]}
            />

            {/* Priority Filter */}
            <Select
              value={filterPriority}
              onValueChange={setFilterPriority}
              options={[
                { value: '', label: 'All Priority' },
                { value: 'critical', label: 'Critical' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
            />

            {/* Clear Filters */}
            {(searchTerm || filterStatus || filterPriority) && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setFilterStatus('')
                  setFilterPriority('')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Tasks Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No tasks found</p>
              <Button onClick={() => navigate('/tasks/new')}>
                Create First Task
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assignees</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.map(task => (
                  <TableRow
                    key={task.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    <TableCell className="font-mono text-sm">{task.id}</TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {task.title}
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                        {task.status.replace('-', ' ').toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex -space-x-2">
                        {task.assignees?.slice(0, 3).map(assignee => (
                          <img
                            key={assignee.id}
                            src={assignee.avatar}
                            alt={assignee.name}
                            title={assignee.name}
                            className="w-6 h-6 rounded-full border border-white"
                          />
                        ))}
                        {task.assignees && task.assignees.length > 3 && (
                          <div className="w-6 h-6 rounded-full bg-gray-300 border border-white flex items-center justify-center text-xs font-bold">
                            +{task.assignees.length - 3}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.dueDate ? (
                        new Date(task.dueDate).toLocaleDateString('vi-VN')
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={e => {
                          e.stopPropagation()
                          navigate(`/tasks/${task.id}`)
                        }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Summary Stats */}
        {filteredTasks.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold">{filteredTasks.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-orange-600">
                {filteredTasks.filter(t => t.status === 'in-progress').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredTasks.filter(t => t.status === 'done').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredTasks.filter(
                  t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
                ).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
