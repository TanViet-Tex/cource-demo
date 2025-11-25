import * as React from "react"
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/app/components/ui/select"

export interface SelectSharedProps {
  value?: string
  defaultValue?: string
  onValueChange?(value: string): void
  placeholder?: string
  disabled?: boolean
  options?: Array<{ value: string; label: string | React.ReactNode }>
}

const SelectWrapper = React.forwardRef<HTMLButtonElement, SelectSharedProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      placeholder,
      disabled,
      options = [],
    },
    ref
  ) => {
    return (
      <SelectPrimitive value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger ref={ref}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectPrimitive>
    )
  }
)
SelectWrapper.displayName = "Select"

export { SelectWrapper as Select }
