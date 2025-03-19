import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useProfileForm } from "@/hooks/useProfileForm";
import LoadingIndicator from "@/components/ui/loading-indicator";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import ProfileForm from "@/components/profile/profile-form";

const Profile = () => {
  const { user, token, getUser } = useUser();
  const [editMode, setEditMode] = useState(false);
  const { t } = useTranslation();
  const {
    formMethods,
    loading,
    cities,
    districts,
    loadingLocation,
    handleGetLocation,
  } = useProfileForm(user);

  const onSubmit = async (data: any) => {
    try {
      const response = await axios.put(apiEndpoints.editProfile, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success(t("profileUpdated"));
        setEditMode(false);
        getUser();
      } else {
        toast.error(t("updateFailed"));
      }
    } catch (error) {
      toast.error(t("generalError"));
    }
  };

  if (loading) return <LoadingIndicator message={t("loading")} />;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-primary mb-6">
        {t("title")}
      </h2>

      <ProfileForm
        formMethods={formMethods}
        onSubmit={onSubmit}
        editMode={editMode}
        setEditMode={setEditMode}
        user={user}
        cities={cities}
        districts={districts}
        loadingLocation={loadingLocation}
        handleGetLocation={handleGetLocation}
      />
    </div>
  );
};

export default Profile;
