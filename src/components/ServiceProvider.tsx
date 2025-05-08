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
import DummyUser from "@/assets/images/dummy-user.avif";

const ServiceProvider: React.FC = () => {
  const { id } = useParams();
  const [services, setServices] = useState<Service[]>([]);
  interface Review {
    username: string;
    appraisal: number;
    description: string;
  }

  const [reviews, setReviews] = useState<Review[]>([
    {
      username: "Ahmed Al-Farsi",
      appraisal: 5,
      description:
        "خدمة رائعة! كان التواصل مع مقدم الخدمة سريعًا وسهلاً، وأدى الخدمة بجودة عالية. بالتأكيد سأعود لاستخدام الخدمة مرة أخرى.",
    },
    {
      username: "Fatima Zahran",
      appraisal: 4,
      description:
        "كانت الخدمة جيدة جدًا، لكن أعتقد أنه يمكن تحسين وقت الانتظار قليلاً. ولكن بشكل عام، كنت راضية عن التجربة.",
    },
    {
      username: "John Doe",
      appraisal: 5,
      description:
        "Excellent service! The freelancer was prompt and professional, and the results were exactly what I needed. Highly recommended!",
    },
    {
      username: "Emily Smith",
      appraisal: 4,
      description:
        "The service was great, but I felt like the response time could be a bit quicker. Overall, I’m very satisfied with the quality of work.",
    },
  ]);
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
        <img
          src={BgLogo}
          alt="service provider logo"
          className="object-cover w-full "
        />
        <div className="absolute inset-0 bg-stone-800 opacity-50"></div>

        <div className="absolute text-right top-0 right-0 left-0 bottom-0 text-white">
          <div className="absolute top-20 left-5 md:top-40 md:left-40">
            <h1 className="xl:text-4xl font-semibold md:text-3xl text-xl">
              {i18n.language === "ar"
                ? freelancer?.brandNameAr
                : freelancer?.brandNameEn}
            </h1>
            <p className="text-lg text-stone-100 font-semibold">
              {i18n.language === "ar"
                ? freelancer?.brandDescriptionsAr
                : freelancer?.brandDescriptionsEn}
            </p>
          </div>
        </div>
      </div>
      <div className="py-10 px-10 relative  grid  grid-cols-1 xl:grid-cols-2 gap-5 md:gap-8">
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
              delay: 4000,
            }),
          ]}
        >
          <CarouselContent className="px-5 py-5">
            {reviews.length > 0
              ? reviews.map((review, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-1 basis-full md:basis-1/2 "
                    dir={i18n.language === "ar" ? "rtl" : "ltr"}
                  >
                    <div className="flex flex-col h-full bg-white rounded-lg p-6 shadow-lg border border-gray-100 mx-2">
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={DummyUser}
                          alt="Profile"
                          className="w-16 h-16 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {review.username}
                          </h3>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                fill={
                                  i < review.appraisal ? "currentColor" : "none"
                                }
                                className={`h-4 w-4 ${
                                  i < review.appraisal
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600">{review.description}</p>
                    </div>
                  </CarouselItem>
                ))
              : ""}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </main>
  );
};

export default ServiceProvider;
