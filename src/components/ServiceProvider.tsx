import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import ServiceCard from "./ServiceCard";
import { Freelancer, Service } from "@/interfaces";
import { useTranslation } from "react-i18next";
import BgLogo from "@/assets/images/service-provider-logo.png";
import { useFreelancers } from "@/context/FreeLancersContext";
import { useUser } from "@/context/UserContext";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Star } from "lucide-react";

const ServiceProvider: React.FC = () => {
  const { id } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  interface Review {
    username: string;
    appraisal: number;
    description: string;
  }

  const [reviews, setReviews] = useState<Review[]>([]);
  const { t, i18n } = useTranslation();
  const freelancers = useFreelancers();
  const [freelancer, setFreelancer] = useState<Freelancer | null>(null);
  const { token } = useUser();

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

  const fetchReviews = async () => {
    try {
      const response = await axios.get(apiEndpoints.getBrandReviews(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReviews(response.data.content.data);
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    }
  };

  useEffect(() => {
    fetchServices();

    fetchReviews();
  }, [id]);

  useEffect(() => {
    const freelancerFound = Array.isArray(freelancers.freelancers)
      ? freelancers.freelancers.filter(
          (freelancer) => freelancer.brandId.toString() === id
        )
      : null;
    if (freelancerFound && freelancerFound.length > 0) {
      setFreelancer(freelancerFound[0]);
    }
  }, [id, freelancers]);

  return (
    <main>
      <div className="object-cover w-full relative">
        <img src={BgLogo} alt="service provider logo" className="w-full" />
        <div className="md:absolute lg:top-28 lg:left-40 md:top-10 2xl:left-52 2xl:top-32 md:left-20 text-center relative mt-10 md:mt-0">
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
      <div className="py-10 px-10 relative">
        {services?.length > 0 ? (
          services.map((service) => (
            <ServiceCard key={service.serviceId} service={service} />
          ))
        ) : (
          <p>{t("noServicesAvailable")}</p>
        )}
      </div>
      <div className="py-10 px-20" dir="ltr">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
        >
          <CarouselContent className="px-5">
            {reviews.map((review, index) => (
              <CarouselItem
                key={index}
                className="basis-full md:basis-1/2"
                dir="rtl"
              >
                <div className="sm:!max-w-[350px] sm:min-w-[250px] rounded-xl shadow-sm min-h-52">
                  <div className="text-lg text-white pt-10 bg-[#0A398180] px-2 min-h-40  rounded-2xl special-top-border">
                    {review.description}
                  </div>
                  <div className="flex items-center justify-end text-lg min-h-12">
                    <div className="bg-[#0A398180] w-6/12 h-14 rounded-2xl special-border-2">
                      <span className="font-semibold opacity-0">
                        {review.username}
                      </span>
                      <div className="flex items-center gap-0.5 opacity-0">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {review.appraisal}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary min-w-40 w-6/12 bg-white py-3 px-2 special-border rounded-2xl">
                      <span className="font-semibold">{review.username}</span>
                      <div className="flex items-center gap-0.5">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {review.appraisal}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </main>
  );
};

export default ServiceProvider;
