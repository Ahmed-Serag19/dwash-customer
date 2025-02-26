import React from "react";

interface OrderCardProps {
  order: {
    invoiceId: number;
    brandNameAr: string;
    brandNameEn: string;
    userPhoneNumber: string | null;
    fromTime: string | null;
    timeTo: string | null;
    statusName: string;
    itemDto: {
      itemNameAr: string;
      itemNameEn: string;
      serviceTypeAr: string;
      serviceTypeEn: string;
      itemPrice: number;
      itemExtraDtos: Array<{
        itemExtraNameAr: string;
        itemExtraNameEn: string;
        itemExtraPrice: number;
      }>;
    };
    totalAmount: number;
    request: {
      statusName: React.ReactNode | Iterable<React.ReactNode>;
      id: number;
    };
  };
  isClosed: boolean;
  onCancel?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, isClosed, onCancel }) => {
  const {
    brandNameAr,
    brandNameEn,
    userPhoneNumber,
    fromTime,
    timeTo,
    itemDto,
    totalAmount,
  } = order;
  const {
    itemNameAr,
    itemNameEn,
    serviceTypeAr,
    serviceTypeEn,
    itemPrice,
    itemExtraDtos,
  } = itemDto;

  return (
    <div className="border p-4 rounded-lg shadow-md flex flex-col gap-3">
      <h3 className="text-lg font-bold">
        {brandNameEn} ({brandNameAr})
      </h3>

      {/* Display user phone number if available */}
      {userPhoneNumber && (
        <p>
          <span className="font-semibold">Phone:</span> {userPhoneNumber}
        </p>
      )}

      {/* Display time range if available */}
      {!isClosed && fromTime && timeTo && (
        <p>
          <span className="font-semibold">Time:</span> {fromTime} - {timeTo}
        </p>
      )}

      {/* Display status */}
      <p>
        <span className="font-semibold">Status:</span>{" "}
        <span
          className={`${
            order.request.statusName === "COMPLETED"
              ? "text-green-500"
              : "text-red-500"
          } font-semibold`}
        >
          {order.request.statusName}
        </span>
      </p>

      {/* Display service details */}
      <p>
        <span className="font-semibold">Service:</span> {itemNameEn} (
        {itemNameAr})
      </p>
      <p>
        <span className="font-semibold">Service Type:</span> {serviceTypeEn} (
        {serviceTypeAr})
      </p>
      <p>
        <span className="font-semibold">Price:</span> {itemPrice}
      </p>

      {/* Display extras if available */}
      {itemExtraDtos.length > 0 && (
        <div>
          <p>Extras:</p>
          <ul>
            {itemExtraDtos.map((extra, index) => (
              <li key={index}>
                {extra.itemExtraNameEn} ({extra.itemExtraNameAr}) -{" "}
                {extra.itemExtraPrice}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display total amount */}
      <p>
        <span className="font-semibold">Total:</span> {totalAmount}
      </p>

      {/* Display cancel button for current orders */}
      {!isClosed && onCancel && (
        <button
          onClick={onCancel}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
};

export default OrderCard;
