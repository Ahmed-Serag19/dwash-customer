import PaymentFailed from "@/components/payment/PaymentFailed";
import PaymentSuccess from "@/components/payment/PaymentSuccess";
import ServiceProvider from "@/components/ServiceProvider";
import MainLayout from "@/layout/MainLayout";
import Cars from "@/pages/Cars";
import Cart from "@/pages/Cart";
import Homepage from "@/pages/Homepage";
import Login from "@/pages/Login";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFoundPage from "@/pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "home", element: <Homepage /> },
      {
        path: "orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: "service-provider/:id", element: <ServiceProvider /> },
      {
        path: "my-cars",
        element: (
          <ProtectedRoute>
            <Cars />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-failed",
        element: <PaymentFailed />,
      },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Login /> },
  { path: "*", element: <NotFoundPage /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
