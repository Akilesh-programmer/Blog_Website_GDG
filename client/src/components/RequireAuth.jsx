import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../routes/paths";

export default function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading)
    return (
      <div className="py-20 text-center text-sm text-neutral-500">
        Checking session...
      </div>
    );
  if (!user)
    return <Navigate to={ROUTES.AUTH} replace state={{ from: location }} />;
  return <Outlet />;
}
