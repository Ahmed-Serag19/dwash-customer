// import { useTranslation } from "react-i18next"
// import { Controller, type UseFormReturn } from "react-hook-form"
// import type { District } from "@/interfaces"

// interface DistrictFieldProps {
//   formMethods: UseFormReturn<any>
//   districts: District[]
//   user: any
// }

// const DistrictField = ({ formMethods, districts, user }: DistrictFieldProps) => {
//   const {
//     control,
//     formState: { errors },
//   } = formMethods
//   const { t, i18n } = useTranslation()
//   const currentLang = i18n.language

//   return (
//     <div>
//       <label className="block my-3 text-lg text-gray-700">{t("district")}</label>
//       <Controller
//         name="districtId"
//         control={control}
//         render={({ field }) => (
//           <select {...field} className="w-full px-4 py-2 border rounded-lg">
//             {user?.userAddressDto?.districtAr !== null ? (
//               <option value="">
//                 {currentLang === "ar"
//                   ? user?.userAddressDto?.districtAr
//                   : user?.userAddressDto?.districtEn || user?.userAddressDto?.districtAr}
//               </option>
//             ) : (
//               <option value="">{t("selectDistrict")}</option>
//             )}
//             {districts.map((district) => (
//               <option key={district.districtId} value={district.districtId}>
//                 {currentLang === "ar" ? district.districtNameAr : district.districtNameEn || district.districtNameAr}
//               </option>
//             ))}
//           </select>
//         )}
//       />
//       {errors.districtId && (
//         <p className="text-red-500 text-sm">
//           {typeof errors.districtId.message === "string" ? errors.districtId.message : t("unknown")}
//         </p>
//       )}
//     </div>
//   )
// }

// export default DistrictField
