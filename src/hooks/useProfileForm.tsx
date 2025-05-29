import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { fetchCities, fetchDistricts } from "@/services/locationService";
import type { City, District } from "@/interfaces";

export const useProfileForm = (user: any) => {
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const { t } = useTranslation();

  const formMethods = useForm({
    defaultValues: {
      email: user?.email || "",
      name: user?.nameEn || "",
      cityId: user?.userAddressDto?.cityId?.toString() || "",
      districtId: user?.userAddressDto?.districtId?.toString() || "",
      latitude: user?.userAddressDto?.latitude || "",
      longitude: user?.userAddressDto?.longitude || "",
    },
  });

  const { setValue, watch } = formMethods;
  const selectedCityId = watch("cityId");

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error(t("browserDoesNotSupportGeolocation"));
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setValue("latitude", latitude.toString());
        setValue("longitude", longitude.toString());
        toast.success(t("locationDetermined"));
        setLoadingLocation(false);
      },
      (_) => {
        toast.error(t("locationFailed"));
        setLoadingLocation(false);
      }
    );
  };

  // Initialize form with user data when available
  useEffect(() => {
    if (user) {
      setValue("email", user.email);
      setValue("name", user.nameEn);
      setValue("cityId", user.userAddressDto?.cityId?.toString() || "");
      setValue("districtId", user.userAddressDto?.districtId?.toString() || "");
      setValue("latitude", user.userAddressDto?.latitude || "");
      setValue("longitude", user.userAddressDto?.longitude || "");
      setLoading(false);
    }
  }, [user, setValue]);

  // Fetch cities on component mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await fetchCities();
        setCities(citiesData);
      } catch (error) {
        toast.error(t("failedToLoadCities"));
      }
    };
    loadCities();
  }, [t]);

  // Fetch districts when city changes
  useEffect(() => {
    if (selectedCityId) {
      const loadDistricts = async () => {
        try {
          const districtsData = await fetchDistricts(selectedCityId);
          setDistricts(districtsData);
        } catch (error) {
          toast.error(t("failedToLoadDistricts"));
        }
      };

      loadDistricts();
    }
  }, [selectedCityId, t]);

  return {
    formMethods,
    loading,
    cities,
    districts,
    loadingLocation,
    handleGetLocation,
  };
};
