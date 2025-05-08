import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { User } from "@/interfaces";
import { Loader2 } from "lucide-react";

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
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
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
    <Card className="border shadow-sm" dir={isRTL ? "rtl" : "ltr"}>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-base">
                {t("name")}
              </Label>
              <Input
                id="name"
                {...register("name", { required: t("nameRequired") })}
                className="h-11"
              />
              {errors.name && (
                <p className="text-destructive text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-base">
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                {...register("email", { required: t("emailRequired") })}
                className="h-11"
              />
              {errors.email && (
                <p className="text-destructive text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full sm:w-auto"
            disabled={isSubmitting}
            variant="primary"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("saving")}
              </>
            ) : (
              t("edit")
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PersonalInfoForm;
