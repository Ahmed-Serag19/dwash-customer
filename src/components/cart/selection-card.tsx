import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, Car, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SelectionCardProps {
  onSelectionConfirmed: (addressId: number, carId: number) => void;
}

const SelectionCard = ({ onSelectionConfirmed }: SelectionCardProps) => {
  const { t, i18n } = useTranslation();
  const { token } = useUser();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      setLoading(true);
      try {
        // Fetch addresses
        const addressResponse = await axios.get(apiEndpoints.getAddresses, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (addressResponse.data.success) {
          setAddresses(addressResponse.data.content || []);
          // Auto-select the first address if available
          if (addressResponse.data.content?.length > 0) {
            setSelectedAddressId(addressResponse.data.content[0].userAddressId);
          }
        }

        // Fetch cars
        const carResponse = await axios.get(apiEndpoints.getAllCars, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (carResponse.data.success) {
          setCars(carResponse.data.content || []);
          // Auto-select the first car if available
          if (carResponse.data.content?.length > 0) {
            setSelectedCarId(carResponse.data.content[0].carId);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(t("errorFetchingData"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, t]);

  const handleConfirm = () => {
    if (!selectedAddressId || !selectedCarId) {
      toast.error(t("pleaseSelectBoth"));
      return;
    }

    setIsConfirmed(true);
    onSelectionConfirmed(selectedAddressId, selectedCarId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">{t("loading")}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Address Selection */}
      <Card className={isConfirmed ? "border-green-500 bg-green-50" : ""}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">{t("selectAddress")}</h3>
            {isConfirmed && (
              <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
            )}
          </div>

          {addresses.length > 0 ? (
            <RadioGroup
              value={selectedAddressId?.toString()}
              onValueChange={(value) => {
                setSelectedAddressId(Number(value));
                setIsConfirmed(false); // Reset confirmation when selection changes
              }}
              className="space-y-3"
              disabled={isConfirmed}
            >
              {addresses.map((address) => (
                <div
                  key={address.userAddressId}
                  className={`flex items-start space-x-2 border p-3 rounded-md ${
                    isConfirmed ? "opacity-70" : "hover:bg-gray-50"
                  }`}
                >
                  <RadioGroupItem
                    value={address.userAddressId.toString()}
                    id={`address-${address.userAddressId}`}
                    className="mt-1"
                    disabled={isConfirmed}
                  />
                  <Label
                    htmlFor={`address-${address.userAddressId}`}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    <div className="font-medium">{address.addressTitle}</div>
                    <div className="text-sm text-gray-600">
                      {i18n.language === "ar" ? address.cityAr : address.cityEn}
                      ,{" "}
                      {i18n.language === "ar"
                        ? address.districtAr
                        : address.districtEn}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-md">
              <p className="text-gray-500">{t("noAddresses")}</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => {
                  // Navigate to address management page
                  navigate("/profile?tab=addresses");
                }}
              >
                {t("addNewAddress")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Car Selection */}
      <Card className={isConfirmed ? "border-green-500 bg-green-50" : ""}>
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Car className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">{t("selectCar")}</h3>
            {isConfirmed && (
              <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
            )}
          </div>

          {cars.length > 0 ? (
            <RadioGroup
              value={selectedCarId?.toString()}
              onValueChange={(value) => {
                setSelectedCarId(Number(value));
                setIsConfirmed(false); // Reset confirmation when selection changes
              }}
              className="space-y-3"
              disabled={isConfirmed}
            >
              {cars.map((car) => (
                <div
                  key={car.carId}
                  className={`flex items-start space-x-2 border p-3 rounded-md ${
                    isConfirmed ? "opacity-70" : "hover:bg-gray-50"
                  }`}
                >
                  <RadioGroupItem
                    value={car.carId.toString()}
                    id={`car-${car.carId}`}
                    className="mt-1"
                    disabled={isConfirmed}
                  />
                  <Label
                    htmlFor={`car-${car.carId}`}
                    className="flex-1 cursor-pointer font-normal"
                  >
                    <div className="font-medium">
                      {i18n.language === "ar" ? car.carBrandAr : car.carBrandEn}{" "}
                      {i18n.language === "ar" ? car.carModelAr : car.carModelEn}
                    </div>
                    <div className="text-sm text-gray-600">
                      {car.carPlateNo}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: car.carColorEn }}
                      ></div>
                      <span className="text-xs text-gray-500">
                        {i18n.language === "ar"
                          ? car.carColorAr
                          : car.carColorEn}
                      </span>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="text-center py-4 bg-gray-50 rounded-md">
              <p className="text-gray-500">{t("noCars")}</p>
              <Button
                variant="link"
                className="mt-2"
                onClick={() => {
                  // Navigate to car management page
                  navigate("/my-cars");
                }}
              >
                {t("addNewCar")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Button */}
      <div className="flex justify-end">
        {isConfirmed ? (
          <Button
            variant="outline"
            onClick={() => setIsConfirmed(false)}
            className="px-6 py-2 border-green-500 text-green-600 hover:bg-green-50"
          >
            {t("change")}
          </Button>
        ) : (
          <Button
            onClick={handleConfirm}
            disabled={!selectedAddressId || !selectedCarId}
            className="px-6 py-2 bg-primary hover:bg-primary/90"
          >
            {t("confirm")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SelectionCard;
