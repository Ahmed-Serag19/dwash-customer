"use client";

import type React from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";

interface TermsAndConditionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">{t("termsAndConditions")}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div
          className={`overflow-y-auto p-6 ${
            isArabic ? "text-right" : "text-left"
          }`}
        >
          {/* Terms and Conditions Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">
              {t("termsAndConditionsTitle")}
            </h3>
            <ul className="space-y-3 list-disc pl-6 pr-6">
              <li>{t("termRemovalResponsibility")}</li>
              <li>{t("termNoLiability")}</li>
              <li>{t("termDamageNotCovered")}</li>
              <li>{t("termPhotoPermission")}</li>
              <li>{t("termServiceRefusal")}</li>
            </ul>
          </div>

          {/* Complaint Policy Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">
              {t("complaintPolicyTitle")}
            </h3>
            <ul className="space-y-3 list-disc pl-6 pr-6">
              <li>{t("complaintTimeframe")}</li>
              <li>{t("complaintWeatherRebooking")}</li>
              <li>{t("complaintResponsibilityEnd")}</li>
              <li>{t("complaintCustomerAccess")}</li>
            </ul>
          </div>

          {/* Refund Policy Section */}
          <div className="mb-8">
            <h3 className="text-lg font-bold mb-4">{t("refundPolicyTitle")}</h3>
            <ul className="space-y-3 list-disc pl-6 pr-6">
              <li>{t("refundNoShow")}</li>
              <li>{t("refundIncorrectLocation")}</li>
            </ul>
          </div>

          {/* Cancellation Policy Section */}
          <div>
            <h3 className="text-lg font-bold mb-4">
              {t("cancellationPolicyTitle")}
            </h3>
            <ul className="space-y-3 list-disc pl-6 pr-6">
              <li>{t("cancellationLessThan24Hours")}</li>
              <li>{t("cancellationLessThan2Hours")}</li>
            </ul>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            {t("close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsModal;
