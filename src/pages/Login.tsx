import MotorCycle from "@/assets/images/Group 115.webp";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import AuthForm from "@/components/AuthForm";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import CarLogo from "@/assets/images/navbar-logo.png";

const Login = () => {
  const { i18n, t } = useTranslation();
  const isRegister = location.pathname === "/register";

  return (
    <main className="flex items-center h-screen justify-center w-full flex-col md:flex-row">
      <div className="h-full flex-1 xl:flex-auto relative w-full hidden md:block md:w-1/2 xl:w-2/5">
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-logo"></div>
        <div className="flex items-center justify-center w-full h-full">
          <img
            src={MotorCycle}
            alt="DW Motorcycle"
            className="xl:max-w-xl max-w-[300px] md:max-w-sm"
          />
        </div>
      </div>
      <div
        dir={i18n.language === "en" ? "ltr" : "rtl"}
        className="relative w-full md:w-1/2 xl:flex-auto flex-1 h-full flex flex-col justify-center items-center xl:w-3/5 bg-stone-100 md:bg-transparent"
      >
        <AuthForm isRegister={isRegister} />

        <div className="absolute bottom-5 right-5">
          <LanguageSwitcher />
        </div>
      </div>
      <Link
        to={"/"}
        className="absolute top-10 right-10  rounded-md hover:bg-stone-50 duration-300 transition"
      >
        <img src={CarLogo} alt={t("carLogo")} className="h-11 w-auto" />
      </Link>
    </main>
  );
};

export default Login;
