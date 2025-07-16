import ServiceProviderImage from "@/assets/images/service-provider.png";
import { useTranslation } from "react-i18next";
import { FaStar } from "react-icons/fa";
import { Freelancer } from "@/interfaces";
import { useNavigate } from "react-router-dom";

interface ServiceProviderCardProps {
  freelancer: Freelancer;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({
  freelancer,
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toSp = () => {
    navigate(`/service-provider/${freelancer.brandId}`);
  };
  return (
    <main
      className="flex flex-col w-full max-w-xs min-h-[420px] h-full justify-between items-center relative self-center hover:cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg bg-white"
      onClick={toSp}
    >
      <div className="rounded-lg w-full aspect-[4/3] overflow-hidden flex items-center justify-center bg-gray-100">
        <img
          src={
            freelancer?.brandLogo === null
              ? ServiceProviderImage
              : `http://161.97.122.116${freelancer.brandLogo}`
          }
          className="object-cover w-full h-full"
          alt="service provider image"
        />
      </div>
      <div className="pt-5 px-3 w-full flex-1 flex flex-col justify-between">
        <div className="flex justify-between ">
          <h1 className="xl:text-2xl font-semibold sm:text-xl text-2xl max-sm:text-xl">
            {i18n.language === "en"
              ? freelancer.brandNameEn
              : freelancer.brandNameAr}
          </h1>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl font-[500] max-sm:text-lg">
              {freelancer.avgAppraisal}
            </span>
            <FaStar color="#fdca01" className="text-2xl max-sm:text-xl" />
          </div>
        </div>
        <div className="py-5 text-stone-800 font-[500] text-[16px] ">
          <p className="min-h-20 line-clamp-2 break-words">
            {i18n.language === "en"
              ? freelancer.brandDescriptionsEn || t("noDescription")
              : freelancer.brandDescriptionsAr || t("noDescription")}
          </p>
          <p className="text-2xl pt-3 border-stone-900 border-b-2 w-fit">
            {t("viewServices")}
          </p>
        </div>
      </div>
      <div
        className={`absolute top-2 ${
          i18n.language === "ar" ? "right-2" : "left-2"
        } flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-800 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg`}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
        </svg>
        {i18n.language === "ar" ? freelancer.cityNameAr : freelancer.cityNameEn}
      </div>
    </main>
  );
};

export default ServiceProviderCard;
