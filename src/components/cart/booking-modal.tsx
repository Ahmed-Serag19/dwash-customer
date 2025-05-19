// import { useState, useEffect } from "react";
// import { useTranslation } from "react-i18next";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { apiEndpoints } from "@/constants/endPoints";
// import { useUser } from "@/context/UserContext";
// import type { Service, TimeSlot } from "@/interfaces";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Loader2, Calendar, Clock, Check, ChevronRight } from "lucide-react";

// interface BookingModalProps {
//   service: Service;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const BookingModal = ({ service, onClose, onSuccess }: BookingModalProps) => {
//   const { t, i18n } = useTranslation();
//   const { token } = useUser();
//   const [activeTab, setActiveTab] = useState("extras");
//   const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
//   const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
//   const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
//   // const [loading, setLoading] = useState(false);
//   const [slotsLoading, setSlotsLoading] = useState(false);
//   const [addingToCart, setAddingToCart] = useState(false);

//   // Calculate total price
//   const calculateTotalPrice = () => {
//     const basePrice = service.servicesPrice || 0;
//     const extrasTotal = selectedExtras.reduce((sum, extraId) => {
//       const extra = service.extraServices?.find((e) => e.id === extraId);
//       return sum + (extra?.extraPrice || 0);
//     }, 0);
//     return basePrice + extrasTotal;
//   };

//   const handleExtraServiceToggle = (id: number) => {
//     setSelectedExtras((prev) =>
//       prev.includes(id)
//         ? prev.filter((extraId) => extraId !== id)
//         : [...prev, id]
//     );
//   };

//   const handleSlotSelection = (slotId: number) => {
//     setSelectedSlot(slotId);
//   };

//   // Fetch time slots
//   useEffect(() => {
//     if (activeTab === "timeslots" && token) {
//       setSlotsLoading(true);
//       axios
//         .get(`${apiEndpoints.getSlots}?brandId=${service.brandId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           if (response.data.success) {
//             setTimeSlots(response.data.content);
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching slots:", error);
//           toast.error(t("errorFetchingSlots"));
//         })
//         .finally(() => {
//           setSlotsLoading(false);
//         });
//     }
//   }, [activeTab, service.brandId, token, t]);

//   const handleContinue = () => {
//     if (activeTab === "extras") {
//       setActiveTab("timeslots");
//     } else if (activeTab === "timeslots" && selectedSlot) {
//       handleAddToCartAndBook();
//     }
//   };

//   const handleAddToCartAndBook = async () => {
//     if (!token || !selectedSlot) return;

//     setAddingToCart(true);
//     try {
//       // Add to cart only - we don't book the time slot here
//       const cartResponse = await axios.post(
//         apiEndpoints.addToCart,
//         {
//           serviceId: service.serviceId,
//           extraServices: selectedExtras,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (cartResponse.data.success) {
//         // Store the selected slot ID in localStorage or pass it to the cart page
//         // We'll use localStorage for simplicity
//         localStorage.setItem("selectedSlotId", selectedSlot.toString());
//         localStorage.setItem("selectedServiceId", service.serviceId.toString());

//         toast.success(t("addedToCart"));
//         onSuccess();
//       } else {
//         throw new Error("Failed to add to cart");
//       }
//     } catch (error) {
//       console.error("Error adding to cart:", error);
//       toast.error(t("errorAddingToCart"));
//     } finally {
//       setAddingToCart(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
//       <div className="bg-white rounded-lg p-6 w-11/12 md:w-3/4 lg:w-2/3 max-h-[90vh] overflow-auto relative">
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-4 text-xl text-gray-500 hover:text-gray-700"
//           aria-label="Close"
//         >
//           ✕
//         </button>

//         <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
//           {i18n.language === "ar"
//             ? service.servicesNameAr
//             : service.servicesNameEn}
//         </h2>

