import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import { Header } from "../components/common/Header";
import { Dashboard } from "../pages/Dashboard";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { User } from "../pages/User";
import { ProtectedRoute } from "./ProtectedRoute";
import { RootRedirect } from "./RootRedirect"; // Import the RootRedirect component
import { routePaths } from "./routePaths";
import Temp from "../pages/Temp";

/* Mapa de Rotas

*/

const RootLayout = () => {
	return (
		<>
			<Header />
			<main className="main container">
				<Outlet />
			</main>
		</>
	);
};

const router = createBrowserRouter([
	{
		element: <RootLayout />,
		children: [
			{
				path: routePaths.root,
				element: <RootRedirect />
			},
			{
				path: routePaths.login,
				element: <Login />
			},
			{
				path: routePaths.register,
				element: <Register />
			},
			{
				element: <ProtectedRoute />,
				children: [
					{
						path: routePaths.dashboard,
						element: <Dashboard />
					},
					{
						path: routePaths.user,
						element: <User />
					},
					{
						path: routePaths.temp,
						element: <Temp />
					}
				]
			}
		]
	}
]);

export const AppRoutes = () => {
	return <RouterProvider router={router} />;
};
