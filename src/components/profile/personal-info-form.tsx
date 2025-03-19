import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import type { User } from "@/interfaces";

interface PersonalInfoFormProps {
  user: User;
  token: string | null;
  onSuccess: () => void;
}

const PersonalInfoForm = ({
  user,
  token,

  onSuccess,
}: PersonalInfoFormProps) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email || "",
      name: user?.nameEn || "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("email", user.email);
      setValue("name", user.nameEn);
    }
  }, [user, setValue]);

  const onSubmit = async (data: any) => {
    if (!token) {
      toast.error(t("notAuthenticated"));
      return;
    }

    try {
      const response = await axios.put(apiEndpoints.editProfile, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(t("profileUpdated"));
        onSuccess();
      } else {
        toast.error(t("updateFailed"));
      }
    } catch (error) {
      toast.error(t("generalError"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
      {/* Name */}
      <div>
        <label className="block my-3 text-lg text-gray-700">{t("name")}</label>
        <input
          {...register("name", { required: t("nameRequired") })}
          className="w-full px-4 py-2 border rounded-lg"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block my-3 text-lg text-gray-700">{t("email")}</label>
        <input
          {...register("email", { required: t("emailRequired") })}
          className="w-full px-4 py-2 border rounded-lg"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Edit & Save Buttons */}
      <div className="col-span-2 flex justify-start mt-4">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg"
        >
          {t("edit")}
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoForm;
