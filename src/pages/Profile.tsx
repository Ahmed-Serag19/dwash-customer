import { useUser } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import PersonalInfoForm from "@/components/profile/personal-info-form";
import AddressManagement from "@/components/profile/address-management";
import LoadingIndicator from "@/components/ui/loading-indicator";

const Profile = () => {
  const { user, token, getUser } = useUser();
  const { t } = useTranslation();

  if (!user) return <LoadingIndicator message={t("loading")} />;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-primary mb-6">
        {t("title")}
      </h2>

      {/* Personal Information Form */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-4">{t("personalInfo")}</h3>
        <PersonalInfoForm user={user} token={token} onSuccess={getUser} />
      </div>

      {/* Address Management */}
      <div>
        <h3 className="text-2xl text-primary text-center py-5 font-semibold mb-4">
          {t("addresses")}
        </h3>
        <AddressManagement
          addresses={user.userAddressDto || []}
          token={token}
          onSuccess={getUser}
        />
      </div>
    </div>
  );
};

export default Profile;
