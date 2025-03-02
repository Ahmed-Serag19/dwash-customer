import React from "react";
import { useTranslation } from "react-i18next";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <h3 className="text-xl font-bold text-center py-3">{t("confirm")}</h3>
        <p className="py-3">{t("confirmCancel")}</p>
        <div className="mt-4 flex justify-center gap-4">
          <button onClick={onClose} className="bg-gray-300 w-16 py-1 rounded">
            {t("no")}
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white w-16 py-1 rounded"
          >
            {t("yes")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
