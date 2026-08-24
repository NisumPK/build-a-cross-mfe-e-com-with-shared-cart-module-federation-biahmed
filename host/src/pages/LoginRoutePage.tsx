import { lazy } from 'react'

const LoginPage = lazy(() => import('auth_mfe/LoginPage'))

export default function LoginRoutePage() {
  return <LoginPage />
}
