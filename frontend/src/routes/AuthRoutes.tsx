// src/routes/AuthRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

type AuthRouteProps = {
  mode: "public" | "protected" | "root";
};

export default function AuthRoute({ mode }: AuthRouteProps) {
  const accessToken = useSelector(
    (state: RootState) => state.auth.access_token,
  );
  const location = useLocation();
  const isAuthenticated = Boolean(accessToken);

  if (mode === "root") {
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Outlet />;
  }

  if (mode === "protected" && !isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location.pathname }} />;
  }

  if (mode === "public" && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
