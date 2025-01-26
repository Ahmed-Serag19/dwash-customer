import MainLayout from "@/layout/MainLayout";
import About from "@/pages/About";
import Homepage from "@/pages/Homepage";
import Login from "@/pages/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "about", element: <About /> },
    ],
  },
  { path: "/login", element: <Login /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
