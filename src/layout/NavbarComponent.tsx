import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Menu } from "lucide-react";
import CarLogo from "@/assets/images/navbar-logo.png";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { Link as ScrollLink } from "react-scroll";
import { useUser } from "@/context/UserContext";
import { toast } from "react-toastify";

const NavbarComponent = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { logout, user, isAuthenticated, cart } = useUser();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success(t("loggedOut"));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="shadow-xl py-1 z-10">
      <nav
        dir={!isArabic ? "ltr" : "rtl"}
        className={`mx-auto px-8 py-3 flex items-center justify-between w-full`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img
            src={CarLogo}
            alt={t("carLogo")}
            className="h-8 sm:h-11 w-auto"
          />
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
          {user && (
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
          )}
        </ul>

        {/* Icons & Login */}
        <div className="flex items-center gap-4 cursor-pointer">
          {/* Dropdown Button for Tablet View */}
          {user && isAuthenticated && (
            <button
              onClick={toggleDropdown}
              className="md:hidden focus:outline-none"
            >
              <Menu className="h-6 w-6 text-black" />
            </button>
          )}

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              className={`absolute top-16 ${
                i18n.language === "ar" ? "left-4" : "right-4"
              } bg-white shadow-lg rounded-lg p-4 md:hidden z-50 min-h-42`}
            >
              <ul className="space-y-2">
                {user && isAuthenticated && (
                  <>
                    <li onClick={toggleDropdown}>
                      <Link
                        to="/orders"
                        className="block cursor-pointer hover:text-primary"
                      >
                        {t("orders")}
                      </Link>
                    </li>
                    <li onClick={toggleDropdown}>
                      <Link
                        to="/profile"
                        className="block cursor-pointer hover:text-primary"
                      >
                        {t("profile")}
                      </Link>
                    </li>
                    <li onClick={toggleDropdown}>
                      <Link
                        to="/cart"
                        className="block cursor-pointer hover:text-primary"
                      >
                        {t("cart")}
                      </Link>
                    </li>
                    <li>
                      {!user && !isAuthenticated && (
                        <Link to="/login">{t("login")}</Link>
                      )}
                      {user && isAuthenticated && (
                        <Link
                          to="/"
                          onClick={handleLogout}
                          className="hover:text-red-500 transition duration-300"
                        >
                          {t("logout")}
                        </Link>
                      )}
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}

          {/* Regular Icons for Desktop View */}
          {user && isAuthenticated && (
            <>
              <Link to="/cart" className="relative hidden md:block">
                <ShoppingCart className="h-6 w-6 text-black" />
                {cart && cart.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    {cart.length}
                  </span>
                )}
              </Link>

              <Link to="/profile" className="hidden md:block">
                <User className="h-6 w-6 text-black hover:text-primary" />
              </Link>
            </>
          )}

          <LanguageSwitcher />

          {!user && !isAuthenticated && (
            <Link
              to="/login"
              className="border border-primary text-primary px-2 sm:px-6 py-1 rounded-xl font-medium hover:bg-primary hover:text-white transition"
            >
              {t("login")}
            </Link>
          )}
          {user && isAuthenticated && (
            <Link
              to="/"
              onClick={handleLogout}
              className="border border-primary text-primary px-2 sm:px-6 py-1 rounded-xl font-medium hover:bg-red-400 hover:border-transparent hover:text-white transition hidden md:block"
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
