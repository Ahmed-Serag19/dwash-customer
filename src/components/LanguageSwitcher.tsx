import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import { FaGlobe } from "react-icons/fa"; // Importing the globe icon

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          role="button"
          aria-label="Language Switcher"
          aria-labelledby="language-switcher"
          tabIndex={0}
          className="p-[1px] text-white hover:text-blue-950 hover:bg-stone-100 transition duration-300 bg-blue-950 rounded-full"
        >
          <FaGlobe size={20} /> {/* Globe icon */}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="md:min-w-[24px] min-w-[20px]">
        <DropdownMenuItem
          className="cursor-pointer hover:bg-stone-100"
          onClick={() => changeLanguage("en")}
        >
          EN
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer hover:bg-stone-100"
          onClick={() => changeLanguage("ar")}
        >
          AR
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
