import { useTranslation } from "react-i18next";
import MotorCycle from "@/assets/images/Group 115.webp";
import LanguageSwitcher from "@/components/LanguageSwitcher";
const Login = () => {
  const { t } = useTranslation();
  return (
    <main className="flex items-center h-screen justify-center w-full flex-col md:flex-row">
      <div className="h-full flex-1  xl:flex-auto  relative w-full hidden md:block md:w-1/2 xl:w-2/5 ">
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-logo"></div>
        <div className="flex items-center justify-center w-full h-full ">
          <img
            src={MotorCycle}
            alt="DW Motorcycle"
            className="xl:max-w-xl max-w-[300px]  md:max-w-sm"
          />
        </div>
      </div>
      <div className="relative w-full md:w-1/2  xl:flex-auto flex-1 h-full flex justify-center items-center xl:w-3/5">
        <div className="text-primary  font-semibold text-2xl lg:text-4xl ">
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
