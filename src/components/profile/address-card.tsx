import { useTranslation } from "react-i18next";
import type { UserAddress } from "@/interfaces";

interface AddressCardProps {
  address: UserAddress;
  onEdit: () => void;
  onDelete: () => void;
}

const AddressCard = ({ address, onEdit, onDelete }: AddressCardProps) => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  return (
    <div className="p-4 border rounded-lg flex justify-around">
      <div className="flex justify-start gap-3 items-start mb-4 flex-col w-2/3">
        <h4 className="text-2xl text-primary font-semibold">
          {address.addressTitle}
        </h4>

        <div className="grid grid-cols-2 gap-4 w-1/2">
          <div>
            <p className="text- text-gray-500">{t("city")}</p>
            <p>
              {currentLang === "ar"
                ? address.cityAr
                : address.cityEn || address.cityAr}
            </p>
          </div>
          <div>
            <p className="text- text-gray-500">{t("district")}</p>
            <p>
              {currentLang === "ar"
                ? address.districtAr
                : address.districtEn || address.districtAr}
            </p>
          </div>
          <div>
            <p className="text- text-gray-500">{t("latitude")}</p>
            <p>{address.latitude}</p>
          </div>
          <div>
            <p className="text- text-gray-500">{t("longitude")}</p>
            <p>{address.longitude}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col min-w-40 gap-5 justify-center">
        <button
          onClick={onEdit}
          className="bg-green-500 text-white px-3 py-2 text-lg  rounded-xl"
        >
          {t("edit")}
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-2 text-lg  rounded-xl"
        >
          {t("delete")}
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
