import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { routePaths } from './routePaths'
/* 
  RootRedirect
  └── decide para onde mandar quem acessa /

  ProtectedRoute
  └── protege páginas privadas como /dashboard e /user
*/
export const RootRedirect = () => {
  const navigate = useNavigate()
  const isLoggedIn = false

  useEffect(() => {
    navigate(isLoggedIn ? routePaths.dashboard : routePaths.login, {
      replace: true,
    })
  }, [isLoggedIn, navigate])

  return null
}
