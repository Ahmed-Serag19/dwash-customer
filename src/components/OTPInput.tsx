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

interface OTPProps {
  phoneNumber: string;
  apiFinalize: string;
}

const OTPInput: React.FC<OTPProps> = ({ phoneNumber, apiFinalize }) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      toast.error(t("invalidOTP"));
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(apiFinalize, {
        number: phoneNumber,
        confirmationCode: otp,
      });

      if (response.data.success) {
        toast.success(t("loginSuccess"));
      } else {
        toast.error(response.data.messageEn || t("otpError"));
      }
    } catch {
      toast.error(t("otpError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-80 space-y-4">
      <p className="text-gray-700 text-sm font-medium">{t("enterOTP")}</p>
      <InputOTP
        maxLength={6}
        value={otp}
        onChange={setOtp}
        className="flex justify-center"
      >
        <InputOTPGroup>
          {[...Array(6)].map((_, index) => (
            <InputOTPSlot key={index} index={index} />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <Button onClick={handleOTPSubmit} className="w-full" disabled={loading}>
        {loading ? t("loading") : t("verify")}
      </Button>
    </div>
  );
};

export default OTPInput;
