import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface CartCardProps {
  item: any;
  onDelete: (invoiceId: number, itemId: number) => void;
  onBook: (invoiceId: number, brandId: number) => void; // ✅ Trigger modal in `Cart.tsx`
}

const CartCard: React.FC<CartCardProps> = ({ item, onDelete, onBook }) => {
  const { t, i18n } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="rounded-lg border  border-gray-300 bg-white p-8 drop-shadow-lg flex justify-between">
      <div className="flex flex-col">
        <h1 className="text-xl text-primary font-semibold">
          {i18n.language === "ar"
            ? item.itemDto.itemNameAr
            : item.itemDto.itemNameEn}
        </h1>
        <p className="text-gray-600">
          {i18n.language === "ar"
            ? item.itemDto.serviceTypeAr
            : item.itemDto.serviceTypeEn}
        </p>
        <p className="text-primary font-semibold">
          {item.itemDto.itemPrice} {t("SAR")}
        </p>

        {/* Extra Services */}
        {item.itemDto.itemExtraDtos.length > 0 && (
          <div className="mt-2">
            <h3 className="text-sm font-semibold">{t("extraServices")}</h3>
            <ul className="list-disc pl-4 text-sm">
              {item.itemDto.itemExtraDtos.map(
                (extra: {
                  itemExtraId: number;
                  itemExtraNameAr: string;
                  itemExtraNameEn: string;
                  itemExtraPrice: number;
                }) => (
                  <li key={extra.itemExtraId}>
                    {i18n.language === "ar"
                      ? extra.itemExtraNameAr
                      : extra.itemExtraNameEn}{" "}
                    - {extra.itemExtraPrice} {t("SAR")}
                  </li>
                )
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between items-end">
        {/* Delete Button */}
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="text-red-500 hover:text-red-700"
        >
          <FaTrash size={20} />
        </button>

        {/* Book Now Button → Passes `invoiceId` & `brandId` to open the global modal */}
        <button
          onClick={() => onBook(item.invoiceId, item.brandId)}
          className="bg-primary text-white px-4 py-1 rounded-lg"
        >
          {t("bookNow")}
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          onConfirm={() => {
            onDelete(item.invoiceId, item.invoiceId);
            setIsDeleteModalOpen(false);
          }}
          onCancel={() => setIsDeleteModalOpen(false)}
        />
      )}
    </div>
  );
};

// Delete Confirmation Modal
const ConfirmDeleteModal: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-3 rounded-lg text-center">
        <h2 className="text-xl font-semibold">{t("confirmDelete")}</h2>
        <p className="text-gray-600">{t("deleteConfirmation")}</p>
        <div className="mt-4 flex justify-around">
          <button
            onClick={onCancel}
            className="bg-gray-500 px-4 py-2 text-white rounded-lg"
          >
            {t("cancel")}
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 px-4 py-2 text-white rounded-lg"
          >
            {t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartCard;
