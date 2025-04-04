import ServiceProvider from "@/components/ServiceProvider";
import MainLayout from "@/layout/MainLayout";
import About from "@/pages/About";
import Cars from "@/pages/Cars";
import Cart from "@/pages/Cart";
import Homepage from "@/pages/Homepage";
import Login from "@/pages/Login";
import Orders from "@/pages/Orders";
import Profile from "@/pages/Profile";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "home", element: <Homepage /> },
      { path: "about", element: <About /> },
      { path: "orders", element: <Orders /> },
      { path: "cart", element: <Cart /> },
      { path: "profile", element: <Profile /> },
      { path: "service-provider/:id", element: <ServiceProvider /> },
      { path: "my-cars", element: <Cars /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Login /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
