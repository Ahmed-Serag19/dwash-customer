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
import OrderCard from "@/components/OrderCard"; // Custom component for order cards
import CancelOrderModal from "@/components/CancelOrderModal"; // Custom modal for cancel confirmation

interface OrderData {
  invoiceId: number;
  brandNameAr: string;
  brandNameEn: string;
  userPhoneNumber: string;
  fromTime?: string;
  timeTo?: string;
  statusName: string;
  itemNameAr: string;
  itemNameEn: string;
  serviceTypeAr: string;
  serviceTypeEn: string;
  itemPrice: number;
  itemExtraNameAr?: string;
  itemExtraNameEn?: string;
  itemExtraPrice?: number;
  totalAmount: number;
  request: {
    statusName: string;
    id: number;
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
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null); // For cancel modal
  const token = sessionStorage.getItem("accessToken");

  const pageSize = 8;

  const fetchOrders = async (type: "current" | "closed", page: number) => {
    setIsLoading(true);
    try {
      const url = `http://149.102.134.28:8080/api/consumer/getOrders?page=${
        page - 1
      }&size=${pageSize}`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          accept: "*/*",
        },
      });

      if (response.data.success) {
        const orders = response.data.content.data;
        const pages = Math.ceil(response.data.content.totalElements / pageSize);

        // Separate current and closed orders based on status
        const current = orders.filter(
          (order: OrderData) =>
            order.request.statusName !== "REJECTED" &&
            order.request.statusName !== "COMPLETED" &&
            order.request.statusName !== "CANCELLED"
        );
        const closed = orders.filter(
          (order: OrderData) =>
            order.request.statusName === "REJECTED" ||
            order.request.statusName === "COMPLETED" ||
            order.request.statusName === "CANCELLED"
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
  useEffect(() => {
    fetchOrders(activeTab, currentPage);
  }, [activeTab, currentPage]);

  // Handle order cancellation
  const handleCancelOrder = async (orderId: number) => {
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
        toast.success(t("orderCancelled"));
        fetchOrders("current", currentPage); // Refresh current orders
      } else {
        toast.error(response.data.messageEn || t("unknownError"));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        toast.error(t("cancellationFailed"));
      }
    } finally {
      setSelectedOrderId(null); // Close modal
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
          isOpen={!!selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          onConfirm={() => handleCancelOrder(selectedOrderId)}
        />
      )}
    </main>
  );
};

export default Orders;
