import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { MapPin } from "lucide-react";
import type { City, District, AddressFormData } from "@/interfaces";

interface AddressFormProps {
  initialData?: AddressFormData;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
}

const AddressForm = ({ initialData, onSubmit, onCancel }: AddressFormProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: initialData || {
      addressTitle: "",
      cityId: 0,
      districtId: 0,
      latitude: "",
      longitude: "",
    },
  });

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
      (error) => {
        console.log(error);
        toast.error(t("locationFailed"));
        setLoadingLocation(false);
      }
    );
  };

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(apiEndpoints.getCities);
        if (response.data.success) setCities(response.data.content);
      } catch (error) {
        toast.error(t("failedToLoadCities"));
      }
    };
    fetchCities();
  }, [t]);

  // Fetch districts when city changes
  useEffect(() => {
    if (selectedCityId) {
      const fetchDistricts = async () => {
        try {
          const response = await axios.get(
            apiEndpoints.getDistrict(selectedCityId)
          );
          if (response.data.success) {
            setDistricts(response.data.content);
          }
        } catch (error) {
          toast.error(t("failedToLoadDistricts"));
        }
      };

      fetchDistricts();
    }
  }, [selectedCityId, t]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
      {/* Address Title */}
      <div className="col-span-2">
        <label className="block mb-2 text-gray-700">{t("addressTitle")}</label>
        <input
          {...register("addressTitle", { required: t("addressTitleRequired") })}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder={t("addressTitlePlaceholder")}
        />
        {errors.addressTitle && (
          <p className="text-red-500 text-sm">{errors.addressTitle.message}</p>
        )}
      </div>

      {/* City Dropdown */}
      <div>
        <label className="block mb-2 text-gray-700">{t("city")}</label>
        <Controller
          name="cityId"
          control={control}
          rules={{ required: t("cityRequired") }}
          render={({ field }) => (
            <select {...field} className="w-full px-4 py-2 border rounded-lg">
              <option value="">{t("selectCity")}</option>
              {cities.map((city) => (
                <option key={city.cityId} value={city.cityId}>
                  {currentLang === "ar"
                    ? city.cityNameAr
                    : city.cityNameEn || city.cityNameAr}
                </option>
              ))}
            </select>
          )}
        />
        {errors.cityId && (
          <p className="text-red-500 text-sm">
            {typeof errors.cityId.message === "string"
              ? errors.cityId.message
              : t("unknown")}
          </p>
        )}
      </div>

      {/* District Dropdown */}
      <div>
        <label className="block mb-2 text-gray-700">{t("district")}</label>
        <Controller
          name="districtId"
          control={control}
          rules={{ required: t("districtRequired") }}
          render={({ field }) => (
            <select
              {...field}
              className="w-full px-4 py-2 border rounded-lg max-h-48 overflow-y-auto"
            >
              <option value="">{t("selectDistrict")}</option>
              {districts.map((district) => (
                <option key={district.districtId} value={district.districtId}>
                  {currentLang === "ar"
                    ? district.districtNameAr
                    : district.districtNameEn || district.districtNameAr}
                </option>
              ))}
            </select>
          )}
        />
        {errors.districtId && (
          <p className="text-red-500 text-sm">
            {typeof errors.districtId.message === "string"
              ? errors.districtId.message
              : t("unknown")}
          </p>
        )}
      </div>
      {/* Coordinates */}
      <div className="col-span-2 grid grid-cols-3 gap-2">
        {/* Fetch Location Button */}
        <button
          type="button"
          className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
          onClick={handleGetLocation}
          disabled={loadingLocation}
        >
          {loadingLocation ? t("determiningLocation") : <MapPin size={20} />}
        </button>

        {/* Latitude Input */}
        <div>
          <input
            {...register("latitude", {
              required: t("locationRequired"),
            })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder={t("latitude")}
          />
          {errors.latitude && (
            <p className="text-red-500 text-sm">
              {typeof errors.latitude.message === "string"
                ? errors.latitude.message
                : t("unknown")}
            </p>
          )}
        </div>

        {/* Longitude Input */}
        <div>
          <input
            {...register("longitude", {
              required: t("locationRequired"),
            })}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder={t("longitude")}
          />
          {errors.longitude && (
            <p className="text-red-500 text-sm">
              {typeof errors.longitude.message === "string"
                ? errors.longitude.message
                : t("unknown")}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="col-span-2 flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded-lg"
        >
          {t("cancel")}
        </button>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-lg"
        >
          {t("save")}
        </button>
      </div>
    </form>
  );
};

export default AddressForm;
