import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/context/UserContext";
import AddressSelector from "./address-selector";
import CarSelector from "./car-selector";
import { Check } from "lucide-react";

interface SelectionCardProps {
  onSelectionConfirmed: (addressId: number, carId: number) => void;
}

const SelectionCard = ({ onSelectionConfirmed }: SelectionCardProps) => {
  const { t } = useTranslation();
  const { user } = useUser();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    user?.userAddressDto?.[0]?.userAddressId || null
  );

  const [selectedCarId, setSelectedCarId] = useState<number | null>(
    user?.userCarDto?.[0]?.carId || null
  );

  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirmSelection = () => {
    if (selectedAddressId && selectedCarId) {
      onSelectionConfirmed(selectedAddressId, selectedCarId);
      setIsConfirmed(true);
    }
  };

  const handleEditSelection = () => {
    setIsConfirmed(false);
  };

  if (!user?.userAddressDto?.length || !user?.userCarDto?.length) {
    return (
      <div className="p-6 border rounded-lg bg-yellow-50 mb-6">
        <p className="text-lg text-amber-700 font-medium">
          {t("missingAddressOrCar")}
        </p>
        <p className="mt-2">
          {!user?.userAddressDto?.length && (
            <span className="block">{t("pleaseAddAddress")}</span>
          )}
          {!user?.userCarDto?.length && (
            <span className="block">{t("pleaseAddCar")}</span>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 mb-6 bg-gray-50">
      <h2 className="text-xl font-semibold text-primary mb-4">
        {t("deliveryDetails")}
      </h2>

      {isConfirmed ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-primary">
              {t("confirmedDetails")}
            </h3>
            <button
              onClick={handleEditSelection}
              className="text-primary underline"
            >
              {t("edit")}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Selected Address */}
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-primary">
                  {t("deliveryAddress")}
                </h4>
                <Check className="text-green-500 h-5 w-5" />
              </div>
              {user.userAddressDto.map(
                (address) =>
                  address.userAddressId === selectedAddressId && (
                    <div key={address.userAddressId} className="text-sm">
                      <p className="font-medium">{address.addressTitle}</p>
                      <p>
                        {t("city")}: {address.cityAr} / {address.cityEn}
                      </p>
                      <p>
                        {t("district")}: {address.districtAr} /{" "}
                        {address.districtEn}
                      </p>
                    </div>
                  )
              )}
            </div>

            {/* Selected Car */}
            <div className="border rounded-lg p-4 bg-white">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium text-primary">{t("selectedCar")}</h4>
                <Check className="text-green-500 h-5 w-5" />
              </div>
              {user.userCarDto.map(
                (car) =>
                  car.carId === selectedCarId && (
                    <div key={car.carId} className="text-sm">
                      <p className="font-medium">
                        {car.carBrandEn} {car.carModelEn}
                      </p>
                      <p>
                        {t("carPlateNo")}: {car.carPlateNo}
                      </p>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Address Selector */}
          <div>
            <h3 className="text-lg font-medium text-primary mb-2">
              {t("selectDeliveryAddress")}
            </h3>
            <AddressSelector
              addresses={user.userAddressDto}
              selectedAddressId={selectedAddressId}
              onSelect={setSelectedAddressId}
            />
          </div>

          {/* Car Selector */}
          <div>
            <h3 className="text-lg font-medium text-primary mb-2">
              {t("selectCar")}
            </h3>
            <CarSelector
              cars={user.userCarDto}
              selectedCarId={selectedCarId}
              onSelect={setSelectedCarId}
            />
          </div>

          {/* Confirm Button */}
          <div className="flex justify-end">
            <button
              onClick={handleConfirmSelection}
              disabled={!selectedAddressId || !selectedCarId}
              className={`px-6 py-2 rounded-lg text-white ${
                !selectedAddressId || !selectedCarId
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary"
              }`}
            >
              {t("confirmSelection")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectionCard;
