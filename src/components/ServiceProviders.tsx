import { useTranslation } from "react-i18next";
import ServiceProviderCard from "./ServiceProviderCard";

const ServiceProviders = () => {
  const { t } = useTranslation();
  return (
    <main className="py-20 flex flex-col items-center">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl lg:text-4xl text-primary font-bold">
          {t("serviceProviders")}
        </h1>
      </div>
      <div className="grid gap-10 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-20 px-5">
        <ServiceProviderCard />
        <ServiceProviderCard />
        <ServiceProviderCard />
      </div>
      <div className="py-10">
        <button className="px-5 py-2 text-xl text-primary border-primary border-2 rounded-2xl duration-300 transition hover:bg-stone-200/50">
          استكشاف المزيد
        </button>
      </div>
    </main>
  );
};

export default ServiceProviders;
