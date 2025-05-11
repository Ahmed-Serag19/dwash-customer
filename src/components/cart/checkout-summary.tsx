"use client";

import { useTranslation } from "react-i18next";

interface CheckoutSummaryProps {
  subtotal: number;
  discountAmount: number;
  discountType: string | null;
  discountValue: number;
  finalTotal: number;
}

const CheckoutSummary = ({
  subtotal,
  discountAmount,
  discountType,
  discountValue,
  finalTotal,
}: CheckoutSummaryProps) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between">
        <span className="font-medium">{t("subtotal")}</span>
        <span>
          {subtotal.toFixed(2)} {t("SAR")}
        </span>
      </div>

      <div className="flex justify-between">
        <div className="flex gap-3">
          <span>{t("discount")}</span>
          <span>
            {discountType === "PERCENTAGE" ? (
              <span>{discountAmount}%</span>
            ) : (
              <div className="flex gap-1">
                <span>{discountAmount}</span>
                <span>{t("SAR")}</span>
              </div>
            )}
          </span>
        </div>
        <span>
          -{discountValue.toFixed(2)} {t("SAR")}
        </span>
      </div>

      <div className="flex justify-between border-t pt-2 text-lg font-bold">
        <span>{t("total")}</span>
        <span className="text-primary">
          {finalTotal.toFixed(2)} {t("SAR")}
        </span>
      </div>
    </div>
  );
};

export default CheckoutSummary;
