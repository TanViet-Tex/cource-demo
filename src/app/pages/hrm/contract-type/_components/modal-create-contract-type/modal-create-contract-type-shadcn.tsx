import { useToastMessageAsync } from '~/app/hooks/use-toast-message-async'
import { useMutation } from '@tanstack/react-query'
import { CreateContractTypeRequestType } from '~/app/types/contract-type/request/contract-type.type'
import { contractTypeCommandApi } from '~/app/apis/contract-type/command/contract-type.command.api'
import { yupResolver } from '@hookform/resolvers/yup'
import { contractTypeSchema } from '~/app/schemas/contract-type.schema'
import { SubmitHandler, useForm } from 'react-hook-form'
import { queryClient } from '~/app/query-client'
import { TANSTACK_KEY } from '~/app/configs/tanstack-key.config'
import ModalCommon from '~/app/components/modal-common-component'
import { useRef } from 'react'
import { useKeydownForm } from '~/app/hooks/use-keydown-form'
import { useLang } from '~/app/hooks/use-lang'
import { CONFIG_LANG_KEY } from '~/app/configs/lang-key.config'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/app/components/ui/form'
import { Input } from '~/app/components/ui/input'

interface ModalCreateContractTypeProps {
  modal: boolean
  toggle: () => void
}

export default function ModalCreateContractTypeShadcn({
  modal,
  toggle,
}: ModalCreateContractTypeProps) {
  const { getLangKey } = useLang()
  const { messageSuccess } = useToastMessageAsync()
  const {
    mutate,
    isPending: mutatePending,
    isError: mutateIsError,
    error: mutateError,
  } = useMutation({
    mutationFn: (body: CreateContractTypeRequestType) =>
      contractTypeCommandApi.createContractType(body),
  })

  const form = useForm<CreateContractTypeRequestType>({
    resolver: yupResolver(contractTypeSchema),
    defaultValues: {
      contractTypeCode: '',
      contractTypeName: '',
    },
  })

  const onSubmit: SubmitHandler<CreateContractTypeRequestType> = (data) => {
    mutate(data, {
      onSuccess: () => {
        queryClient.refetchQueries({
          queryKey: [TANSTACK_KEY.CONTRACT_TYPE_ALL],
        })
        toggle()
        messageSuccess(getLangKey(CONFIG_LANG_KEY.ERP365_CREATE_SUCCESSFULLY))
        form.reset()
      },
    })
  }

  const formRef = useRef<HTMLFormElement>(null)
  useKeydownForm(formRef)

  return (
    <ModalCommon
      modal={modal}
      onClose={() => {
        toggle()
        form.reset()
      }}
      title={getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_ADD_CT)}
      titleFooter={getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_CREATE_CT)}
      onSubmit={form.handleSubmit(onSubmit)}
      disabled={mutatePending}
    >
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {mutateIsError && (
            <div className="text-sm text-red-600">
              {getLangKey(mutateError.message)}
            </div>
          )}

          <FormField
            control={form.control}
            name="contractTypeCode"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>
                  {getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_TITLE_INPUT_CT_CODE)}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={getLangKey(
                      CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_PLACEHOLDER_CT_CODE
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contractTypeName"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>
                  {getLangKey(CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_TITLE_INPUT_CT)}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={getLangKey(
                      CONFIG_LANG_KEY.PAGE_CONTRACT_TYPE_PLACEHOLDER_CT
                    )}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </ModalCommon>
  )
}
