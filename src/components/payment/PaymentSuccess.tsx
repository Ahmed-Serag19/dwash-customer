import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints"; // Assuming you have this constant
import { useUser } from "@/context/UserContext";

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const { token } = useUser();
  const urlParams = new URLSearchParams(location.search);
  const payment_id = urlParams.get("payment_id");
  const trans_id = urlParams.get("trans_id");
  const order_id = urlParams.get("order_id");
  const hash = urlParams.get("hash");
  console.log(payment_id, " ,", trans_id, ",", order_id, ",", hash);

  useEffect(() => {
    toast.success(t("paymentSuccess.toast"));

    const finalizePaymentRequest = async () => {
      try {
        await axios.post(
          apiEndpoints.finalizePayment,
          {
            hash: hash,
            payment_id: payment_id,
            trans_id: trans_id,
            order_id: order_id,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(
            "Error finalizing payment:",
            error.response ? error.response.data : error.message
          );
        } else {
          toast.error(`Error finalizing payment: ${String(error)}`);
        }
      }
    };

    if (payment_id && trans_id && order_id && hash) {
      finalizePaymentRequest();
    }
  }, [payment_id, trans_id, order_id, hash, t, token]);

  return (
    <div className="h-screen flex justify-center items-center flex-col gap-5">
      <h1 className="text-lg lg:text-2xl text-primary font-semibold">
        {t("paymentSuccess.message")}
      </h1>
      <Link to={"/orders"}>
        <button className="py-1.5 px-8 bg-primary text-white text-lg rounded-lg">
          {t("orders")}
        </button>
      </Link>
    </div>
  );
};

export default PaymentSuccess;
