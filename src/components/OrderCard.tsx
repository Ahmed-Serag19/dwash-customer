import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import StarRating from "./StarRating";
import ChatButton from "./chat/chat-button";
import ChatModal from "./chat/chat-modal";
import { OrderCardProps } from "@/interfaces";
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
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [appraisal, setAppraisal] = useState(0);
  const [description, setDescription] = useState("");

  // Safely handle itemExtraDtos (default to an empty array if null/undefined)
  const extras = itemExtraDtos ?? [];

  const handleAddReview = () => {
    if (onAddReview) {
      onAddReview(request.id, appraisal, description);
      setIsReviewModalOpen(false);
    }
  };

  const handleOpenChat = () => {
    setIsChatModalOpen(true);
  };

  type StatusName =
    | "WAITING"
    | "COMPLETED"
    | "COMPLETED_BY_ADMIN"
    | "CANCELLED"
    | "CANCELLED_BY_ADMIN"
    | "REJECTED"
    | "ACCEPTED";

  const statusTranslations: Record<StatusName, { en: string; ar: string }> = {
    WAITING: {
      en: "Waiting",
      ar: "في الانتظار",
    },
    COMPLETED: {
      en: "Completed",
      ar: "مكتمل",
    },
    COMPLETED_BY_ADMIN: {
      en: "Completed by Admin",
      ar: "مكتمل بواسطة الأدمن",
    },
    CANCELLED: {
      en: "Cancelled",
      ar: "ملغى",
    },
    CANCELLED_BY_ADMIN: {
      en: "Cancelled by Admin",
      ar: "ملغى بواسطة الأدمن",
    },
    REJECTED: {
      en: "Rejected",
      ar: "مرفوض",
    },
    ACCEPTED: {
      en: "Accepted",
      ar: "مقبول",
    },
  };

  const translatedStatus =
    statusTranslations[request.statusName as StatusName]?.[
      i18n.language as "en" | "ar"
    ] || request.statusName;

  // Check if chat should be available (only for ACCEPTED orders)
  const isChatAvailable = request.statusName === "ACCEPTED";

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
            request.statusName.includes("COMPLETED") ||
            request.statusName === "ACCEPTED"
              ? "text-green-500"
              : "text-red-500"
          } font-semibold `}
        >
          {translatedStatus}
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
      {extras.length > 0 && (
        <div>
          <p className="font-semibold text-primary">{t("extras")}:</p>
          <ul>
            {extras.map((extra, index) => (
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
      {extras.length === 0 && <div className="min-h-12"></div>}

      {/* Action buttons */}
      <div className="flex flex-col gap-2 mt-2">
        {/* Display cancel button for current orders */}
        {!isClosed && onCancel && (
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            {t("cancelOrder")}
          </button>
        )}

        {/* Display chat button for accepted orders */}
        {isChatAvailable && (
          <ChatButton requestId={request.id} onOpenChat={handleOpenChat} />
        )}

        {/* Display add review button for completed orders */}
        {request.statusName === "COMPLETED" && !reviewed && (
          <button
            onClick={() => setIsReviewModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {t("addReview")}
          </button>
        )}
      </div>

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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

      {/* Chat Modal */}
      {isChatModalOpen && (
        <ChatModal
          isOpen={isChatModalOpen}
          onClose={() => setIsChatModalOpen(false)}
          requestId={request.id}
          freelancerName={brandNameEn}
        />
      )}
    </div>
  );
};

export default OrderCard;
