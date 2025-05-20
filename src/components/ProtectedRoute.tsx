import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import LoadingIndicator from "./ui/loading-indicator";
import { useTranslation } from "react-i18next";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { t } = useTranslation();
  const { user, token, loading } = useUser();

  if (loading) return <LoadingIndicator message={t("loading")} />;
  if (!user || !token) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
