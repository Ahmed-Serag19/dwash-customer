
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import ColorSelector from "./color-selector";
import { toast } from "react-toastify";
import { useUser } from "@/context/UserContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import type { CarBrand, CarModel, Car } from "@/interfaces";

interface CarFormData {
  carModelId: number;
  carBrandId: number;
  carPlateNo: string;
  carColorId: number;
}

interface EditCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car | null;
  onSave: (carId: number, data: CarFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const EditCarModal = ({
  isOpen,
  onClose,
  car,
  onSave,
  isSubmitting = false,
}: EditCarModalProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const [carBrands, setCarBrands] = useState<CarBrand[]>([]);
  const [carModels, setCarModels] = useState<CarModel[]>([]);
  const [loading, setLoading] = useState(false);
  const { getCars, refreshUserData } = useUser();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CarFormData>();

  const selectedBrandId = watch("carBrandId");

  // Fetch car brands on component mount
  useEffect(() => {
    if (isOpen) {
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
    }
  }, [isOpen, t]);

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

  // Set form values when car changes
  useEffect(() => {
    if (car) {
      setValue("carBrandId", car.carBrandId || 0);
      setValue("carModelId", car.carModelId || 0);
      setValue("carColorId", car.carColorId || 0);
      setValue("carPlateNo", car.carPlateNo || "");
    }
  }, [car, setValue]);

  const handleFormSubmit = async (data: CarFormData) => {
    if (!car) return;
    try {
      await onSave(car.carId, data);
      await getCars();
      await refreshUserData();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (!car) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("editCar")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-6 py-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Car Brand */}
            <div className="space-y-2">
              <Label htmlFor="edit-carBrandId" className="text-base">
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
                      setValue("carModelId", 0);
                    }}
                  >
                    <SelectTrigger id="edit-carBrandId" className="h-11">
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
                <p className="text-destructive text-sm">
                  {errors.carBrandId.message}
                </p>
              )}
            </div>

            {/* Car Model */}
            <div className="space-y-2">
              <Label htmlFor="edit-carModelId" className="text-base">
                {t("carModel")}
              </Label>
              <Controller
                name="carModelId"
                control={control}
                rules={{ required: t("carModelRequired") }}
                render={({ field }) => (
                  <Select
                    disabled={
                      isSubmitting || !selectedBrandId || selectedBrandId === 0
                    }
                    value={field.value.toString()}
                    onValueChange={(value) => field.onChange(Number(value))}
                  >
                    <SelectTrigger id="edit-carModelId" className="h-11">
                      <SelectValue placeholder={t("selectCarModel")} />
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
                <p className="text-destructive text-sm">
                  {errors.carModelId.message}
                </p>
              )}
            </div>

            {/* Car Color */}
            <div className="space-y-2">
              <Label htmlFor="edit-carColorId" className="text-base">
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
                <p className="text-destructive text-sm">
                  {errors.carColorId.message}
                </p>
              )}
            </div>

            {/* Car Plate Number */}
            <div className="space-y-2">
              <Label htmlFor="edit-carPlateNo" className="text-base">
                {t("carPlateNo")}
              </Label>
              <Input
                id="edit-carPlateNo"
                {...register("carPlateNo", {
                  required: t("carPlateNoRequired"),
                })}
                className="h-11"
                placeholder={t("carPlateNoPlaceholder")}
                disabled={isSubmitting}
              />
              {errors.carPlateNo && (
                <p className="text-destructive text-sm">
                  {errors.carPlateNo.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCarModal;
