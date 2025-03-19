// import { useState } from "react";
// // import { FaStar } from "react-icons/fa";
// import { Service } from "@/interfaces";
// import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { apiEndpoints } from "@/constants/endPoints";
// import { useUser } from "@/context/UserContext";

// interface ServiceCardProps {
//   service: Service;
// }

// const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
//   const { t, i18n } = useTranslation();
//   const navigate = useNavigate();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
//   const token = sessionStorage.getItem("accessToken");
//   const { getCart } = useUser();
//   // Handle Extra Service Selection
//   const handleExtraServiceToggle = (id: number) => {
//     setSelectedExtras((prev) =>
//       prev.includes(id)
//         ? prev.filter((extraId) => extraId !== id)
//         : [...prev, id]
//     );
//   };

//   // Handle Booking Button (Opens Modal)
//   const handleBooking = () => {
//     if (!token) {
//       navigate("/register");
//       toast.info(t("youMustLogin"));
//       return;
//     }
//     setIsModalOpen(true);
//   };

//   // Handle Adding to Cart
//   const handleAddToCart = async () => {
//     try {
//       const response = await axios.post(
//         apiEndpoints.addToCart,
//         {
//           serviceId: service.serviceId,
//           extraServices: selectedExtras,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.data.success) {
//         toast.success(t("addedToCart"));
//         setIsModalOpen(false);
//         getCart();
//       } else {
//         toast.error(t("errorAddingToCart"));
//       }
//     } catch (error) {
//       toast.error(t("errorAddingToCart"));
//     }
//   };
//   return (
//     <div className="max-w-3xl rounded-lg border my-12 min-h-32 border-gray-200 bg-white p-4 drop-shadow-xl shadow-2xl flex justify-between">
//       <div className="flex flex-col">
//         <div className="flex gap-3">
//           <h1 className="text-2xl text-primary font-[500]">
//             {i18n.language === "ar"
//               ? service.servicesNameAr
//               : service.servicesNameEn}
//           </h1>
//           {/* <div className="flex items-center gap-1">
//             <span className="text-lg font-[500]">
//               {service.avgAppraisal || 0}
//             </span>
//             <FaStar className="text-xl" color="#fdca01" />
//           </div> */}
//         </div>
//         <p className="text-neutral-600 font-[500] pt-3">
//           {i18n.language === "ar"
//             ? service.servicesDescriptionsAr
//             : service.servicesDescriptionsEn}
//         </p>
//       </div>
//       <div className="flex flex-col gap-2">
//         <p className="flex gap-3">
//           <span className="text-primary font-[500]">{t("price")}</span>
//           <span>
//             {service.servicesPrice} {t("SAR")}
//           </span>
//         </p>
//         <button
//           onClick={handleBooking}
//           className="bg-primary px-10 py-1.5 rounded-xl text-white"
//         >
//           {t("bookNow")}
//         </button>
//       </div>

//       {/* Fullscreen Booking Modal */}
//       {isModalOpen && (
//         <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
//           <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-auto relative">
//             {/* Close Button */}
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="absolute top-3 right-4 text-xl text-gray-500 hover:text-gray-700"
//             >
//               ✕
//             </button>

//             <h2 className="text-2xl font-bold text-center mb-4">
//               {t("selectExtras")}
//             </h2>

//             {/* Extra Services List */}
//             <div className="space-y-3 px-4">
//               {service.extraServices && service.extraServices.length > 0 ? (
//                 service.extraServices.map((extra) => (
//                   <div
//                     key={extra.id}
//                     className="border p-4 rounded-lg shadow-sm"
//                   >
//                     <label className="flex items-center space-x-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={selectedExtras.includes(extra.id)}
//                         onChange={() => handleExtraServiceToggle(extra.id)}
//                         className="form-checkbox h-5 w-5 text-primary"
//                       />
//                       <span className="text-lg font-semibold">
//                         {i18n.language === "ar"
//                           ? extra.extraNameAr
//                           : extra.extraNameEn}
//                       </span>
//                     </label>
//                     <p className="text-sm text-gray-600 mt-1">
//                       {t("extraDescription")}:{" "}
//                       {i18n.language === "ar"
//                         ? extra.extraDescriptionsAr
//                         : extra.extraDescriptionsEn}
//                     </p>
//                     <p className="text-sm font-bold mt-1">
//                       {t("extraPrice")}: {extra.extraPrice} {t("SAR")}
//                     </p>
//                   </div>
//                 ))
//               ) : (
//                 <p className="text-center">{t("noExtrasAvailable")}</p>
//               )}
//             </div>