//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid w-full grid-cols-2 mb-6">
//             <TabsTrigger value="extras" disabled={addingToCart}>
//               <div className="flex items-center gap-2">
//                 {activeTab === "extras" ? (
//                   <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
//                     1
//                   </div>
//                 ) : (
//                   <Check className="w-5 h-5 text-primary" />
//                 )}
//                 {t("selectExtras")}
//               </div>
//             </TabsTrigger>
//             <TabsTrigger value="timeslots" disabled={addingToCart}>
//               <div className="flex items-center gap-2">
//                 <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center">
//                   2
//                 </div>
//                 {t("selectTimeSlot")}
//               </div>
//             </TabsTrigger>
//           </TabsList>

//           <TabsContent value="extras" className="space-y-4">
//             {service.extraServices && service.extraServices.length > 0 ? (
//               service.extraServices.map((extra) => (
//                 <div
//                   key={extra.id}
//                   className={`rounded-xl border p-4 transition-all ${
//                     selectedExtras.includes(extra.id)
//                       ? "border-primary bg-primary/5"
//                       : "border-gray-200 hover:border-gray-300"
//                   }`}
//                 >
//                   <label className="flex cursor-pointer items-start space-x-4">
//                     <div className="flex h-5 items-center">
//                       <input
//                         type="checkbox"
//                         checked={selectedExtras.includes(extra.id)}
//                         onChange={() => handleExtraServiceToggle(extra.id)}
//                         className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
//                       />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center justify-between">
//                         <span className="font-medium text-gray-900">
//                           {i18n.language === "ar"
//                             ? extra.extraNameAr
//                             : extra.extraNameEn}
//                         </span>
//                         <span className="font-semibold text-primary">
//                           +{extra.extraPrice} {t("SAR")}
//                         </span>
//                       </div>
//                       <p className="mt-1 text-sm text-gray-600">
//                         {i18n.language === "ar"
//                           ? extra.extraDescriptionsAr
//                           : extra.extraDescriptionsEn}
//                       </p>
//                     </div>
//                   </label>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500">
//                 {t("noExtrasAvailable")}
//               </p>
//             )}
//           </TabsContent>

//           <TabsContent value="timeslots" className="space-y-4">
//             {slotsLoading ? (
//               <div className="flex justify-center items-center py-10">
//                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                 <span className="ml-2">{t("loading")}</span>
//               </div>
//             ) : timeSlots.length > 0 ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {timeSlots.map((slot) => (
//                   <button
//                     key={slot.slotId}
//                     onClick={() => handleSlotSelection(slot.slotId)}
//                     className={`flex flex-col p-4 rounded-lg border transition-all ${
//                       selectedSlot === slot.slotId
//                         ? "border-primary bg-primary/5 ring-2 ring-primary/20"
//                         : "border-gray-200 hover:border-gray-300"
//                     }`}
//                   >
//                     <div className="flex items-center gap-2 mb-2">
//                       <Calendar className="h-4 w-4 text-primary" />
//                       <span className="font-medium">{slot.date}</span>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Clock className="h-4 w-4 text-primary" />
//                       <span dir="ltr">
//                         {slot.timeFrom.slice(0, 5)} - {slot.timeTo.slice(0, 5)}
//                       </span>
//                     </div>
//                   </button>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">{t("noAvailableSlots")}</p>
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>

//         {/* Price Summary */}
//         <div className="mt-6 p-4 bg-gray-50 rounded-lg">
//           <div className="flex justify-between items-center">
//             <span className="font-medium">{t("total")}</span>
//             <span className="text-xl font-bold text-primary">
//               {calculateTotalPrice()} {t("SAR")}
//             </span>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex justify-between mt-6">
//           <button
//             onClick={onClose}
//             className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
//             disabled={addingToCart}
//           >
//             {t("cancel")}
//           </button>
//           <button
//             onClick={handleContinue}
//             disabled={
//               (activeTab === "timeslots" && !selectedSlot) || addingToCart
//             }
//             className={`px-6 py-2 rounded-lg font-medium text-white flex items-center ${
//               (activeTab === "timeslots" && !selectedSlot) || addingToCart
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-primary hover:bg-primary/90"
//             }`}
//           >
//             {addingToCart ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 {t("processing")}
//               </>
//             ) : activeTab === "extras" ? (
//               <>
//                 {t("continue")}
//                 <ChevronRight className="ml-2 h-4 w-4" />
//               </>
//             ) : (
//               t("bookNow")
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingModal;
