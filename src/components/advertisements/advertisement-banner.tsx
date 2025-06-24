import type React from "react";
import PlaceHolderImage from "@/assets/images/bg-image.webp";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";

interface Advertisement {
  advertisementId: number;
  advertisementTitle: string;
  advertisementDescription: string;
  advertisementStartDate: string;
  advertisementEndDate: string;
  advertisementImages: {
    imageId: number;
    imagePath: string;
    width?: number;
    height?: number;
  }[];
}

interface AdvertisementResponse {
  success: boolean;
  messageEn: string;
  messageAr: string;
  content: Advertisement[];
}

const AdvertisementBanner = () => {
  const { i18n } = useTranslation();
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get<AdvertisementResponse>(
          apiEndpoints.getAds
        );

        if (response.data.success) {
          // Filter active advertisements
          const now = new Date();
          const activeAds = response.data.content.filter((ad) => {
            const startDate = new Date(ad.advertisementStartDate);
            const endDate = new Date(ad.advertisementEndDate);
            return now >= startDate && now <= endDate;
          });
          setAdvertisements(activeAds);
        }
      } catch (error) {
        console.error("Error fetching advertisements:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvertisements();
  }, []);

  useEffect(() => {
    if (advertisements.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % advertisements.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [advertisements.length]);

  // Reset image loading state when current index changes
  useEffect(() => {
    setImageLoading(true);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % advertisements.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + advertisements.length) % advertisements.length
    );
  };

  const handleImageError = (imageSrc: string) => {
    setFailedImages((prev) => new Set(prev).add(imageSrc));
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (loading || !isVisible || advertisements.length === 0) {
    return null;
  }

  const currentAd = advertisements[currentIndex];
  const baseUrl = "http://161.97.122.116";
  const currentImageSrc = `${baseUrl}${currentAd.advertisementImages[0]?.imagePath}`;
  const hasImageFailed = failedImages.has(currentImageSrc);

  return (
    <div className="relative w-full bg-gradient-to-r from-primary/10 to-primary/5 border-y border-primary/20">
      <div className="container mx-auto px-4 py-6">
        <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
          <div className="flex flex-col xl:flex-row items-stretch min-h-[300px] md:min-h-[600px]">
            {/* Image Section - Made BIGGER (60% width) */}
            <div className="w-full xl:w-[60%] relative bg-gradient-to-br from-gray-50 to-gray-100">
              {currentAd.advertisementImages.length > 0 && (
                <div className="w-full h:64 xl:h-[600px] relative flex items-center justify-center">
                  {/* Loading skeleton */}
                  {imageLoading && !hasImageFailed && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {!hasImageFailed ? (
                    <img
                      src={currentImageSrc || PlaceHolderImage}
                      alt={currentAd.advertisementTitle}
                      className={`w-full h-full transition-opacity duration-300 object-fit lg:object-cover ${
                        imageLoading ? "opacity-0" : "opacity-100"
                      } `}
                      style={{
                        objectPosition: "center center",
                      }}
                      onError={() => handleImageError(currentImageSrc)}
                      onLoad={handleImageLoad}
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-500 p-8">
                      <svg
                        className="w-16 h-16 mb-4 text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm text-center">
                        {i18n.language === "ar"
                          ? "صورة غير متاحة"
                          : "Image unavailable"}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content Section - Made SMALLER (30% width) */}
            <div
              className="w-full xl:w-[40%] p-4 md:p-6 flex flex-col justify-center bg-white"
              dir={i18n.language === "ar" ? "rtl" : "ltr"}
            >
              <div className="space-y-3">
                <h3 className="text-lg md:text-xl font-bold text-primary leading-tight line-clamp-3">
                  {currentAd.advertisementTitle}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                  {currentAd.advertisementDescription}
                </p>

                {/* Navigation dots */}
                {advertisements.length > 1 && (
                  <div className="flex items-center justify-center md:justify-start space-x-2 rtl:space-x-reverse pt-2">
                    {advertisements.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                          index === currentIndex
                            ? "bg-primary scale-110"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                        aria-label={`Go to advertisement ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Navigation arrows */}
          {advertisements.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-200 hover:scale-110"
                aria-label="Previous advertisement"
              >
                <ChevronLeft className="w-5 h-5 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white shadow-lg rounded-full transition-all duration-200 hover:scale-110"
                aria-label="Next advertisement"
              >
                <ChevronRight className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
            aria-label="Close advertisement"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvertisementBanner;
