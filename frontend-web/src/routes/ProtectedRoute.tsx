import { Navigate, Outlet } from "react-router-dom";

import { routePaths } from "./routePaths";

export const ProtectedRoute = () => {
	const isAuthenticated = Boolean(localStorage.getItem("user"));

	if (!isAuthenticated) {
		return <Navigate to={routePaths.login} replace />;
	}

	return <Outlet />;
};
