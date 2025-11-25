import { TaskDetail } from '~/app/types/task/task.type'

export const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
  },
]

export const mockTaskDetail: TaskDetail = {
  id: 'TASK-001',
  title: 'Build user authentication system',
  description: `
## Requirements
- Implement JWT-based authentication
- Add OAuth2 social login (Google, GitHub)
- Create role-based access control (RBAC)

## Acceptance Criteria
- Users can sign up with email
- Users can login securely
- Token refresh works correctly
  `,
  status: 'in-progress',
  priority: 'high',
  assignees: [mockUsers[0], mockUsers[1]],
  reporter: mockUsers[2],
  dueDate: new Date('2025-12-31'),
  startDate: new Date('2025-11-15'),
  createdAt: new Date('2025-11-10'),
  updatedAt: new Date('2025-11-24'),
  attachments: [
    {
      id: 'att-1',
      name: 'auth-flow-diagram.png',
      size: 256000,
      type: 'image/png',
      url: 'https://via.placeholder.com/800x600',
      createdAt: new Date('2025-11-20'),
      uploadedBy: mockUsers[0],
    },
  ],
  subtasks: [
    {
      id: 'sub-1',
      title: 'Setup JWT configuration',
      completed: true,
      assignee: mockUsers[0],
      completedAt: new Date('2025-11-18'),
    },
    {
      id: 'sub-2',
      title: 'Implement Google OAuth',
      completed: false,
      assignee: mockUsers[1],
      dueDate: new Date('2025-12-05'),
    },
    {
      id: 'sub-3',
      title: 'Setup RBAC middleware',
      completed: false,
      assignee: mockUsers[0],
      dueDate: new Date('2025-12-10'),
    },
  ],
  comments: [
    {
      id: 'com-1',
      author: mockUsers[0],
      content: 'JWT config is ready. Starting OAuth implementation.',
      createdAt: new Date('2025-11-20T10:30:00'),
    },
    {
      id: 'com-2',
      author: mockUsers[1],
      content: 'Waiting for OAuth app credentials from admin.',
      createdAt: new Date('2025-11-22T14:15:00'),
    },
  ],
  labels: ['backend', 'security', 'authentication'],
  estimatedHours: 40,
  timeSpent: 16,
}

export const mockTaskList: TaskDetail[] = [
  mockTaskDetail,
  {
    ...mockTaskDetail,
    id: 'TASK-002',
    title: 'Design dashboard UI',
    priority: 'medium',
    status: 'todo',
    assignees: [mockUsers[2]],
  },
  {
    ...mockTaskDetail,
    id: 'TASK-003',
    title: 'Write API documentation',
    priority: 'low',
    status: 'backlog',
    assignees: [mockUsers[1]],
  },
]
