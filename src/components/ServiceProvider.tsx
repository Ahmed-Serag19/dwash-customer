import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import ServiceCard from "./ServiceCard";
import { Freelancer, Service } from "@/interfaces";
import { useTranslation } from "react-i18next";
import BgLogo from "@/assets/images/service-provider-logo.png";
import { useFreelancers } from "@/context/FreeLancersContext";

const ServiceProvider: React.FC = () => {
  const { id } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const { t, i18n } = useTranslation();
  const freelancers = useFreelancers();
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        `${apiEndpoints.getServices}?brandId=${id}&serviceTypeId=1`
      );
      setServices(response.data.content);
    } catch (error) {
      console.error("Failed to fetch services", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const freelancerFound = Array.isArray(freelancers.freelancers)
      ? freelancers.freelancers.filter(
          (freelancer) => freelancer.brandId.toString() === id
        )
      : null;
    if (freelancerFound && freelancerFound.length > 0) {
      setFreelancer(freelancerFound[0]);
    }
    console.log(freelancerFound);
  }, [id, freelancers]);
  console.log(freelancer);
  return (
    <main>
      <div className="object-cover w-full relative">
        <img src={BgLogo} alt="service provider logo" className="w-full" />
        <div className="absolute lg:top-28 lg:left-40 top-10 2xl:left-52 2xl:top-32 left-20 text-center">
          <h1 className="xl:text-4xl font-semibold md:text-3xl text-xl">
            {i18n.language === "ar"
              ? freelancer?.brandNameAr
              : freelancer?.brandNameEn}
          </h1>
          <p className="text-lg text-stone-800">
            {i18n.language === "ar"
              ? freelancer?.brandDescriptionsAr
              : freelancer?.brandDescriptionsEn}
          </p>
        </div>
      </div>
      <div className="py-10 px-10">
        {services?.length > 0 ? (
          services.map((service) => (
            <ServiceCard key={service.serviceId} service={service} />
          ))
        ) : (
          <p>{t("noServicesAvailable")}</p>
        )}
      </div>
    </main>
  );
};

export default ServiceProvider;
