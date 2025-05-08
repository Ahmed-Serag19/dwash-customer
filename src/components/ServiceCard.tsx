import type React from "react";
import { useState, useEffect } from "react";
import type { Service, TimeSlot } from "@/interfaces";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { useUser } from "@/context/UserContext";
import ServiceCardModal from "@/components/ServiceCardModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Calendar, Clock, Check, ChevronRight } from "lucide-react";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState("extras");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = sessionStorage.getItem("accessToken");
  const { getCart } = useUser();

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

  const handleSlotSelection = (slotId: number) => {
    setSelectedSlot(slotId);
  };

  // Fetch time slots when tab changes to timeslots
  useEffect(() => {
    if (activeTab === "timeslots" && token && service.brandId) {
      setSlotsLoading(true);
      axios
        .get(`${apiEndpoints.getSlots}?brandId=${service.brandId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data.success) {
            setTimeSlots(response.data.content || []);
          } else {
            toast.error(t("errorFetchingSlots"));
          }
        })
        .catch((error) => {
          console.error("Error fetching slots:", error);
          toast.error(t("errorFetchingSlots"));
        })
        .finally(() => {
          setSlotsLoading(false);
        });
    }
  }, [activeTab, service.brandId, token, t]);

  const handleBooking = () => {
    if (!token) {
      navigate("/register");
      toast.info(t("youMustLogin"));
      return;
    }
    setIsModalOpen(true);
  };

  const handleContinue = () => {
    if (activeTab === "extras") {
      setActiveTab("timeslots");
    } else if (activeTab === "timeslots") {
      handleAddToCartWithTimeSlot();
    }
  };

  const handleAddToCartWithTimeSlot = async () => {
    if (!token || (activeTab === "timeslots" && !selectedSlot)) return;

    setIsSubmitting(true);
    try {
      // Step 1: Add to cart - same as your working version
      const cartResponse = await axios.post(
        apiEndpoints.addToCart,
        {
          serviceId: Number(service.serviceId),
          extraServices: selectedExtras.length > 0 ? selectedExtras : [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (cartResponse.data.success) {
        // Store timeslot if selected (new feature)
        if (activeTab === "timeslots" && selectedSlot) {
          localStorage.setItem("selectedSlotId", selectedSlot.toString());

          // If your API returns invoiceId, use it (otherwise remove this part)
          if (cartResponse.data.content?.invoiceId) {
            localStorage.setItem(
              "selectedInvoiceId",
              cartResponse.data.content.invoiceId.toString()
            );
          }
        }

        // Refresh cart - same as your working version
        await getCart(); // This updates the cart in your context

        toast.success(t("serviceAddedToCart"));
        setIsModalOpen(false);
        navigate("/cart");
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
    <div className="w-full rounded-xl bg-white p-6 shadow-xl shadow-stone-200 transition-all hover:shadow-xl hover:shadow-blue-100 duration-300">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        {/* Service Info */}
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-900">
            {i18n.language === "ar"
              ? service.servicesNameAr
              : service.servicesNameEn}
          </h3>
          <p className="text-gray-600">
            {i18n.language === "ar"
              ? service.servicesDescriptionsAr
              : service.servicesDescriptionsEn}
          </p>
        </div>

        {/* Price and Action */}
        <div className="flex flex-col items-end space-y-3">
          <div className="text-right">
            <p className="text-sm text-gray-500">{t("price")}</p>
            <p className="text-2xl font-bold text-primary">
              {service.servicesPrice}{" "}
              <span className="text-lg">{t("SAR")}</span>
            </p>
          </div>
          <button
            onClick={handleBooking}
            className="w-full rounded-lg bg-gradient-to-r from-primary to-blue-500 px-6 py-2.5 font-medium text-white transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 md:w-auto"
          >
            {t("bookNow")}
          </button>
        </div>
      </div>

      {/* Modal */}
      <ServiceCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            {i18n.language === "ar"
              ? service.servicesNameAr
              : service.servicesNameEn}
          </h2>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="extras" disabled={isSubmitting}>
                <div className="flex items-center gap-2">
                  {activeTab === "extras" ? (
                    <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                      1
                    </div>
                  ) : (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                  {t("selectExtras")}
                </div>
              </TabsTrigger>
              <TabsTrigger value="timeslots" disabled={isSubmitting}>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
                    2
                  </div>
                  {t("selectTimeSlot")}
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="extras" className="space-y-4">
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
            </TabsContent>

            <TabsContent value="timeslots" className="space-y-4">
              {slotsLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">{t("loadingTimeSlots")}</span>
                </div>
              ) : timeSlots.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.slotId}
                      onClick={() => handleSlotSelection(slot.slotId)}
                      className={`flex flex-col p-4 rounded-lg border transition-all ${
                        selectedSlot === slot.slotId
                          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span className="font-medium">{slot.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span dir="ltr">
                          {slot.timeFrom.slice(0, 5)} -{" "}
                          {slot.timeTo.slice(0, 5)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t("noAvailableSlots")}</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

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
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleContinue}
              disabled={
                (activeTab === "timeslots" && !selectedSlot) || isSubmitting
              }
              className={`px-6 py-2 rounded-lg font-medium text-white flex items-center ${
                (activeTab === "timeslots" && !selectedSlot) || isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </>
              ) : activeTab === "extras" ? (
                <>
                  {t("confirm")}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                t("addToCart")
              )}
            </button>
          </div>
        </div>
      </ServiceCardModal>
    </div>
  );
};

export default ServiceCard;
