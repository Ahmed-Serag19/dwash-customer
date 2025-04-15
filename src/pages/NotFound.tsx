import { ArrowLeft, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  const { t, i18n } = useTranslation();

  const isArabic = i18n.language === "ar";

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-4 ${
        isArabic ? "rtl" : ""
      }`}
    >
      <div className="text-center">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">{t("pageNotFound")}</h2>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="flex items-center justify-center px-4 py-2 bg-black text-white rounded-md hover:bg-primary/80 transition-colors"
          >
            {isArabic ? (
              <>
                {t("backToDashboard")}
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t("backToDashboard")}
              </>
            )}
          </Link>
        </div>
      </div>

      <footer className="mt-12 text-center text-md  text-muted-foreground">
        {t("contactSupportMessage")}
      </footer>
    </div>
  );
};

export default NotFoundPage;
