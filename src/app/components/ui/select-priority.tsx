import * as React from "react"
import { AlertCircle, CheckCircle2, Circle, Flag, Zap } from "lucide-react"

import { cn } from "~/app/utils/cn"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/components/ui/select"

export interface PriorityOption {
  value: string
  label: string
  icon: React.ReactNode
  color: string
  bgColor: string
}

const priorityOptions: PriorityOption[] = [
  {
    value: "critical",
    label: "Critical",
    icon: <AlertCircle className="h-4 w-4" />,
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
  },
  {
    value: "high",
    label: "High",
    icon: <Zap className="h-4 w-4" />,
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
  },
  {
    value: "medium",
    label: "Medium",
    icon: <Flag className="h-4 w-4" />,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200",
  },
  {
    value: "low",
    label: "Low",
    icon: <Circle className="h-4 w-4" />,
    color: "text-green-600",
    bgColor: "bg-green-50 border-green-200",
  },
]

export interface SelectPriorityProps {
  value?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

const SelectPriority = React.forwardRef<HTMLButtonElement, SelectPriorityProps>(
  ({ value, onValueChange, disabled, placeholder = "Select priority" }, ref) => {
    const selectedOption = priorityOptions.find((opt) => opt.value === value)

    return (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger ref={ref} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {priorityOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <span className={option.color}>{option.icon}</span>
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )
  }
)
SelectPriority.displayName = "SelectPriority"

export { SelectPriority, priorityOptions }
