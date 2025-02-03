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
    <div className="w-11/12 space-y-8 border p-8 rounded-md border-stone-300">
      <p className="text-primary text-lg font-medium">{t("enterOTP")}</p>
      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
        <InputOTPGroup dir="ltr" className="flex justify-around gap-5 w-full">
          <InputOTPSlot
            index={0}
            className="rounded-lg border border-primary p-6"
          />
          <InputOTPSlot
            index={1}
            className="rounded-lg border border-primary p-6"
          />
          <InputOTPSlot
            index={2}
            className="rounded-lg border border-primary p-6"
          />
          <InputOTPSlot
            index={3}
            className="rounded-lg border border-primary p-6"
          />
          <InputOTPSlot
            index={4}
            className="rounded-lg border border-primary p-6"
          />
          <InputOTPSlot
            index={5}
            className="rounded-lg border border-primary p-6"
          />
        </InputOTPGroup>
      </InputOTP>

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
