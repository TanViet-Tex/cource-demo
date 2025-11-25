# Hướng dẫn chuyển đổi Form sang shadcn/ui

## Cấu trúc cơ bản

### Import các components cần thiết:

```tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/app/components/ui/select'
```

### Setup useForm với react-hook-form + zodResolver:

```tsx
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { yourSchema } from '~/app/schemas/your.schema'

const form = useForm({
  resolver: yupResolver(yourSchema),
  defaultValues: {
    field1: '',
    field2: '',
  },
})
```

### Form structure:

```tsx
<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    {/* FormField components */}
  </form>
</Form>
```

## Mẫu FormField cho Input:

```tsx
<FormField
  control={form.control}
  name="contractTypeCode"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Contract Type Code</FormLabel>
      <FormControl>
        <Input 
          placeholder="Enter contract type code" 
          {...field} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Mẫu FormField cho Textarea:

```tsx
<FormField
  control={form.control}
  name="description"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Description</FormLabel>
      <FormControl>
        <Textarea 
          placeholder="Enter description" 
          {...field} 
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

## Mẫu FormField cho Select:

```tsx
<FormField
  control={form.control}
  name="status"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Status</FormLabel>
      <Select onValueChange={field.onChange} defaultValue={field.value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

## OnSubmit handler:

```tsx
const onSubmit: SubmitHandler<YourFormType> = (data) => {
  mutate(data, {
    onSuccess: () => {
      // Handle success
      form.reset()
      toggle()
    },
  })
}
```

## Ưu điểm so với custom Input component:

1. ✅ **Tiêu chuẩn shadcn/ui** - theo best practices hiện đại
2. ✅ **Validation thống nhất** - FormMessage tự động hiển thị error
3. ✅ **Giảm complexity** - không cần custom styling và logic
4. ✅ **Accessible** - tích hợp sẵn ARIA attributes
5. ✅ **Type-safe** - TypeScript support đầy đủ
6. ✅ **Dễ maintain** - code sạch, dễ hiểu

## Các component shadcn/ui cần tạo tiếp:
- `src/app/components/ui/textarea.tsx` - cho form fields dài
- `src/app/components/ui/select.tsx` - cho dropdown
- `src/app/components/ui/button.tsx` - cho submit/reset buttons
- `src/app/components/ui/checkbox.tsx` - cho checkbox fields
- `src/app/components/ui/radio-group.tsx` - cho radio buttons

## Chuyển đổi từng form từ old Input component:

Cách cũ (tránh):
```tsx
<Input
  label="Code"
  name="code"
  control={control}
  errors={errors}
  placeholder="..."
/>
```

Cách mới (dùng):
```tsx
<FormField
  control={form.control}
  name="code"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Code</FormLabel>
      <FormControl>
        <Input placeholder="..." {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

---

**File tham khảo**: `modal-create-contract-type-shadcn.tsx`
