import { useUser } from "@/context/UserContext";
import { useTranslation } from "react-i18next";
import PersonalInfoForm from "@/components/profile/personal-info-form";
import AddressManagement from "@/components/profile/address-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { user, token, getUser } = useUser();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const isRTL = currentLang === "ar";
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  return (
    <div
      className="container max-w-6xl mx-auto py-10 px-4 sm:px-6"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-primary">
            {t("title")}
          </CardTitle>
          <CardDescription>{t("profileDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="personal">{t("personalInfo")}</TabsTrigger>
              <TabsTrigger value="addresses">{t("addresses")}</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="mt-4">
              <PersonalInfoForm user={user} token={token} onSuccess={getUser} />
            </TabsContent>
            <TabsContent value="addresses" className="mt-4">
              <AddressManagement
                addresses={user.userAddressDto || []}
                token={token}
                onSuccess={getUser}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
