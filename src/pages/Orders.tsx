import React, { useEffect, useState } from "react";
import axios from "axios";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import { useTranslation } from "react-i18next";
import { apiEndpoints } from "@/constants/endPoints";
import { toast } from "react-toastify";
import i18n from "@/i18n";
import OrderCard from "@/components/OrderCard";
import CancelOrderModal from "@/components/CancelOrderModal";

interface OrderData {
  invoiceId: number;
  brandNameAr: string;
  brandNameEn: string;
  userPhoneNumber: string | null;
  fromTime: string | null;
  timeTo: string | null;
  statusName: string;
  reviewed: boolean;
  reservationDate: string;
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
    id: number;
    statusName: string;
  };
}

const Orders: React.FC = () => {
  const { t } = useTranslation();
  const [currentOrders, setCurrentOrders] = useState<OrderData[]>([]);
  const [closedOrders, setClosedOrders] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"current" | "closed">("current");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [isCancelLoading, setIsCancelLoading] = useState(false);
  const token = localStorage.getItem("accessToken");

  const pageSize = 8;

  const fetchOrders = async (type: "current" | "closed", page: number) => {
    setIsLoading(true);
    try {
      const response = await axios.get(apiEndpoints.getOrders(page, pageSize), {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      });

      if (response.data.success) {
        const orders = response.data.content.data;
        const pages = Math.ceil(response.data.content.totalElements / pageSize);

        const current = orders.filter(
          (order: OrderData) =>
            order.request.statusName !== "REJECTED" &&
            order.request.statusName !== "COMPLETED" &&
            order.request.statusName !== "CANCELLED_BY_ADMIN" &&
            order.request.statusName !== "COMPLETED_BY_ADMIN" &&
            order.request.statusName !== "CANCELLED" &&
            order.request.statusName !== "REFUNDED"
        );
        const closed = orders.filter(
          (order: OrderData) =>
            order.request.statusName === "REJECTED" ||
            order.request.statusName === "COMPLETED" ||
            order.request.statusName === "COMPLETED_BY_ADMIN" ||
            order.request.statusName === "CANCELLED_BY_ADMIN" ||
            order.request.statusName === "CANCELLED" ||
            order.request.statusName === "REFUNDED"
        );

        if (type === "current") {
          setCurrentOrders(current);
        } else {
          setClosedOrders(closed);
        }
        setTotalPages(pages);
      } else {
        toast.error(response.data.messageEn || t("errorFetchingData"));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(t("errorFetchingData"));
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleAddReview = async (
    requestId: number,
    appraisal: number,
    description: string
  ) => {
    try {
      const response = await axios.post(
        apiEndpoints.addReview(requestId),
        { appraisal, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(t("reviewAdded"));
        fetchOrders(activeTab, currentPage);
      } else {
        toast.error(response.data.messageEn || t("unknownError"));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(t("reviewFailed"));
      }
    }
  };

  useEffect(() => {
    fetchOrders(activeTab, currentPage);
  }, [activeTab, currentPage]);

  const handleCancelOrder = async (orderId: number) => {
    setIsCancelLoading(true);
    try {
      const response = await axios.put(
        apiEndpoints.cancelOrder(orderId),
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setIsCancelLoading(false);
        toast.success(t("orderCancelled"));
        fetchOrders("current", currentPage);
      } else {
        toast.error(response.data.messageEn || t("unknownError"));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(t("cancellationFailed"));
      }
    } finally {
      setSelectedOrderId(null);
    }
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-[calc(100vh-210px)]">
      <div className="pt-10 mb-5">
        <h1 className="text-3xl text-blue-900 font-bold">{t("orders")}</h1>
      </div>
      <div className="w-full flex justify-center md:min-w-96 min-w-60">
        <Tabs
          defaultValue="current"
          className="w-full max-w-6xl md:min-w-96 min-w-60 flex flex-col items-center"
          onValueChange={(value) => {
            setActiveTab(value as "current" | "closed");
            setCurrentPage(1);
          }}
        >
          <TabsList className="md:min-w-[400px] flex mb-5 text-blue-900">
            <TabsTrigger value="current" className="w-1/2">
              {t("currentOrders")}
            </TabsTrigger>
            <TabsTrigger value="closed" className="w-1/2">
              {t("closedOrders")}
            </TabsTrigger>
          </TabsList>

          {/* Current Orders Tab */}
          <TabsContent
            value="current"
            className="transition-all duration-300 p-5 min-h-[400px]"
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <span className="loader"></span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {currentOrders.map((order) => (
                    <OrderCard
                      key={order.invoiceId}
                      order={order}
                      isClosed={false}
                      onCancel={() => setSelectedOrderId(order.request.id)}
                    />
                  ))}
                </div>
                {currentOrders.length > 0 && (
                  <Pagination className="py-5">
                    <PaginationContent>
                      {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          title={i18n.language === "en" ? "Next" : "التالي"}
                          href="#"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </TabsContent>

          {/* Closed Orders Tab */}
          <TabsContent
            value="closed"
            className="transition-all duration-300 p-5 min-h-[400px]"
          >
            {isLoading ? (
              <div className="flex justify-center items-center">
                <span className="loader"></span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {closedOrders.map((order) => (
                    <OrderCard
                      key={order.invoiceId}
                      order={order}
                      isClosed={true}
                      onAddReview={handleAddReview}
                    />
                  ))}
                </div>
                {closedOrders.length > 0 && (
                  <Pagination className="py-5">
                    <PaginationContent>
                      {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === index + 1}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          title={i18n.language === "en" ? "Next" : "التالي"}
                          href="#"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Cancel Order Modal */}
      {selectedOrderId && (
        <CancelOrderModal
          isCancelLoading={isCancelLoading}
          isOpen={!!selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onConfirm={() => handleCancelOrder(selectedOrderId)}
        />
      )}
    </main>
  );
};

export default Orders;
