import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, token, loading } = useUser();
  const [delayFinished, setDelayFinished] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelayFinished(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  if (loading || !delayFinished) return <div>Loading...</div>;

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
