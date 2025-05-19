import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useCart } from "@/context/CartContext";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { useUser } from "@/context/UserContext";

const PaymentSuccess = () => {
  const { t } = useTranslation();
  const { successDeletedCartItem, setSuccessDeletedCartItem } = useCart();
  const { getCart, token } = useUser();
  const handleDeleteCartItem = async (invoiceId: number, itemId: number) => {
    await axios.delete(
      `${apiEndpoints.deleteFromCart}?invoiceId=${invoiceId}&itemId=${itemId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    await getCart();
  };
  useEffect(() => {
    handleDeleteCartItem(successDeletedCartItem, successDeletedCartItem);
    setSuccessDeletedCartItem(0);
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
