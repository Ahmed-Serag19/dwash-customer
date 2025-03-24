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
  const isRTL = currentLang === "ar";

  return (
    <div className="p-4 border rounded-lg flex flex-col md:flex-row gap-10">
      <div className="flex justify-between items-center md:items-start mb-4 flex-col flex-1 gap-10">
        <h4 className="text-2xl font-medium text-primary">
          {address.addressTitle}
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-2 gap-10 w-full">
          <div>
            <p className="text-lg font-medium text-primary">{t("city")}</p>
            <p className="font-medium text-lg">
              {isRTL ? address.cityAr : address.cityEn || address.cityAr}
            </p>
          </div>
          <div>
            <p className="text-lg font-medium text-primary">{t("district")}</p>
            <p className="font-medium text-lg">
              {isRTL
                ? address.districtAr
                : address.districtEn || address.districtAr}
            </p>
          </div>
          <div>
            <p className="text-lg font-medium text-primary">{t("latitude")}</p>
            <p className="font-medium text-lg">{address.latitude}</p>
          </div>
          <div>
            <p className="text-lg font-medium text-primary">{t("longitude")}</p>
            <p className="font-medium text-lg">{address.longitude}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-7 justify-center max-md:items-center">
        {onEdit && onDelete && (
          <>
            <button
              onClick={onEdit}
              className="bg-green-500 text-white max-md:w-2/3 px-4 text-lg md:px-10 py-2 rounded-2xl"
            >
              {t("edit")}
            </button>
            <button
              onClick={onDelete}
              className="bg-red-500 text-white max-md:w-2/3 px-4 text-lg md:px-10 py-2 rounded-2xl"
            >
              {t("delete")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
