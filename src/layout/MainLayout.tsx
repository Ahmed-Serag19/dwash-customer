import NavbarComponent from "@/layout/NavbarComponent";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  return (
    <main dir={isArabic ? "rtl" : "ltr"}>
      <NavbarComponent />
      <Outlet />
    </main>
  );
};

export default MainLayout;
