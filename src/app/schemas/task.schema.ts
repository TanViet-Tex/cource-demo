import * as yup from "yup"

export const taskSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters"),

  description: yup
    .string()
    .max(5000, "Description must not exceed 5000 characters"),

  status: yup
    .string()
    .oneOf(["backlog", "todo", "in-progress", "review", "done", "archived"], "Invalid status")
    .required("Status is required"),

  priority: yup
    .string()
    .oneOf(["critical", "high", "medium", "low"], "Invalid priority")
    .required("Priority is required"),

  assigneeIds: yup
    .array(yup.string())
    .min(1, "At least one assignee is required")
    .required("Assignees are required"),

  dueDate: yup
    .date()
    .nullable()
    .optional(),

  startDate: yup
    .date()
    .nullable()
    .optional(),

  labels: yup
    .array(yup.string())
    .max(10, "Maximum 10 labels allowed"),

  estimatedHours: yup
    .number()
    .positive("Estimated hours must be positive")
    .max(1000, "Estimated hours must not exceed 1000")
    .nullable()
    .optional(),
})
