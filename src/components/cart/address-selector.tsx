import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { UserAddress } from "@/interfaces";
import { ChevronDown, ChevronUp, MapPin } from "lucide-react";

interface AddressSelectorProps {
  addresses: UserAddress[];
  selectedAddressId: number | null;
  onSelect: (addressId: number) => void;
}

const AddressSelector = ({
  addresses,
  selectedAddressId,
  onSelect,
}: AddressSelectorProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";
  const [isOpen, setIsOpen] = useState(false);

  const selectedAddress = addresses.find(
    (address) => address.userAddressId === selectedAddressId
  );

  return (
    <div className="relative">
      {/* Selected Address Display / Dropdown Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 border rounded-lg flex justify-between items-center bg-white"
      >
        <div className="flex items-center gap-2">
          <MapPin className="text-primary h-5 w-5" />
          {selectedAddress ? (
            <div className="text-left">
              <p className="font-medium">{selectedAddress.addressTitle}</p>
              <p className="text-sm text-gray-600">
                {isRTL
                  ? `${selectedAddress.cityAr}, ${selectedAddress.districtAr}`
                  : `${selectedAddress.cityEn || selectedAddress.cityAr}, ${
                      selectedAddress.districtEn || selectedAddress.districtAr
                    }`}
              </p>
            </div>
          ) : (
            <span>{t("selectAddress")}</span>
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
          {addresses.map((address) => (
            <div
              key={address.userAddressId}
              onClick={() => {
                onSelect(address.userAddressId);
                setIsOpen(false);
              }}
              className={`p-3 cursor-pointer hover:bg-gray-100 ${
                selectedAddressId === address.userAddressId
                  ? "bg-primary/10"
                  : ""
              }`}
            >
              <p className="font-medium">{address.addressTitle}</p>
              <p className="text-sm text-gray-600">
                {isRTL
                  ? `${address.cityAr}, ${address.districtAr}`
                  : `${address.cityEn || address.cityAr}, ${
                      address.districtEn || address.districtAr
                    }`}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