//             {/* Modal Actions */}
//             <div className="mt-6 flex justify-between px-4">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="bg-gray-500 px-6 py-2 text-white rounded-lg"
//               >
//                 {t("cancel")}
//               </button>
//               <button
//                 onClick={handleAddToCart}
//                 className="bg-primary px-6 py-2 text-white rounded-lg"
//               >
//                 {t("addToCart")}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ServiceCard;
import { useState } from "react";
import { Service } from "@/interfaces";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";
import { useUser } from "@/context/UserContext";
import ServiceCardModal from "@/components/ServiceCardModal";

interface ServiceCardProps {
  service: Service;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const token = sessionStorage.getItem("accessToken");
  const { getCart } = useUser();

  // Handle Extra Service Selection
  const handleExtraServiceToggle = (id: number) => {
    setSelectedExtras((prev) =>
      prev.includes(id)
        ? prev.filter((extraId) => extraId !== id)
        : [...prev, id]
    );
  };

  const handleBooking = () => {
    if (!token) {
      navigate("/register");
      toast.info(t("youMustLogin"));
      return;
    }
    setIsModalOpen(true);
  };

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(
        apiEndpoints.addToCart,
        {
          serviceId: service.serviceId,
          extraServices: selectedExtras,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(t("addedToCart"));
        setIsModalOpen(false);
        getCart();
      } else {
        toast.error(t("errorAddingToCart"));
      }
    } catch (error) {
      toast.error(t("errorAddingToCart"));
    }
  };

  return (
    <div className="max-w-4xl rounded-lg border my-12 min-h-32 border-gray-200 bg-white p-4 drop-shadow-xl shadow-2xl flex justify-between items-center gap-5">
      <div className="flex flex-col">
        <h1 className="text-2xl text-primary font-[500]">
          {i18n.language === "ar"
            ? service.servicesNameAr
            : service.servicesNameEn}
        </h1>
        <p className="text-neutral-600 font-[500] pt-3">
          {i18n.language === "ar"
            ? service.servicesDescriptionsAr
            : service.servicesDescriptionsEn}
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="flex gap-3">
          <span className="text-primary font-[500]">{t("price")}</span>
          <span>
            {service.servicesPrice} {t("SAR")}
          </span>
        </p>
        <button
          onClick={handleBooking}
          className="bg-primary px-10 py-1.5 rounded-xl text-white"
        >
          {t("bookNow")}
        </button>
      </div>

      <ServiceCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <h2 className="text-2xl font-bold text-center mb-4">
          {t("selectExtras")}
        </h2>

        <div className="space-y-3 px-4">
          {service.extraServices && service.extraServices.length > 0 ? (
            service.extraServices.map((extra) => (
              <div key={extra.id} className="border p-4 rounded-lg shadow-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedExtras.includes(extra.id)}
                    onChange={() => handleExtraServiceToggle(extra.id)}
                    className="form-checkbox h-5 w-5 text-primary"
                  />
                  <span className="text-lg font-semibold">
                    {i18n.language === "ar"
                      ? extra.extraNameAr
                      : extra.extraNameEn}
                  </span>
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  {t("extraDescription")}:{" "}
                  {i18n.language === "ar"
                    ? extra.extraDescriptionsAr
                    : extra.extraDescriptionsEn}
                </p>
                <p className="text-sm font-bold mt-1">
                  {t("extraPrice")}: {extra.extraPrice} {t("SAR")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-center">{t("noExtrasAvailable")}</p>
          )}
        </div>

        <div className="mt-6 flex justify-between px-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-500 px-6 py-2 text-white rounded-lg"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleAddToCart}
            className="bg-primary px-6 py-2 text-white rounded-lg"
          >
            {t("addToCart")}
          </button>
        </div>
      </ServiceCardModal>
    </div>
  );
};

export default ServiceCard;
