import { useTranslation } from "react-i18next";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import CarLogo from "@/assets/images/navbar-logo.png";
import LanguageSwitcher from "./LanguageSwitcher";
import { Link as ScrollLink } from "react-scroll";
import { useUser } from "@/context/UserContext";

const NavbarComponent = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { logout, user, isAuthenticated, cart } = useUser();
  const navigate = useNavigate();

  console.log(user, isAuthenticated);
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <header className="shadow-xl py-1 z-10">
      <nav
        dir={!isArabic ? "ltr" : "rtl"}
        className={`mx-auto px-4 py-3 flex items-center justify-around w-full`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={CarLogo} alt={t("carLogo")} className="h-11 w-auto" />
        </Link>

        {/* Navigation Links */}
        <ul className="hidden md:flex gap-6 text-lg font-medium">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-primary "
                  : "hover:text-blue-500 transition duration-300"
              }
            >
              {t("home")}
            </NavLink>
          </li>
          <li>
            <ScrollLink
              to="services"
              smooth={true}
              duration={700}
              className="text-primary hover:text-blue-900 transition duration-300 cursor-pointer"
            >
              {t("services")}
            </ScrollLink>
          </li>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "text-primary "
                  : "hover:text-blue-500 transition duration-300"
              }
            >
              {t("contact")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/orders"
              className={({ isActive }) =>
                isActive
                  ? "text-primary "
                  : "hover:text-blue-500 transition duration-300"
              }
            >
              {t("orders")}
            </NavLink>
          </li>
        </ul>

        {/* Icons & Login */}
        <div className="flex items-center gap-4 cursor-pointer">
          {user && isAuthenticated && (
            <>
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-black" />
                {cart && cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>

              <Link to="/profile">
                <User className="h-6 w-6 text-black hover:text-primary" />
              </Link>
            </>
          )}

          <LanguageSwitcher />

          {!user && !isAuthenticated && (
            <Link
              to="/login"
              className="border border-primary text-primary px-6 py-1 rounded-xl font-medium hover:bg-primary hover:text-white transition"
            >
              {t("login")}
            </Link>
          )}
          {user && isAuthenticated && (
            <Link
              to="/"
              onClick={handleLogout}
              className="border border-primary text-primary px-6 py-1 rounded-xl font-medium hover:bg-red-400 hover:border-transparent hover:text-white transition"
            >
              {t("logout")}
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavbarComponent;
