import { useTranslation } from "react-i18next";
import type { Car } from "@/interfaces";

interface CarCardProps {
  car: Car;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CarCard = ({ car, onEdit, onDelete }: CarCardProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";

  const modelName = isRTL ? car.carModelAr : car.carModelEn;
  const brandName = isRTL ? car.carBrandAr : car.carBrandEn;

  return (
    <div className="p-4 border rounded-lg flex flex-col md:flex-row gap-10">
      <div className="flex justify-between items-center md:items-start mb-4 flex-col flex-1 gap-10 ">
        <h4 className="text-2xl font-medium text-primary">
          {brandName} {modelName}
        </h4>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-3">
            <p className="text-lg font-medium text-primary">
              {t("carPlateNo")}
            </p>
            <p className="font-medium text-lg">{car.carPlateNo}</p>
          </div>
          <div className="flex flex-col gap-3 justify-center items-center">
            <p className="text-md font-medium text-primary">{t("carColor")}</p>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full"
                style={{ backgroundColor: car.carColorEn }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-5 justify-center max-md:items-center">
        {onEdit && onDelete && (
          <>
            <button
              onClick={onEdit}
              className="bg-green-500 text-white max-md:w-2/3 px-4 text-md md:px-10 py-2 rounded-2xl"
            >
              {t("edit")}
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500 text-white max-md:w-2/3 px-4 text-md md:px-10 py-2 rounded-2xl"
            >
              {t("delete")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CarCard;
