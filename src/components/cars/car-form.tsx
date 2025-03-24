import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import ColorSelector from "./color-selector";
import type { CarBrand, CarModel, Car, CarFormData } from "@/interfaces";

interface CarFormProps {
  onSubmit: (data: CarFormData) => Promise<void>;
  editingCar: Car | null;
  onEdit: (carId: number, data: CarFormData) => Promise<void>;
  onCancelEdit: () => void;
}

const CarForm = ({
  onSubmit,
  editingCar,
  onEdit,
  onCancelEdit,
}: CarFormProps) => {
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
      carModel: "",
      carColor: "#000000", // Default black
      carPlateNo: "",
    },
  });

  const selectedBrandId = watch("carBrandId");
  const selectedColor = watch("carColor");

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

  // Set form values when editing a car
  useEffect(() => {
    if (editingCar) {
      setValue("carBrandId", editingCar.carBrandId || 0);
      setValue("carModelId", editingCar.carModelId || 0);
      setValue("carModel", editingCar.carModel || "");
      setValue("carColor", editingCar.carColor || "#000000");
      setValue("carPlateNo", editingCar.carPlateNo || "");
    } else {
      reset({
        carBrandId: 0,
        carModelId: 0,
        carModel: "",
        carColor: "#000000",
        carPlateNo: "",
      });
    }
  }, [editingCar, setValue, reset]);

  const handleFormSubmit = async (data: CarFormData) => {
    setLoading(true);
    try {
      if (editingCar) {
        await onEdit(editingCar.carId, data);
      } else {
        await onSubmit(data);
        reset();
      }
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
                  setValue("carModelId", 0); // Reset model when brand changes
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
                onChange={(e) => {
                  const modelId = Number(e.target.value);
                  field.onChange(modelId);

                  // Set the model name based on the selected ID
                  const selectedModel = carModels.find(
                    (model) => model.carModelId === modelId
                  );
                  if (selectedModel) {
                    setValue(
                      "carModel",
                      currentLang === "ar"
                        ? selectedModel.modelAr
                        : selectedModel.modelEn
                    );
                  }
                }}
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
        <ColorSelector
          selectedColor={selectedColor}
          onChange={(color) => setValue("carColor", color)}
        />
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
        {editingCar ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-4 py-2 border rounded-lg"
              disabled={loading}
            >
              {t("cancel")}
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg"
              disabled={loading}
            >
              {loading ? t("saving") : t("save")}
            </button>
          </div>
        ) : (
          <button
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? t("adding") : t("add")}
          </button>
        )}
      </div>
    </form>
  );
};

export default CarForm;
