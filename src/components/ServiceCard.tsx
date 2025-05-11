"use client";

import { useState } from "react";
import type { Service } from "@/interfaces";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import ServiceBookingModal from "@/components/cart/service-booking-modal";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard = ({ service }: ServiceCardProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useUser();

  const handleBooking = () => {
    if (!token) {
      navigate("/register");
      toast.info(t("youMustLogin"));
      return;
    }
    setIsModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setIsModalOpen(false);
    navigate("/cart"); // Navigate to cart page
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

      {/* Booking Modal */}
      {isModalOpen && (
        <ServiceBookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          service={service}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default ServiceCard;
