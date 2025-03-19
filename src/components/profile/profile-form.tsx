import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import NameField from "./name-field";
import EmailField from "./email-field";
import LocationFields from "./location-fields";
import CityField from "./city-field";
import DistrictField from "./district-field";
import ActionButtons from "./action-buttons";
import type { City, District } from "@/interfaces";

interface ProfileFormProps {
  formMethods: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  editMode: boolean;
  setEditMode: (value: boolean) => void;
  user: any;
  cities: City[];
  districts: District[];
  loadingLocation: boolean;
  handleGetLocation: () => void;
}

const ProfileForm = ({
  formMethods,
  onSubmit,
  editMode,
  setEditMode,
  user,
  cities,
  districts,
  loadingLocation,
  handleGetLocation,
}: ProfileFormProps) => {
  const { handleSubmit } = formMethods;
  const { t } = useTranslation();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
      <NameField formMethods={formMethods} disabled={!editMode} />
      <EmailField formMethods={formMethods} disabled={!editMode} />
      <CityField formMethods={formMethods} cities={cities} user={user} />
      <DistrictField
        formMethods={formMethods}
        districts={districts}
        user={user}
      />
      <LocationFields
        formMethods={formMethods}
        loadingLocation={loadingLocation}
        handleGetLocation={handleGetLocation}
      />
      <ActionButtons editMode={editMode} setEditMode={setEditMode} t={t} />
    </form>
  );
};

export default ProfileForm;
