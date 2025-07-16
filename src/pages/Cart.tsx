import type React from "react";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import CartCard from "@/components/cart/cart-card";
import CheckoutSummary from "@/components/cart/checkout-summary";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { toast } from "react-toastify";
import SelectionCard from "@/components/cart/selection-card";
import { Loader2, ShoppingCart } from "lucide-react";
import CartTimeSlotSection from "@/components/cart/cart-time-slot-section";
import TermsAndConditionsModal from "@/components/cart/terms-and-conditions-modal";
import LoadingIndicator from "@/components/ui/loading-indicator";
import CompleteProfileModal from "@/components/profile/complete-profile-modal";

// @ts-ignore
interface Window {
  ApplePaySession?: any;
}

const Cart = () => {
  const { cart, getCart, token, user } = useUser();
  const { t } = useTranslation();
  const {
    selectedInvoiceId,
    selectedSlotId,
    discountCode,
    discountAmount,
    discountType,
    selectionConfirmed,
    isProcessingPayment,
    selectItem,
    selectAddressAndCar,
    setDiscountCode,
    applyDiscount,
    processPayment,
    resetSelection,
    selectedItem,
  } = useCart();

  const [termsAgreed, setTermsAgreed] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState(2); // 2 = Card, 3 = Apple Pay
  const [applePaySupported, setApplePaySupported] = useState(true);
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
  const isProfileIncomplete = !user?.email || (!user?.nameEn && !user?.nameAr);

  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    if (user && (!user.email || (!user.nameEn && !user.nameAr))) {
      setShowProfileModal(true);
    }
  }, [user]);

  // Detect Apple Pay support
  useEffect(() => {
    const isApplePayCapable = () => {
      // Check for ApplePaySession and canMakePayments
      // Also check for Safari/iOS/macOS user agent for extra safety
      const isAppleDevice =
        /Mac|iPhone|iPod|iPad/.test(navigator.platform) ||
        (/AppleWebKit/.test(navigator.userAgent) &&
          /Mobile\//.test(navigator.userAgent));
      return (
        typeof window !== "undefined" &&
        (window as any).ApplePaySession &&
        (window as any).ApplePaySession.canMakePayments &&
        (window as any).ApplePaySession.canMakePayments() &&
        isAppleDevice
      );
    };
    setApplePaySupported(isApplePayCapable());
  }, []);

  const handleSelectionConfirmed = (addressId: number, carId: number) => {
    selectAddressAndCar(addressId, carId);
  };

  const handleDeleteCartItem = async (invoiceId: number, itemId: number) => {
    try {
      const response = await axios.delete(
        `${apiEndpoints.deleteFromCart}?invoiceId=${invoiceId}&itemId=${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        await getCart();
        toast.success(t("itemRemoved"));

        // If the deleted item was selected, reset selection
        if (selectedInvoiceId === invoiceId) {
          resetSelection();
        }
      } else {
        toast.error(t("errorRemovingItem"));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error(t("errorRemovingItem"));
    }
  };

  const openTermsModal = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsTermsModalOpen(true);
  };

  useEffect(() => {
    if (isProcessingPayment) {
      setPaymentLoading(true);
    } else {
      setTimeout(() => {
        setPaymentLoading(false);
      }, 2500);
    }
  }, [isProcessingPayment]);
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <CompleteProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      {paymentLoading ? (
        <div className="min-h-screen flex justify-center items-center">
          <LoadingIndicator message={t("loading")} />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">{t("yourCart")}</h1>
          </div>

          <div className="space-y-4 mb-8">
            {cart && cart.length ? (
              cart.map((item) => (
                <CartCard
                  key={item.invoiceId}
                  item={item}
                  isSelected={selectedInvoiceId === item.invoiceId}
                  onSelect={selectItem}
                  onDelete={handleDeleteCartItem}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">{t("cartEmpty")}</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Checkout Section - Only show if an item is selected */}
      {selectedInvoiceId && selectedItem && !paymentLoading && (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mt-6">
          <h2 className="text-xl font-semibold mb-6">{t("checkout")}</h2>

          {/* Time Slot Selection */}
          {selectedItem && (
            <CartTimeSlotSection brandId={selectedItem.brandId} />
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
                onClick={applyDiscount}
                disabled={isProcessingPayment}
                className="px-4 py-2 bg-primary text-white rounded-lg disabled:bg-gray-300"
              >
                {t("apply")}
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <CheckoutSummary
            subtotal={subtotal}
            discountAmount={discountAmount}
            discountType={discountType}
            discountValue={discountValue}
            finalTotal={finalTotal}
          />

          {/* Payment Method Selection */}
          {/* {applePaySupported && ( */}
          <>
            {console.log("Apple Pay Supported, rendering radio buttons")}
            <div className="my-6">
              <h3 className="text-lg font-medium mb-4">{t("paymentMethod")}</h3>
              <div className="flex gap-4 flex-col sm:flex-row">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={2}
                    checked={paymentMethodId === 2}
                    onChange={() => setPaymentMethodId(2)}
                  />
                  {t("payByCard")}
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={3}
                    checked={paymentMethodId === 3}
                    onChange={() => setPaymentMethodId(3)}
                  />
                  {t("payByApplePay")}
                </label>
              </div>
            </div>
          </>
          {/* // )} */}

          {/* Terms and Conditions Checkbox */}
          <div className="mt-6 flex items-start gap-2">
            <input
              type="checkbox"
              id="terms-checkbox"
              checked={termsAgreed}
              onChange={(e) => setTermsAgreed(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="terms-checkbox" className="text-sm">
              {t("agreeToTerms")}{" "}
              <a
                href="#"
                onClick={openTermsModal}
                className="text-primary hover:underline"
              >
                {t("termsAndConditions")}
              </a>
            </label>
          </div>

          {/* Confirm Booking Button */}
          <div className="mt-6 flex justify-start">
            <button
              onClick={(e) => {
                e.currentTarget.disabled = true;
                processPayment(paymentMethodId);
              }}
              disabled={
                isProfileIncomplete ||
                !selectionConfirmed ||
                isProcessingPayment ||
                !selectedSlotId ||
                !termsAgreed
              }
              className={`px-6 py-2 text-white font-semibold rounded-lg ${
                !selectionConfirmed ||
                isProcessingPayment ||
                !selectedSlotId ||
                !termsAgreed
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

      {/* Terms and Conditions Modal */}
      <TermsAndConditionsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
};

export default Cart;
