import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import CarLogo from "@/assets/images/navbar-logo.png";
import LanguageSwitcher from "./LanguageSwitcher";

const NavbarComponent = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

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
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive
                  ? "text-primary "
                  : "hover:text-blue-500 transition duration-300"
              }
            >
              {t("services")}
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
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
        <div className="flex items-center gap-4">
          <Link to="/cart">
            <ShoppingCart className="h-6 w-6 text-black hover:text-primary" />
          </Link>
          <Link to="/profile">
            <User className="h-6 w-6 text-black hover:text-primary" />
          </Link>

          <LanguageSwitcher />

          <Link
            to="/login"
            className="border border-primary text-primary px-6 py-1 rounded-xl font-medium hover:bg-primary hover:text-white transition"
          >
            {t("login")}
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default NavbarComponent;
