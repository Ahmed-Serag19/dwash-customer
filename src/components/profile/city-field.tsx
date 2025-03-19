import { useTranslation } from "react-i18next"
import { Controller, type UseFormReturn } from "react-hook-form"
import type { City } from "@/interfaces"

interface CityFieldProps {
  formMethods: UseFormReturn<any>
  cities: City[]
  user: any
}

const CityField = ({ formMethods, cities, user }: CityFieldProps) => {
  const {
    control,
    formState: { errors },
  } = formMethods
  const { t, i18n } = useTranslation()
  const currentLang = i18n.language

  return (
    <div>
      <label className="block my-3 text-lg text-gray-700">{t("city")}</label>
      <Controller
        name="cityId"
        control={control}
        render={({ field }) => (
          <select {...field} className="w-full px-4 py-2 border rounded-lg">
            {user?.userAddressDto?.cityAr !== null ? (
              <option value="">
                {currentLang === "ar"
                  ? user?.userAddressDto?.cityAr
                  : user?.userAddressDto?.cityEn || user?.userAddressDto?.cityAr}
              </option>
            ) : (
              <option value="">{t("selectCity")}</option>
            )}

            {cities.map((city) => (
              <option key={city.cityId} value={city.cityId}>
                {currentLang === "ar" ? city.cityNameAr : city.cityNameEn || city.cityNameAr}
              </option>
            ))}
          </select>
        )}
      />
      {errors.cityId && (
        <p className="text-red-500 text-sm">
          {typeof errors.cityId.message === "string" ? errors.cityId.message : t("unknown")}
        </p>
      )}
    </div>
  )
}

export default CityField

