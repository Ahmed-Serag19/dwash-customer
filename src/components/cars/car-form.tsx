import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import ColorSelector from "./color-selector";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import type { CarBrand, CarModel } from "@/interfaces";

interface CarFormData {
  carModelId: number;
  carBrandId: number;
  carPlateNo: string;
  carColorId: number;
}

interface CarFormProps {
  onSubmit: (data: CarFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const CarForm = ({ onSubmit, isSubmitting = false }: CarFormProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [carBrands, setCarBrands] = useState<CarBrand[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const isRTL = currentLang === "ar";
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<CarFormData>({
    defaultValues: {
      carBrandId: 0,
      carModelId: 0,
      carColorId: 0,
      carPlateNo: "",
    },
    mode: "onChange",
  });

  const selectedBrandId = watch("carBrandId");
  const selectedModelId = watch("carModelId");
  const selectedColorId = watch("carColorId");
  const plateNo = watch("carPlateNo");

  // Check if form is complete
  const isFormComplete = Boolean(
    selectedBrandId &&
      selectedBrandId > 0 &&
      selectedModelId &&
      selectedModelId > 0 &&
      selectedColorId &&
      selectedColorId > 0 &&
      plateNo &&
      plateNo.trim() !== ""
  );

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
    const fetchCarModels = async () => {
      if (selectedBrandId && selectedBrandId > 0) {
        setIsLoadingModels(true);
        try {
          const response = await axios.get(
            apiEndpoints.getCarModels(selectedBrandId)
          );
          if (response.data.success) {
            setCarModels(response.data.content || []);
            // Reset model selection when brand changes
            setValue("carModelId", 0);
          }
        } catch (error) {
          console.error("Error fetching car models:", error);
          toast.error(t("failedToLoadModels"));
        } finally {
          setIsLoadingModels(false);
        }
      } else {
        setCarModels([]);
      }
    };

    // Add a small delay to prevent flickering when quickly changing brands
    const timer = setTimeout(fetchCarModels, 300);
    return () => clearTimeout(timer);
  }, [selectedBrandId, t, setValue]);

  const handleFormSubmit = async (data: CarFormData) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Car Brand */}
        <div className="space-y-2">
          <Label htmlFor="carBrandId" className="text-base">
            {t("carBrand")}
          </Label>
          <Controller
            name="carBrandId"
            control={control}
            rules={{ required: t("carBrandRequired") }}
            render={({ field }) => (
              <Select
                disabled={isSubmitting}
                value={field.value.toString()}
                onValueChange={(value) => {
                  field.onChange(Number(value));
                }}
              >
                <SelectTrigger id="carBrandId" className="h-11">
                  <SelectValue placeholder={t("selectCarBrand")} />
                </SelectTrigger>
                <SelectContent>
                  {carBrands.map((brand) => (
                    <SelectItem
                      key={brand.carBrandId}
                      value={brand.carBrandId.toString()}
                    >
                      {currentLang === "ar" ? brand.brandAr : brand.brandEn}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.carBrandId && (
            <p className="text-destructive">{errors.carBrandId.message}</p>
          )}
        </div>

        {/* Car Model */}
        <div className="space-y-2">
          <Label htmlFor="carModelId" className="text-base">
            {t("carModel")}
          </Label>
          <div className="relative">
            <Controller
              name="carModelId"
              control={control}
              rules={{ required: t("carModelRequired") }}
              render={({ field }) => (
                <Select
                  disabled={
                    isSubmitting ||
                    !selectedBrandId ||
                    selectedBrandId === 0 ||
                    isLoadingModels
                  }
                  value={field.value.toString()}
                  onValueChange={(value) => field.onChange(Number(value))}
                >
                  <SelectTrigger id="carModelId" className="h-11">
                    {isLoadingModels ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("loading")}
                      </span>
                    ) : (
                      <SelectValue placeholder={t("selectCarModel")} />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {carModels.map((model) => (
                      <SelectItem
                        key={model.carModelId}
                        value={model.carModelId.toString()}
                      >
                        {currentLang === "ar" ? model.modelAr : model.modelEn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.carModelId && (
              <p className="text-destructive">{errors.carModelId.message}</p>
            )}
          </div>
        </div>

        {/* Car Color */}
        <div className="space-y-2">
          <Label htmlFor="carColorId" className="text-base">
            {t("carColor")}
          </Label>
          <Controller
            name="carColorId"
            control={control}
            rules={{ required: t("carColorRequired") }}
            render={({ field }) => (
              <ColorSelector
                selectedColorId={field.value}
                onChange={field.onChange}
                disabled={isSubmitting}
              />
            )}
          />
          {errors.carColorId && (
            <p className="text-destructive">{errors.carColorId.message}</p>
          )}
        </div>

        {/* Car Plate Number */}
        <div className="space-y-2">
          <Label htmlFor="carPlateNo" className="text-base">
            {t("carPlateNo")}
          </Label>
          <Input
            id="carPlateNo"
            {...register("carPlateNo", { required: t("carPlateNoRequired") })}
            className="h-11"
            placeholder={t("carPlateNoPlaceholder")}
            disabled={isSubmitting}
          />
          {errors.carPlateNo && (
            <p className="text-destructive">{errors.carPlateNo.message}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center">
        <Button
          variant="primary"
          type="submit"
          className="w-full sm:w-auto min-w-[150px] disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={isSubmitting || !isFormComplete}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("adding")}
            </>
          ) : (
            t("add")
          )}
        </Button>
      </div>
    </form>
  );
};

export default CarForm;
