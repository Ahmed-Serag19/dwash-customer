import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import axios from "axios";
import OTPInput from "@/components/OTPInput";
import { Link } from "react-router-dom";

interface AuthFormProps {
  apiInit: string;
  apiFinalize: string;
  isRegister?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  apiInit,
  apiFinalize,
  isRegister,
}) => {
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

  const phoneRegex = /^05\d{8}$/; // Must start with "05" and have 8 more digits

  const handlePhoneSubmit = async (data: { phoneNumber: string }) => {
    setLoading(true);
    try {
      const response = await axios.post(apiInit, {
        number: data.phoneNumber,
        language,
      });

      if (response.data.success) {
        toast.success(t("otpSent"));
        setPhoneNumber(data.phoneNumber);
        setIsOTP(true);
      } else {
        toast.error(response.data.messageEn || t("loginError"));
      }
    } catch {
      toast.error(t("loginError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative font-[500] w-full text-primary xl:flex-auto flex-1 flex flex-col justify-center items-center xl:w-3/5  gap-7 md:gap-10">
      <div className="font-semibold text-3xl lg:text-4xl mb-6">
        {isRegister ? t("register") : t("login")}
      </div>

      {!isOTP ? (
        <form
          onSubmit={handleSubmit(handlePhoneSubmit)}
          className="w-11/12 space-y-8 md:space-y-12 border p-8 rounded-md border-stone-300"
        >
          <div className="mt-10">
            <label
              htmlFor="phoneNumber"
              className="block text-lg font-[500] mb-2"
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
              className={`w-full px-5 py-6 text-primary  sm:py-7 placeholder:text-primary placeholder:text-lg border ${
                errors.phoneNumber ? "border-red-500" : "border-primary"
              } rounded-lg focus:outline-none focus:border-primary focus:ring-0`}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-md mt-1">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>
          <div className="space-y-4 pb-10">
            <Button
              type="submit"
              variant="primary"
              className="w-full text-lg py-6"
              disabled={loading}
              size="lg"
            >
              {loading ? t("loading") : isRegister ? t("register") : t("login")}
            </Button>
            {isRegister ? (
              <p className="text-black">
                {t("alreadyHaveAccount")}{" "}
                <Link to="/login" className=" text-primary font-bold">
                  {t("LoginNow")}{" "}
                </Link>
              </p>
            ) : (
              <p className="text-black">
                {t("dontHaveAccount")}{" "}
                <Link className=" text-primary font-bold" to="/register">
                  {t("createAnAccount")}{" "}
                </Link>
              </p>
            )}
          </div>
        </form>
      ) : (
        <OTPInput phoneNumber={phoneNumber} apiFinalize={apiFinalize} />
      )}
    </div>
  );
};

export default AuthForm;
