import { useTranslation } from "react-i18next";
import MotorCycle from "@/assets/images/Group 115.webp";
import LanguageSwitcher from "@/components/LanguageSwitcher";
const Login = () => {
  const { t, i18n } = useTranslation();
  return (
    <main className="flex items-center h-screen justify-center w-full flex-col md:flex-row">
      <div className="h-full flex-1 relative w-full  md:w-1/2 lg:w-1/3">
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-logo"></div>
        <div className="flex items-center justify-center w-full h-full ">
          <img
            src={MotorCycle}
            alt="DW Motorcycle"
            className="lg:max-w-xl max-w-sm md:max-w-md"
          />
        </div>
      </div>
      <div className="relative w-1/2 flex-1 h-full flex justify-center items-center">
        <div className="text-primary  font-semibold text-4xl ">
          {t("login")}
        </div>

        <div className="absolute bottom-5 right-5">
          <LanguageSwitcher />
        </div>
      </div>
    </main>
  );
};

export default Login;
