import About from "@/pages/About";
import Homepage from "@/pages/Homepage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <Homepage /> },
  { path: "/about", element: <About /> },
]);

const AppRoutes = () => <RouterProvider router={router} />;

export default AppRoutes;
