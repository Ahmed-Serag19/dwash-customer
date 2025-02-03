import NavbarComponent from "@/components/NavbarComponent";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <NavbarComponent />
      <Outlet />
    </>
  );
};

export default MainLayout;
