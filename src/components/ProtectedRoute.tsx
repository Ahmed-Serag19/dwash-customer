import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import LoadingIndicator from "./ui/loading-indicator";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { apiEndpoints } from "@/constants/endPoints";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { t } = useTranslation();
  const { user, token, loading } = useUser();
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        setValidating(false);
        return;
      }
      try {
        await axios.get(apiEndpoints.getProfile, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTokenValid(true);
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          // Token is invalid/expired
          localStorage.removeItem("accessToken");
          setTokenValid(false);
        }
      } finally {
        setValidating(false);
      }
    };
    validateToken();
  }, [token]);

  if (loading || validating) return <LoadingIndicator message={t("loading")} />;
  if (!user || !token || !tokenValid) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
