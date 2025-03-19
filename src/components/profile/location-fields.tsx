import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { MapPin } from "lucide-react";

interface LocationFieldsProps {
  formMethods: UseFormReturn<any>;
  loadingLocation: boolean;
  handleGetLocation: () => void;
}

const LocationFields = ({
  formMethods,
  loadingLocation,
  handleGetLocation,
}: LocationFieldsProps) => {
  const {
    register,
    formState: { errors },
  } = formMethods;
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      {/* Fetch Location Button */}
      <button
        type="button"
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg"
        onClick={handleGetLocation}
        disabled={loadingLocation}
      >
        {loadingLocation ? t("determiningLocation") : <MapPin size={20} />}
      </button>

      {/* Latitude Input */}
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

      {/* Longitude Input */}
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
  );
};

export default LocationFields;
