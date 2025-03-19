import { useTranslation } from "react-i18next"
import type { UseFormReturn } from "react-hook-form"

interface EmailFieldProps {
  formMethods: UseFormReturn<any>
  disabled: boolean
}

const EmailField = ({ formMethods, disabled }: EmailFieldProps) => {
  const {
    register,
    formState: { errors },
  } = formMethods
  const { t } = useTranslation()

  return (
    <div>
      <label className="block my-3 text-lg text-gray-700">{t("email")}</label>
      <input
        {...register("email", { required: t("emailRequired") })}
        className="w-full px-4 py-2 border rounded-lg"
        disabled={disabled}
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
    </div>
  )
}

export default EmailField

