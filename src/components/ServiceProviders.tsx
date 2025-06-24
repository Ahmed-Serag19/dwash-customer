import type React from "react";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ServiceProviderCard from "./ServiceProviderCard";
import { useFreelancers } from "@/context/FreeLancersContext";
import { toast } from "react-toastify";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { apiEndpoints } from "@/constants/endPoints";
import axios from "axios";

interface City {
  cityId: number;
  cityNameAr: string;
  cityNameEn: string;
  cityStatus: number;
}

const ServiceProviders: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { freelancers, size, increaseSize, fetchFreelancers } =
    useFreelancers();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [filteredFreelancers, setFilteredFreelancers] = useState(freelancers);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const response = await axios.get(apiEndpoints.getCities);
        const data = await response.data;
        if (data.success) {
          setCities(data.content);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        toast.error(t("errorFetchingCities") || "Error fetching cities");
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [t]);

  // Filter freelancers when selectedCity or freelancers change
  useEffect(() => {
    if (selectedCity) {
      const filtered = freelancers.filter(
        (freelancer) =>
          freelancer.cityNameEn === selectedCity.cityNameEn ||
          freelancer.cityNameAr === selectedCity.cityNameAr
      );
      setFilteredFreelancers(filtered);
    } else {
      setFilteredFreelancers(freelancers);
    }
  }, [selectedCity, freelancers]);

  const handleSeeMore = async () => {
    if (freelancers.length < 6) {
      toast.info(t("noMoreFreelancers"));
      return;
    }

    setLoading(true);
    increaseSize();
    await fetchFreelancers(size + 6);
    setLoading(false);
  };

  const handleCitySelect = (city: City) => {
    setSelectedCity(city);
    setIsDropdownOpen(false);
  };

  const clearCityFilter = () => {
    setSelectedCity(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".city-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Determine which freelancers to display and how many
  const displayedFreelancers = selectedCity ? filteredFreelancers : freelancers;
  const displayCount = Math.min(size, displayedFreelancers.length);

  return (
    <main className="py-20 flex flex-col items-center" id="services">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl lg:text-4xl text-primary font-bold">
          {t("serviceProviders")}
        </h1>
      </div>

      {/* City Dropdown */}
      <div className="w-full max-w-md mt-10 relative city-dropdown">
        <div
          className="w-full border-2 border-primary rounded-lg p-3 flex items-center justify-between cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span
            className={
              selectedCity ? "text-primary font-medium" : "text-gray-500"
            }
          >
            {selectedCity
              ? i18n.language === "en"
                ? selectedCity.cityNameEn
                : selectedCity.cityNameAr
              : t("selectCity") || "Select City"}
          </span>
          <div className="flex items-center">
            {selectedCity && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearCityFilter();
                }}
                className="text-gray-500 hover:text-primary mr-2"
              >
                <FaTimes />
              </button>
            )}
            <FaChevronDown
              className={`text-primary transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>

        {isDropdownOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {loadingCities ? (
              <div className="p-4 text-center text-gray-500">
                {t("loading") || "Loading..."}
              </div>
            ) : cities.length > 0 ? (
              <ul>
                {cities.map((city) => (
                  <li
                    key={city.cityId}
                    className={`p-3 hover:bg-gray-100 cursor-pointer transition-colors ${
                      selectedCity?.cityId === city.cityId
                        ? "bg-gray-100 font-medium"
                        : ""
                    }`}
                    onClick={() => handleCitySelect(city)}
                  >
                    {i18n.language === "en" ? city.cityNameEn : city.cityNameAr}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">
                {t("noCitiesFound") || "No cities found"}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Service Providers Grid */}
      <div className="grid gap-10 sm:gap-5 grid-cols-1 min-h-[500px] sm:grid-cols-2 lg:grid-cols-3 pt-10 px-5 w-full">
        {loading ? (
          // Loading skeleton
          Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-300 h-48 rounded-lg w-full"></div>
                <div className="mt-4 bg-gray-300 h-6 rounded w-3/4"></div>
                <div className="mt-2 bg-gray-300 h-4 rounded w-full"></div>
                <div className="mt-1 bg-gray-300 h-4 rounded w-full"></div>
                <div className="mt-1 bg-gray-300 h-4 rounded w-1/2"></div>
              </div>
            ))
        ) : displayedFreelancers.length > 0 ? (
          displayedFreelancers
            .slice(0, displayCount)
            .map((freelancer) => (
              <ServiceProviderCard
                key={freelancer.brandId}
                freelancer={freelancer}
              />
            ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-500">
              {selectedCity
                ? t("noServiceProvidersInCity") ||
                  `No service providers found in ${
                    i18n.language === "en"
                      ? selectedCity.cityNameEn
                      : selectedCity.cityNameAr
                  }`
                : t("noServiceProvidersFound") || "No service providers found"}
            </p>
            {selectedCity && (
              <button
                onClick={clearCityFilter}
                className="mt-4 px-4 py-2 text-primary border-primary border rounded-lg hover:bg-stone-100 transition"
              >
                {t("clearFilter") || "Clear filter"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* See More Button - only show if there are more freelancers to load and we're not filtering */}
      {!selectedCity &&
        displayedFreelancers.length > 0 &&
        freelancers.length > displayCount && (
          <div className="py-10">
            <button
              onClick={handleSeeMore}
              className="px-5 py-2 text-xl text-primary border-primary border-2 rounded-2xl duration-300 transition hover:bg-stone-200/50"
            >
              {loading ? t("loading") : t("seeMore")}
            </button>
          </div>
        )}
    </main>
  );
};

export default ServiceProviders;
