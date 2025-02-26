import { useUser } from "@/context/UserContext";
import CartCard from "@/components/CartCard";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { useState, useEffect } from "react";
import TimeSlotModal from "@/components/TimeSlotModal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { cart, getCart, token } = useUser();
  const { t } = useTranslation();
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    null
  );
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);

  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (cart && cart.length > 0) {
      setSelectedBrandId(cart[0].brandId);
    }
  }, [cart]);

  const handleApplyDiscount = async () => {
    if (!discountCode) {
      toast.error(t("enterValidDiscount"));
      return;
    }

    if (!selectedBrandId) {
      toast.error(t("noBrandDetected"));
      return;
    }

    try {
      const response = await axios.get(
        `${apiEndpoints.validateDiscount}?discountCode=${discountCode}&brandId=${selectedBrandId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const discount = response.data.content;
        setDiscountAmount(discount.discountAmount);
        setDiscountType(discount.discountType);
        toast.success(t("discountApplied"));
      } else {
        toast.error(t("invalidDiscount"));
      }
    } catch (error) {
      toast.error(t("invalidDiscount"));
      console.error("Error validating discount:", error);
    }
  };

  const subtotal = (cart ?? []).reduce(
    (sum, item) =>
      sum +
      item.itemDto.itemPrice +
      item.itemDto.itemExtraDtos.reduce(
        (extraSum: any, extra: { itemExtraPrice: any }) =>
          extraSum + extra.itemExtraPrice,
        0
      ),
    0
  );

  const discountValue =
    discountType === "PERCENTAGE"
      ? (subtotal * discountAmount) / 100
      : discountType === "AMOUNT"
      ? discountAmount
      : 0;

  const finalTotal = subtotal - discountValue;

  const handlePayment = async () => {
    if (!selectedInvoiceId || !selectedSlotId) {
      toast.error(t("pleaseSelectSlot"));
      return;
    }

    try {
      const response = await axios.post(
        apiEndpoints.makePayment,
        {
          paymentMethodId: 1,
          invoiceId: selectedInvoiceId,
          slotId: selectedSlotId,
          discountCode: discountCode || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(t("paymentSuccessful"));
        getCart();
        setDiscountAmount(0);
        setDiscountType(null);
        setDiscountCode("");
        navigate("/orders");
      } else {
        toast.error(t("paymentFailed"));
      }
    } catch (error) {
      toast.error(t("paymentFailed"));
      console.error("Payment error:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{t("yourCart")}</h1>

      <div className="space-y-4">
        {cart && cart.length ? (
          cart.map((item) => (
            <CartCard
              key={item.invoiceId}
              item={item}
              onDelete={(invoiceId, itemId) => {
                axios
                  .delete(
                    `${apiEndpoints.deleteFromCart}?invoiceId=${invoiceId}&itemId=${itemId}`,
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  )
                  .then(() => {
                    getCart();
                    toast.success(t("itemRemoved"));
                  })
                  .catch((err) => console.error("Error deleting item:", err));
              }}
              onBook={(invoiceId, brandId) => {
                setSelectedInvoiceId(invoiceId);
                setSelectedBrandId(brandId);
                setIsBookingModalOpen(true);
              }}
            />
          ))
        ) : (
          <p className="text-center">{t("cartEmpty")}</p>
        )}
      </div>

      {/* ✅ Discount Input */}
      <div className="mt-4 space-y-2 p-4 border rounded-lg flex justify-between items-center bg-gray-100">
        <div className="flex gap-2 items-center">
          <label className="font-semibold">{t("discountCode")}</label>
          <input
            type="text"
            placeholder={t("code")}
            className="border p-2 rounded-lg w-40"
            value={discountCode}
            onChange={(e) => setDiscountCode(e.target.value)}
          />
        </div>
        <div>
          <button
            onClick={handleApplyDiscount}
            className="px-5 py-1.5 text-md bg-primary text-white rounded-lg"
          >
            {t("activate")}
          </button>
        </div>
      </div>

      {/* ✅ Price Summary */}
      <div className="mt-4 space-y-2 p-4 border rounded-lg bg-gray-100">
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

      {/* ✅ Confirm Booking Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={handlePayment}
          className="bg-primary px-6 py-2 text-white font-semibold rounded-lg"
        >
          {t("confirmBooking")}
        </button>
      </div>

      {/* ✅ Full-Screen Booking Time Slot Modal */}
      {isBookingModalOpen && selectedInvoiceId && selectedBrandId && (
        <TimeSlotModal
          brandId={selectedBrandId}
          setSelectedSlotId={setSelectedSlotId}
          onClose={() => setIsBookingModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Cart;
