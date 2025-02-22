import { FaStar } from "react-icons/fa";
import { Service } from "@/interfaces";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const handleBooking = () => {
    const token = sessionStorage.getItem("accessToken");
    if (token) {
      navigate("/cart");
    } else {
      navigate("/register");
      toast.info("You have to log in first");
    }
  };
  return (
    <div className="max-w-3xl rounded-lg border my-8 min-h-32 border-gray-200 bg-white p-4 drop-shadow-xl shadow-2xl flex justify-between">
      <div className="flex flex-col">
        <div className="flex gap-3">
          <h1 className="text-2xl text-primary font-[500]">
            {i18n.language === "ar"
              ? service?.servicesNameAr
              : service?.servicesNameEn}
          </h1>
          <div className="flex items-center gap-1">
            <span className="text-lg font-[500]">
              {service.avgAppraisal || 4.5}
            </span>
            <FaStar className="text-xl" color="#fdca01" />
          </div>
        </div>
        <p className="text-neutral-600 font-[500] pt-3">
          {i18n.language === "ar"
            ? service?.servicesDescriptionsAr
            : service?.servicesDescriptionsEn}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="flex gap-3">
          <span className="text-primary font-[500]">{t("price")}</span>
          <span>
            {service.servicesPrice} {t("SAR")}
          </span>
        </p>
        <button
          onClick={handleBooking}
          className="bg-primary px-10 py-1.5 rounded-xl text-white"
        >
          {t("bookNow")}
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
