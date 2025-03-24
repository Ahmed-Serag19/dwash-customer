import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp, Car } from "lucide-react";

interface UserCar {
  carId: number;
  carModelAr: string;
  carModelEn: string;
  carBrandAr: string;
  carBrandEn: string;
  carPlateNo: string;
}

interface CarSelectorProps {
  cars: UserCar[];
  selectedCarId: number | null;
  onSelect: (carId: number) => void;
}

const CarSelector = ({ cars, selectedCarId, onSelect }: CarSelectorProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";
  const [isOpen, setIsOpen] = useState(false);

  // Find the selected car
  const selectedCar = cars.find((car) => car.carId === selectedCarId);

  return (
    <div className="relative">
      {/* Selected Car Display / Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 border rounded-lg flex justify-between items-center bg-white"
      >
        <div className="flex items-center gap-2">
          <Car className="text-primary h-5 w-5" />
          {selectedCar ? (
            <div className="text-left">
              <p className="font-medium">
                {isRTL
                  ? `${selectedCar.carBrandAr} ${selectedCar.carModelAr}`
                  : `${selectedCar.carBrandEn} ${selectedCar.carModelEn}`}
              </p>
              <p className="text-sm text-gray-600">{selectedCar.carPlateNo}</p>
            </div>
          ) : (
            <span>{t("selectCar")}</span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
          {cars.map((car) => (
            <div
              key={car.carId}
              onClick={() => {
                onSelect(car.carId);
                setIsOpen(false);
              }}
              className={`p-3 cursor-pointer hover:bg-gray-100 ${
                selectedCarId === car.carId ? "bg-primary/10" : ""
              }`}
            >
              <p className="font-medium">
                {isRTL
                  ? `${car.carBrandAr} ${car.carModelAr}`
                  : `${car.carBrandEn} ${car.carModelEn}`}
              </p>
              <p className="text-sm text-gray-600">{car.carPlateNo}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CarSelector;
