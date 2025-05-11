"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Trash2, CheckCircle, Circle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CartCardProps {
  item: any;
  onDelete: (invoiceId: number, itemId: number) => void;
  isSelected: boolean;
  onSelect: (invoiceId: number) => void;
}

const CartCard = ({ item, onDelete, isSelected, onSelect }: CartCardProps) => {
  const { t, i18n } = useTranslation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const calculateTotalPrice = () => {
    const basePrice = item.itemDto.itemPrice || 0;
    const extrasTotal =
      item.itemDto.itemExtraDtos?.reduce(
        (sum: number, extra: { itemExtraPrice: number }) =>
          sum + (extra.itemExtraPrice || 0),
        0
      ) || 0;
    return basePrice + extrasTotal;
  };

  const totalPrice = calculateTotalPrice();

  const handleSelect = () => {
    onSelect(item.invoiceId);
  };

  return (
    <div
      className={`rounded-lg border bg-white shadow-sm overflow-hidden transition-all ${
        isSelected
          ? "border-primary ring-1 ring-primary"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1 space-y-4">
            <div className="flex items-start gap-3">
              <button
                onClick={handleSelect}
                className="mt-1 flex-shrink-0 focus:outline-none cursor-pointer"
              >
                {isSelected ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-gray-400" />
                )}
              </button>

              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {i18n.language === "ar"
                    ? item.itemDto.itemNameAr
                    : item.itemDto.itemNameEn}
                </h3>
                <p className="text-sm text-gray-600">
                  {i18n.language === "ar"
                    ? item.itemDto.serviceTypeAr
                    : item.itemDto.serviceTypeEn}
                </p>
              </div>
            </div>

            {/* Base Price */}
            <div>
              <p className="text-sm text-gray-500">{t("basePrice")}</p>
              <p className="font-medium">
                {item.itemDto.itemPrice} {t("SAR")}
              </p>
            </div>

            {/* Extra Services */}
            {item?.itemDto?.itemExtraDtos?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700">
                  {t("extraServices")}
                </h4>
                <ul className="mt-1 space-y-1">
                  {item.itemDto.itemExtraDtos.map(
                    (extra: {
                      itemExtraId: number;
                      itemExtraNameAr: string;
                      itemExtraNameEn: string;
                      itemExtraPrice: number;
                    }) => (
                      <li
                        key={extra.itemExtraId}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {i18n.language === "ar"
                            ? extra.itemExtraNameAr
                            : extra.itemExtraNameEn}
                        </span>
                        <span>
                          {extra.itemExtraPrice} {t("SAR")}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 items-end">
            {/* Total Price */}
            <div className="text-right">
              <p className="text-sm text-gray-500">{t("total")}</p>
              <p className="text-xl font-bold text-primary">
                {totalPrice.toFixed(2)} {t("SAR")}
              </p>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
              aria-label={t("delete")}
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(item.invoiceId, item.invoiceId);
                setIsDeleteModalOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CartCard;
