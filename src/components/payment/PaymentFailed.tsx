import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FaCircleXmark } from "react-icons/fa6";

const PaymentFailed = () => {
  const { t } = useTranslation();

  useEffect(() => {
    toast.error(t("paymentFailed"));
  }, []);

  return (
    <div className="h-screen flex justify-center items-center flex-col gap-5">
      <h1 className="text-lg lg:text-2xl text-red-600 font-semibold">
        {t("paymentFailed")}
      </h1>
      <h2>
        <FaCircleXmark color="red" size={35} />
      </h2>
      <Link to={"/"}>
        <button className="py-1.5 px-8 bg-primary text-white text-lg rounded-lg">
          {t("goHome")}
        </button>
      </Link>
    </div>
  );
};

export default PaymentFailed;
