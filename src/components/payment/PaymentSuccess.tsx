import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { IoIosCheckmarkCircle } from "react-icons/io";

const PaymentSuccess = () => {
  const { t } = useTranslation();

  useEffect(() => {
    toast.success(t("paymentSuccess.toast"));
  }, []);

  return (
    <div className="h-screen flex justify-center items-center flex-col gap-5">
      <h1 className="text-lg lg:text-2xl text-primary font-semibold">
        {t("paymentSuccess.message")}
      </h1>
      <h2>
        <IoIosCheckmarkCircle color="green" size={35} />
      </h2>
      <Link to={"/orders"}>
        <button className="py-1.5 px-8 bg-primary text-white text-lg rounded-lg">
          {t("orders")}
        </button>
      </Link>
    </div>
  );
};

export default PaymentSuccess;
