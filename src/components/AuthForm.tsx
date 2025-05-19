import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "axios";
import OTPInput from "@/components/OTPInput";
import { Link } from "react-router-dom";
import { apiEndpoints } from "@/constants/endPoints";

interface AuthFormProps {
  isRegister?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isRegister }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language.toUpperCase();
  const [isOTP, setIsOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ phoneNumber: string }>();

  const phoneRegex = /^05\d{8}$/;

  const handlePhoneSubmit = async (data: { phoneNumber: string }) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");

      // ✅ Dynamically determine the API endpoint based on isRegister
      const apiUrl = isRegister
        ? apiEndpoints.RegisterInitiate(data.phoneNumber, language)
        : apiEndpoints.LoginInitiate(data.phoneNumber, language);

      const response = await axios.post(
        apiUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success(t("otpSent"));
        setPhoneNumber(data.phoneNumber);
        setIsOTP(true);
      } else {
        toast.error(
          response.data.messageEn ||
            (isRegister ? t("registerError") : t("loginError"))
        );
      }
    } catch (error: any) {
      toast.error(
        i18n.language === "ar"
          ? error.response.data.messageAr
          : error.response.data.messageEn
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative font-[500] w-full text-primary xl:flex-auto flex-1 flex flex-col justify-center items-center xl:w-3/5 gap-7 md:gap-10">
      <div className="mobile-bg absolute top-0 right-0 left-0 bottom-0 md:hidden "></div>
      <div className="font-semibold text-3xl lg:text-4xl mb-6 z-10">
        {isRegister ? t("register") : t("login")}
      </div>

      {!isOTP ? (
        <form
          onSubmit={handleSubmit(handlePhoneSubmit)}
          className="w-11/12 space-y-8 md:space-y-12 border z-10 p-8 rounded-md border-stone-500 md:border-0 md:p-3 md:border-transparent"
        >
          <div className="mt-10">
            <label
              htmlFor="phoneNumber"
              className="block text-xl font-[500] mb-2"
            >
              {t("phoneNumber")}
            </label>
            <Input
              type="tel"
              id="phoneNumber"
              placeholder="05xxxxxxxx"
              {...register("phoneNumber", {
                required: t("phoneRequired"),
                pattern: { value: phoneRegex, message: t("invalidPhone") },
              })}
              className={`w-full px-5 py-6 text-primary sm:py-7 placeholder:text-primary placeholder:text-lg border ${
                errors.phoneNumber ? "border-red-500" : "border-primary"
              } rounded-lg focus:outline-none focus:border-primary focus:ring-0`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-md mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className="space-y-4">
            <Button
              type="submit"
              variant="primary"
              className="w-full text-lg py-6 rounded-3xl"
              disabled={loading}
              size="lg"
            >
              {loading ? t("loading") : isRegister ? t("register") : t("login")}
            </Button>
          </div>
          {isRegister ? (
            <p className="text-black">
              {t("alreadyHaveAccount")}{" "}
              <Link to="/login" className=" text-primary font-bold">
                {t("LoginNow")}
              </Link>
            </p>
          ) : (
            <p className="text-black">
              {t("dontHaveAccount")}{" "}
              <Link className=" text-primary font-bold" to="/register">
                {t("createAnAccount")}
              </Link>
            </p>
          )}
        </form>
      ) : (
        <OTPInput phoneNumber={phoneNumber} isRegister={isRegister} />
      )}
    </div>
  );
};

export default AuthForm;
