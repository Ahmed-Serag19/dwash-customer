import { Navigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import LoadingIndicator from "./ui/loading-indicator";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, token, loading } = useUser();

  if (loading) return <LoadingIndicator message="Loading..." />;
  if (!user || !token) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
