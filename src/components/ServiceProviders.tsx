import { useState } from "react";
import { useTranslation } from "react-i18next";
import ServiceProviderCard from "./ServiceProviderCard";
import { useFreelancers } from "@/context/FreeLancersContext";
import { toast } from "react-toastify";

const ServiceProviders: React.FC = () => {
  const { t } = useTranslation();
  const { freelancers, size, increaseSize, fetchFreelancers } =
    useFreelancers();
  const [loading, setLoading] = useState(false);

  const handleSeeMore = async () => {
    if (freelancers.length < 3) {
      toast.info(t("noMoreFreelancers"));
      return;
    }

    setLoading(true);
    increaseSize();
    await fetchFreelancers(size + 3);
    setLoading(false);
  };

  return (
    <main className="py-20 flex flex-col items-center" id="services">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl lg:text-4xl text-primary font-bold">
          {t("serviceProviders")}
        </h1>
      </div>

      <div className="grid gap-10 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-20 px-5">
        {freelancers.slice(0, size).map((freelancer) => (
          <ServiceProviderCard
            key={freelancer.brandId}
            freelancer={freelancer}
          />
        ))}
      </div>

      <div className="py-10">
        <button
          onClick={handleSeeMore}
          className="px-5 py-2 text-xl text-primary border-primary border-2 rounded-2xl duration-300 transition hover:bg-stone-200/50"
        >
          {loading ? t("loading") : t("seeMore")}
        </button>
      </div>
    </main>
  );
};

export default ServiceProviders;
