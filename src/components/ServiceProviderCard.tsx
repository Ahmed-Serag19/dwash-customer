import ServiceProviderImage from "@/assets/images/service-provider.png";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ServiceProviderCard = () => {
  const navigate = useNavigate();
  const toSp = () => {
    navigate("/service-provider");
  };
  return (
    <main
      className="flex flex-col rounded-md max-w-md justify-center items-center self-center hover:cursor-pointer"
      onClick={toSp}
    >
      <div className="rounded-lg ">
        <img
          src={ServiceProviderImage}
          className="w-full h-full"
          alt="service provider image"
        />
      </div>
      <div className="pt-5 px-3">
        <div className="flex justify-between">
          <h1 className="xl:text-2xl font-semibold sm:text-xl text-2xl max-sm:text-xl">
            شركة رغوة الغسيل
          </h1>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xl font-[500] max-sm:text-lg">4.5</span>
            <FaStar color="#fdca01" className="text-2xl max-sm:text-xl" />
          </div>
        </div>
        <div className="py-5 text-stone-800 font-[500] text-[16px] ">
          <p>
            تعد خدمات غسيل السيارات من الخدمات الأساسية التي يحتاجها أصحاب
            السيارات للحفاظ على نظافة ومظهر سياراتهم،
          </p>
          <p className="text-2xl pt-3 border-stone-900 border-b-2 w-fit">
            معرفة المزيد
          </p>
        </div>
      </div>
    </main>
  );
};

export default ServiceProviderCard;
