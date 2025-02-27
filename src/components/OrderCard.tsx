import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import StarRating from "./StarRating";

interface OrderCardProps {
  order: {
    reservationDate: any;
    reviewed: boolean;
    invoiceId: number;
    brandNameAr: string;
    brandNameEn: string;
    userPhoneNumber: string | null;
    fromTime: string | null;
    timeTo: string | null;
    statusName: string;
    itemDto: {
      itemNameAr: string;
      itemNameEn: string;
      serviceTypeAr: string;
      serviceTypeEn: string;
      itemPrice: number;
      itemExtraDtos: Array<{
        itemExtraNameAr: string;
        itemExtraNameEn: string;
        itemExtraPrice: number;
      }>;
    };
    totalAmount: number;
    request: {
      statusName: string;
      id: number;
    };
  };
  isClosed: boolean;
  onCancel?: () => void;
  onAddReview?: (
    requestId: number,
    appraisal: number,
    description: string
  ) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({
  order,
  isClosed,
  onCancel,
  onAddReview,
}) => {
  const { t, i18n } = useTranslation();
  const {
    brandNameAr,
    brandNameEn,
    userPhoneNumber,
    fromTime,
    timeTo,
    itemDto,
    totalAmount,
    request,
    reviewed,
  } = order;
  const {
    itemNameAr,
    itemNameEn,
    serviceTypeAr,
    serviceTypeEn,
    itemPrice,
    itemExtraDtos,
  } = itemDto;

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [appraisal, setAppraisal] = useState(0);
  const [description, setDescription] = useState("");

  const handleAddReview = () => {
    if (onAddReview) {
      onAddReview(request.id, appraisal, description);
      setIsReviewModalOpen(false);
    }
  };

  return (
    <div
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
      className="border p-4 rounded-lg shadow-md flex flex-col gap-3"
    >
      <h3 className="text-lg font-bold">
        {brandNameEn} ({brandNameAr})
      </h3>

      {/* Display user phone number if available */}
      {userPhoneNumber && (
        <p>
          <span className="font-semibold text-primary">{t("phone")}:</span>{" "}
          {userPhoneNumber}
        </p>
      )}

      {/* Display time range if available */}
      {!isClosed && fromTime && timeTo && (
        <p>
          <span className="font-semibold text-primary">{t("time")}:</span>{" "}
          {fromTime} - {timeTo}
        </p>
      )}
      {order.reservationDate && (
        <p>
          <span className="font-semibold text-primary">{t("date")}:</span>{" "}
          {order.reservationDate}
        </p>
      )}

      {/* Display status */}
      <p>
        <span className="font-semibold text-primary">{t("status")}:</span>{" "}
        <span
          className={`${
            request.statusName === "COMPLETED" ||
            request.statusName === "ACCEPTED"
              ? "text-green-500"
              : "text-red-500"
          } font-semibold `}
        >
          {request.statusName}
        </span>
      </p>

      {/* Display service details */}
      <p>
        <span className="font-semibold text-primary">{t("service")}:</span>{" "}
        {itemNameEn} ({itemNameAr})
      </p>
      <p>
        <span className="font-semibold text-primary">{t("serviceType")}:</span>{" "}
        {serviceTypeEn} ({serviceTypeAr})
      </p>
      <p>
        <span className="font-semibold text-primary">{t("price")}:</span>{" "}
        {itemPrice}
      </p>

      {/* Display extras if available */}
      {itemExtraDtos.length > 0 && (
        <div>
          <p className="font-semibold text-primary">{t("extras")}:</p>
          <ul>
            {itemExtraDtos.map((extra, index) => (
              <li key={index}>
                {extra.itemExtraNameEn} ({extra.itemExtraNameAr}) -{" "}
                {extra.itemExtraPrice}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display total amount */}
      <p>
        <span className="font-semibold text-primary">{t("total")}:</span>{" "}
        {totalAmount}
      </p>

      {/* Display cancel button for current orders */}
      {!isClosed && onCancel && (
        <button
          onClick={onCancel}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
        >
          {t("cancelOrder")}
        </button>
      )}

      {/* Display add review button for completed orders */}
      {request.statusName === "COMPLETED" && !reviewed && (
        <button
          onClick={() => setIsReviewModalOpen(true)}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
        >
          {t("addReview")}
        </button>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-bold">{t("reviewModalTitle")}</h3>
            <div className="mt-4">
              <label className="block font-semibold">
                {t("appraisalLabel")}:
              </label>
              <StarRating rating={appraisal} onRatingChange={setAppraisal} />
            </div>
            <div className="mt-4">
              <label className="block font-semibold">
                {t("descriptionLabel")}:
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setIsReviewModalOpen(false)}
                className="bg-gray-300 px-4 py-2 rounded"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleAddReview}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {t("submit")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;
