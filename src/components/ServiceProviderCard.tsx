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
      className="flex flex-col max-w-md justify-center items-center self-center hover:cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg"
      onClick={toSp}
    >
      <div className="rounded-lg ">
        <img
          src={
            freelancer?.brandLogo === null
              ? ServiceProviderImage
              : `http://161.97.122.116${freelancer.brandLogo}`
          }
          className="w-full h-full"
          alt="service provider image"
        />
      </div>
      <div className="pt-5 px-3 w-full">
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
          <p className="min-h-20">
            {i18n.language === "en"
              ? freelancer.brandDescriptionsEn || t("noDescription")
              : freelancer.brandDescriptionsAr || t("noDescription")}
          </p>
          <p className="text-2xl pt-3 border-stone-900 border-b-2 w-fit">
            {t("viewServices")}
          </p>
        </div>
      </div>
    </main>
  );
};

export default ServiceProviderCard;
