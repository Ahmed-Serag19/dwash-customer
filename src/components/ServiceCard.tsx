import { FaStar } from "react-icons/fa";

const ServiceCard = () => {
  return (
    <div className="max-w-xl rounded-lg border border-gray-200 bg-white p-4 drop-shadow-xl shadow-2xl flex flex-col ">
      <div className="flex flex-col">
        <div className="flex gap-3 ">
          <h1 className="text-3xl text-primary font-[500]">غسيل خارجي</h1>
          <div className="flex items-center gap-1">
            <span className="text-xl font-[500]">4.5</span>
            <FaStar className="text-xl" color="#fdca01" />
          </div>
        </div>
        <p className="text-neutral-600 font-[500] pt-3">خدمات الغسيل الخارجي</p>
      </div>
      <div>
        <div>
          <p>
            <span className="text-primary">السعر</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
