import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Dashboard } from '../pages/Dashboard'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { User } from '../pages/User'
import { ProtectedRoute } from './ProtectedRoute'
import { RootRedirect } from './RootRedirect'
import { routePaths } from './routePaths'

/* Mapa de Rotas

*/
const router = createBrowserRouter([
  {
    path: routePaths.root,
    element: <RootRedirect />,
  },
  {
    path: routePaths.login,
    element: <Login />,
  },
  {
    path: routePaths.register,
    element: <Register />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: routePaths.dashboard,
        element: <Dashboard />,
      },
      {
        path: routePaths.user,
        element: <User />,
      },
    ],
  },
])

export const AppRoutes = () => {
  return <RouterProvider router={router} />
}
