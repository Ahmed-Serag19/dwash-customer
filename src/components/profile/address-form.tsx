import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Loader2 } from "lucide-react";
import type { City, District, AddressFormData } from "@/interfaces";

interface AddressFormProps {
  initialData?: AddressFormData;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const AddressForm = ({
  initialData,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AddressFormProps) => {
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
      (_) => {
        // console.log(error);
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
      {/* Address Title */}
      <div className="space-y-2">
        <Label htmlFor="addressTitle" className="text-base">
          {t("addressTitle")}
        </Label>
        <Input
          id="addressTitle"
          {...register("addressTitle", { required: t("addressTitleRequired") })}
          className="h-11"
          placeholder={t("addressTitlePlaceholder")}
          disabled={isSubmitting}
        />
        {errors.addressTitle && (
          <p className="text-destructive text-sm">
            {errors.addressTitle.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* City Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="cityId" className="text-base">
            {t("city")}
          </Label>
          <Controller
            name="cityId"
            control={control}
            rules={{ required: t("cityRequired") }}
            render={({ field }) => (
              <Select
                disabled={isSubmitting}
                value={field.value ? field.value.toString() : ""}
                onValueChange={(value: any) => {
                  field.onChange(Number(value));
                  setValue("districtId", 0);
                }}
              >
                <SelectTrigger id="cityId" className="h-11">
                  <SelectValue placeholder={t("selectCity")} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem
                      key={city.cityId}
                      value={city.cityId.toString()}
                    >
                      {currentLang === "ar"
                        ? city.cityNameAr
                        : city.cityNameEn || city.cityNameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.cityId && (
            <p className="text-destructive text-sm">
              {typeof errors.cityId.message === "string"
                ? errors.cityId.message
                : t("unknown")}
            </p>
          )}
        </div>

        {/* District Dropdown */}
        <div className="space-y-2">
          <Label htmlFor="districtId" className="text-base">
            {t("district")}
          </Label>
          <Controller
            name="districtId"
            control={control}
            rules={{ required: t("districtRequired") }}
            render={({ field }) => (
              <Select
                disabled={isSubmitting || !selectedCityId}
                value={field.value ? field.value.toString() : ""}
                onValueChange={(value: any) => field.onChange(Number(value))}
              >
                <SelectTrigger id="districtId" className="h-11">
                  <SelectValue placeholder={t("selectDistrict")} />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {districts.map((district) => (
                    <SelectItem
                      key={district.districtId}
                      value={district.districtId.toString()}
                    >
                      {currentLang === "ar"
                        ? district.districtNameAr
                        : district.districtNameEn || district.districtNameAr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.districtId && (
            <p className="text-destructive text-sm">
              {typeof errors.districtId.message === "string"
                ? errors.districtId.message
                : t("unknown")}
            </p>
          )}
        </div>
      </div>

      {/* Coordinates */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-base">{t("location")}</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGetLocation}
            disabled={loadingLocation || isSubmitting}
            className="gap-2"
          >
            {loadingLocation ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {t("determiningLocation")}
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4" />
                {t("getCurrentLocation")}
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Latitude Input */}
          <div className="space-y-2">
            <Label htmlFor="latitude" className="text-sm text-muted-foreground">
              {t("latitude")}
            </Label>
            <Input
              id="latitude"
              {...register("latitude", { required: t("locationRequired") })}
              className="h-11"
              placeholder={t("latitude")}
              disabled={isSubmitting}
            />
            {errors.latitude && (
              <p className="text-destructive text-sm">
                {typeof errors.latitude.message === "string"
                  ? errors.latitude.message
                  : t("unknown")}
              </p>
            )}
          </div>

          {/* Longitude Input */}
          <div className="space-y-2">
            <Label
              htmlFor="longitude"
              className="text-sm text-muted-foreground"
            >
              {t("longitude")}
            </Label>
            <Input
              id="longitude"
              {...register("longitude", { required: t("locationRequired") })}
              className="h-11"
              placeholder={t("longitude")}
              disabled={isSubmitting}
            />
            {errors.longitude && (
              <p className="text-destructive text-sm">
                {typeof errors.longitude.message === "string"
                  ? errors.longitude.message
                  : t("unknown")}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("saving")}
            </>
          ) : (
            t("save")
          )}
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
