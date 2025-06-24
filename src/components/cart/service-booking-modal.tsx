import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import { useCart } from "@/context/CartContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { Service } from "@/interfaces";
import { Button } from "@/components/ui/button";

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service;
  onSuccess: () => void;
}

const ServiceBookingModal = ({
  isOpen,
  onClose,
  service,
  onSuccess,
}: ServiceBookingModalProps) => {
  const { t, i18n } = useTranslation();
  const { token } = useUser();
  const { addToCart } = useCart();
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = service.servicesPrice || 0;
    const extrasTotal = selectedExtras.reduce((sum, extraId) => {
      const extra = service.extraServices?.find((e) => e.id === extraId);
      return sum + (extra?.extraPrice || 0);
    }, 0);
    return basePrice + extrasTotal;
  };

  const handleExtraServiceToggle = (id: number) => {
    setSelectedExtras((prev) =>
      prev.includes(id)
        ? prev.filter((extraId) => extraId !== id)
        : [...prev, id]
    );
  };

  const handleAddToCart = async () => {
    if (!token) return;

    setIsSubmitting(true);
    try {
      // Add to cart without time slot
      const success = await addToCart(
        Number(service.serviceId),
        selectedExtras
      );

      if (success) {
        toast.success(t("serviceAddedToCart"));
        onSuccess();
      } else {
        throw new Error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(t("errorAddingToCart"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {i18n.language === "ar"
              ? service.servicesNameAr
              : service.servicesNameEn}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t("selectExtras")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Extra Services */}
          <div className="space-y-4">
            {service.extraServices && service.extraServices.length > 0 ? (
              service.extraServices.map((extra) => (
                <div
                  key={extra.id}
                  className={`rounded-xl border p-4 transition-all ${
                    selectedExtras.includes(extra.id)
                      ? "border-primary bg-primary/5"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <label className="flex cursor-pointer items-start space-x-4">
                    <div className="flex h-5 items-center">
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra.id)}
                        onChange={() => handleExtraServiceToggle(extra.id)}
                        className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">
                          {i18n.language === "ar"
                            ? extra.extraNameAr
                            : extra.extraNameEn}
                        </span>
                        <span className="font-semibold text-primary">
                          +{extra.extraPrice} {t("SAR")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {i18n.language === "ar"
                          ? extra.extraDescriptionsAr
                          : extra.extraDescriptionsEn}
                      </p>
                    </div>
                  </label>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                {t("noExtrasAvailable")}
              </p>
            )}
          </div>

          {/* Price Summary */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">{t("total")}</span>
              <span className="text-xl font-bold text-primary">
                {calculateTotalPrice()} {t("SAR")}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              {t("cancel")}
            </Button>
            <Button onClick={handleAddToCart} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                t("addToCart")
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceBookingModal;
