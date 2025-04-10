// import { useTranslation } from "react-i18next";
// import type { UseFormReturn } from "react-hook-form";

// interface NameFieldProps {
//   formMethods: UseFormReturn<any>;
//   disabled: boolean;
// }

// const NameField = ({ formMethods, disabled }: NameFieldProps) => {
//   const {
//     register,
//     formState: { errors },
//   } = formMethods;
//   const { t } = useTranslation();

//   return (
//     <div>
//       <label className="block my-3 text-lg text-gray-700">{t("name")}</label>
//       <input
//         {...register("name", { required: t("nameRequired") })}
//         className="w-full px-4 py-2 border rounded-lg"
//         disabled={disabled}
//       />
//       {errors.name && (
//         <p className="text-red-500 text-sm">{errors.name.message as string}</p>
//       )}
//     </div>
//   );
// };

// export default NameField;
