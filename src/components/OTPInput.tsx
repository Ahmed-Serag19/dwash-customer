import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { apiEndpoints } from "@/constants/endPoints";
import { useUser } from "@/context/UserContext";

interface OTPProps {
  phoneNumber: string;
  isRegister?: boolean;
}

const OTPInput: React.FC<OTPProps> = ({ phoneNumber, isRegister }) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { getUser } = useUser();
  const navigate = useNavigate();

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      toast.error(t("invalidOTP"));
      return;
    }

    setLoading(true);
    try {
      const apiUrl = isRegister
        ? apiEndpoints.RegisterFinalize(otp, phoneNumber)
        : apiEndpoints.LoginFinalize(otp, phoneNumber);

      const response = await axios.post(apiUrl, {});
      console.log(response);
      if (response.data.success) {
        const token = response.data.content?.token;
        console.log(response.data.content);
        if (token) {
          sessionStorage.setItem("accessToken", token);
          const currentToken = sessionStorage.getItem("accessToken");
          console.log(currentToken);
          getUser();
          {
            isRegister
              ? toast.success(t("registerSuccess"))
              : toast.success(t("loginSuccess"));
          }
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.error(t("tokenMissing"));
        }
      } else if (
        response.data.messageAr === "Confirmation code has been expired"
      ) {
        toast.error(t("otpExpired"));
        navigate("/login");
      } else {
        toast.error(t("otpError"));
      }
      {
        toast.error(response.data.messageEn || t("otpError"));
      }
    } catch (error) {
      toast.error(t("otpError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-11/12 space-y-8 z-10 border p-8 rounded-md border-stone-500 md:border-0 md:p-3 md:border-transparent">
      <div>
        <label htmlFor="phoneNumber" className="block text-xl font-[500] mb-2">
          {t("phoneNumber")}
        </label>
        <Input
          disabled
          type="tel"
          placeholder={phoneNumber}
          className="w-full px-5 py-6 text-primary disabled:border-primary disabled:text-primary sm:py-7 placeholder:text-primary placeholder:text-lg border rounded-lg focus:outline-none focus:border-primary focus:ring-0"
        />
      </div>
      <div>
        <p className="text-primary text-xl font-medium my-3">{t("enterOTP")}</p>
        <InputOTP maxLength={6} value={otp} onChange={setOtp}>
          <InputOTPGroup dir="ltr" className="flex justify-around gap-5 w-full">
            {[...Array(6)].map((_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="rounded-lg border border-primary p-4 sm:p-6 sm:text-lg"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <Button
        onClick={handleOTPSubmit}
        className="w-full text-xl rounded-3xl py-6"
        variant="primary"
        disabled={loading}
        size="lg"
      >
        {loading ? t("loading") : t("verify")}
      </Button>
    </div>
  );
};

export default OTPInput;
