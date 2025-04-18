import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import ColorSelector from "./color-selector";
import type { CarBrand, CarModel } from "@/interfaces";

interface CarFormData {
  carModelId: number;
  carBrandId: number;
  carPlateNo: string;
  carColorId: number;
}

interface CarFormProps {
  onSubmit: (data: CarFormData) => Promise<void>;
}

const CarForm = ({ onSubmit }: CarFormProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [carBrands, setCarBrands] = useState<CarBrand[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CarFormData>({
    defaultValues: {
      carBrandId: 0,
      carModelId: 0,
      carColorId: 0,
      carPlateNo: "",
    },
  });

  const selectedBrandId = watch("carBrandId");

  // Fetch car brands on component mount
  useEffect(() => {
    const fetchCarBrands = async () => {
      try {
        const response = await axios.get(apiEndpoints.getCarBrands);
        if (response.data.success) {
          setCarBrands(response.data.content || []);
        }
      } catch (error) {
        console.error("Error fetching car brands:", error);
        toast.error(t("failedToLoadBrands"));
      }
    };

    fetchCarBrands();
  }, [t]);

  // Fetch car models when brand changes
  useEffect(() => {
    if (selectedBrandId && selectedBrandId > 0) {
      const fetchCarModels = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            apiEndpoints.getCarModels(selectedBrandId)
          );
          if (response.data.success) {
            setCarModels(response.data.content || []);
          }
        } catch (error) {
          console.error("Error fetching car models:", error);
          toast.error(t("failedToLoadModels"));
        } finally {
          setLoading(false);
        }
      };

      fetchCarModels();
    } else {
      setCarModels([]);
    }
  }, [selectedBrandId, t]);

  const handleFormSubmit = async (data: CarFormData) => {
    setLoading(true);
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="grid grid-cols-2 gap-x-10 gap-y-6"
    >
      {/* Car Brand */}
      <div>
        <label className="block mb-2 text-lg font-medium text-primary">
          {t("carBrand")}
        </label>
        <Controller
          name="carBrandId"
          control={control}
          rules={{ required: t("carBrandRequired") }}
          render={({ field }) => (
            <div className="relative">
              <select
                {...field}
                className="w-full px-4 py-2 border rounded-lg appearance-none pr-10"
                onChange={(e) => {
                  field.onChange(Number(e.target.value));
                  setValue("carModelId", 0);
                }}
              >
                <option value="0">{t("selectCarBrand")}</option>
                {carBrands.map((brand) => (
                  <option key={brand.carBrandId} value={brand.carBrandId}>
                    {currentLang === "ar" ? brand.brandAr : brand.brandEn}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          )}
        />
        {errors.carBrandId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.carBrandId.message}
          </p>
        )}
      </div>

      {/* Car Model */}
      <div>
        <label className="block mb-2 text-lg font-medium text-primary">
          {t("carModel")}
        </label>
        <Controller
          name="carModelId"
          control={control}
          rules={{ required: t("carModelRequired") }}
          render={({ field }) => (
            <div className="relative">
              <select
                {...field}
                className="w-full px-4 py-2 border rounded-lg appearance-none pr-10"
                onChange={(e) => field.onChange(Number(e.target.value))}
                disabled={!selectedBrandId || selectedBrandId === 0}
              >
                <option value="0">{t("selectCarModel")}</option>
                {carModels.map((model) => (
                  <option key={model.carModelId} value={model.carModelId}>
                    {currentLang === "ar" ? model.modelAr : model.modelEn}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          )}
        />
        {errors.carModelId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.carModelId.message}
          </p>
        )}
      </div>

      {/* Car Color */}
      <div>
        <label className="block mb-2 text-lg font-medium text-primary">
          {t("carColor")}
        </label>
        <Controller
          name="carColorId"
          control={control}
          rules={{ required: t("carColorRequired") }}
          render={({ field }) => (
            <ColorSelector
              selectedColorId={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.carColorId && (
          <p className="text-red-500 text-sm mt-1">
            {errors.carColorId.message}
          </p>
        )}
      </div>

      {/* Car Plate Number */}
      <div>
        <label className="block mb-2 text-lg font-medium text-primary">
          {t("carPlateNo")}
        </label>
        <input
          {...register("carPlateNo", { required: t("carPlateNoRequired") })}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder={t("carPlateNoPlaceholder")}
        />
        {errors.carPlateNo && (
          <p className="text-red-500 text-sm mt-1">
            {errors.carPlateNo.message}
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="col-span-2 flex justify-center mt-4">
        <button
          type="submit"
          className="bg-primary text-white px-6 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? t("adding") : t("add")}
        </button>
      </div>
    </form>
  );
};

export default CarForm;
