import { useUser } from "@/context/UserContext";
import CartCard from "@/components/cart/cart-card";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SelectionCard from "@/components/cart/selection-card";
import { Loader2, ShoppingCart, Calendar, Clock } from "lucide-react";

interface TimeSlot {
  slotId: number;
  brandNameAr: string;
  brandNameEn: string;
  timeFrom: string;
  timeTo: string;
  date: string;
  reserved: number;
  username: string | null;
  mobile: string | null;
}

const Cart = () => {
  const { cart, getCart, token } = useUser();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State for checkout
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [discountType, setDiscountType] = useState<string | null>(null);

  // State for address and car selection
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [selectionConfirmed, setSelectionConfirmed] = useState(false);

  // State for selected item
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(
    () => {
      const storedInvoiceId = localStorage.getItem("selectedInvoiceId");
      return storedInvoiceId ? Number.parseInt(storedInvoiceId, 10) : null;
    }
  );

  // State for selected time slot
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(() => {
    const storedSlotId = localStorage.getItem("selectedSlotId");
    return storedSlotId ? Number.parseInt(storedSlotId, 10) : null;
  });

  // State for time slot details
  const [timeSlotDetails, setTimeSlotDetails] = useState<TimeSlot | null>(null);
  const [loadingTimeSlot, setLoadingTimeSlot] = useState(false);

  // Get the selected item
  const selectedItem = cart?.find(
    (item) => item.invoiceId === selectedInvoiceId
  );

  // Calculate subtotal for the selected item
  const subtotal = selectedItem
    ? (selectedItem?.itemDto?.itemPrice || 0) +
      (selectedItem?.itemDto?.itemExtraDtos?.reduce(
        (sum: number, extra: { itemExtraPrice: number }) =>
          sum + (extra.itemExtraPrice || 0),
        0
      ) || 0)
    : 0;

  // Calculate discount value
  const discountValue =
    discountType === "PERCENTAGE"
      ? (subtotal * discountAmount) / 100
      : discountType === "AMOUNT"
      ? discountAmount
      : 0;

  const finalTotal = subtotal - discountValue;

  // Fetch time slot details when selectedSlotId changes
  useEffect(() => {
    if (selectedSlotId && token && selectedItem?.brandId) {
      setLoadingTimeSlot(true);
      axios
        .get(`${apiEndpoints.getSlots}?brandId=${selectedItem.brandId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.success) {
            const slots = response.data.content || [];
            const selectedSlot = slots.find(
              (slot: TimeSlot) => slot.slotId === selectedSlotId
            );
            if (selectedSlot) {
              setTimeSlotDetails(selectedSlot);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching time slot details:", error);
        })
        .finally(() => {
          setLoadingTimeSlot(false);
        });
    }
  }, [selectedSlotId, token, selectedItem]);

  // Handle item selection for checkout
  const handleSelectItem = (invoiceId: number) => {
    if (selectedInvoiceId === invoiceId) {
      // Deselect if already selected
      setSelectedInvoiceId(null);
      localStorage.removeItem("selectedInvoiceId");

      // Reset checkout-related states
      setSelectedAddressId(null);
      setSelectedCarId(null);
      setSelectionConfirmed(false);
      setDiscountAmount(0);
      setDiscountType(null);
      setDiscountCode("");
    } else {
      // Select new item
      setSelectedInvoiceId(invoiceId);
      localStorage.setItem("selectedInvoiceId", invoiceId.toString());

      // Reset checkout-related states
      setSelectedAddressId(null);
      setSelectedCarId(null);
      setSelectionConfirmed(false);
      setDiscountAmount(0);
      setDiscountType(null);
      setDiscountCode("");
    }
  };

  const handleApplyDiscount = async () => {
    if (!discountCode) {
      toast.error(t("enterValidDiscount"));
      return;
    }

    if (!selectedItem) {
      toast.error(t("selectItemFirst"));
      return;
    }

    try {
      const response = await axios.get(
        `${apiEndpoints.validateDiscount}?discountCode=${discountCode}&brandId=${selectedItem.brandId}`,
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

  const handleSelectionConfirmed = (addressId: number, carId: number) => {
    setSelectedAddressId(addressId);
    setSelectedCarId(carId);
    setSelectionConfirmed(true);
  };

  const handlePayment = async () => {
    if (!selectedInvoiceId) {
      toast.error(t("selectItemFirst"));
      return;
    }

    if (!selectedSlotId) {
      toast.error(t("pleaseSelectTimeSlot"));
      return;
    }

    if (!selectedAddressId || !selectedCarId) {
      toast.error(t("pleaseSelectAddressAndCar"));
      return;
    }

    setIsProcessingPayment(true);

    try {
      const response = await axios.post(
        apiEndpoints.makePayment,
        {
          paymentMethodId: 2,
          invoiceId: selectedInvoiceId,
          slotId: selectedSlotId,
          discountCode: discountCode || null,
          userAddress: selectedAddressId,
          userCar: selectedCarId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        // Clear the stored IDs after successful payment
        localStorage.removeItem("selectedSlotId");
        localStorage.removeItem("selectedInvoiceId");

        if (response.data.content?.redirect_url) {
          window.location.href = response.data.content.redirect_url;
        } else {
          toast.success(t("paymentSuccessful"));
          getCart();
          setDiscountAmount(0);
          setDiscountType(null);
          setDiscountCode("");
          navigate("/orders");
        }
      } else {
        toast.error(t("paymentFailed"));
      }
    } catch (error) {
      toast.error(t("paymentFailed"));
      console.error("Payment error:", error);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">{t("yourCart")}</h1>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {cart && cart.length ? (
          cart.map((item) => (
            <CartCard
              key={item.invoiceId}
              item={item}
              isSelected={selectedInvoiceId === item.invoiceId}
              onSelect={handleSelectItem}
              disabled={
                selectedInvoiceId !== null &&
                selectedInvoiceId !== item.invoiceId
              }
              slotId={selectedSlotId}
              onDelete={(invoiceId: number, itemId: number) => {
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
                    if (selectedInvoiceId === invoiceId) {
                      setSelectedInvoiceId(null);
                      localStorage.removeItem("selectedInvoiceId");
                      setSelectedSlotId(null);
                      localStorage.removeItem("selectedSlotId");
                    }
                  })
                  .catch((err) => console.error("Error deleting item:", err));
              }}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">{t("cartEmpty")}</p>
          </div>
        )}
      </div>

      {/* Checkout Section - Only show if an item is selected */}
      {selectedInvoiceId && selectedItem && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold mb-6">{t("checkout")}</h2>

          {/* Selected Time Slot */}
          {selectedSlotId && (
            <div className="mb-6 p-4 bg-primary/5 rounded-lg">
              <h3 className="text-lg font-medium mb-2">
                {t("selectedTimeSlot")}
              </h3>
              {loadingTimeSlot ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>{t("loading")}</span>
                </div>
              ) : timeSlotDetails ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-medium">{timeSlotDetails.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span dir="ltr">
                      {timeSlotDetails.timeFrom.slice(0, 5)} -{" "}
                      {timeSlotDetails.timeTo.slice(0, 5)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-sm">{t("timeSlotSelected")}</p>
              )}
            </div>
          )}

          {/* Address and Car Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{t("deliveryDetails")}</h3>
            <SelectionCard onSelectionConfirmed={handleSelectionConfirmed} />
          </div>

          {/* Discount Input */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">{t("discountCode")}</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t("enterDiscountCode")}
                className="flex-1 border p-2 rounded-lg"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                disabled={isProcessingPayment}
              />
              <button
                onClick={handleApplyDiscount}
                disabled={isProcessingPayment}
                className="px-4 py-2 bg-primary text-white rounded-lg disabled:bg-gray-300"
              >
                {t("apply")}
              </button>
            </div>
          </div>

          {/* Price Summary */}
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

          {/* Confirm Booking Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handlePayment}
              disabled={
                !selectionConfirmed || isProcessingPayment || !selectedSlotId
              }
              className={`px-6 py-2 text-white font-semibold rounded-lg ${
                !selectionConfirmed || isProcessingPayment || !selectedSlotId
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isProcessingPayment ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("processing")}
                </div>
              ) : (
                t("confirmBooking")
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
