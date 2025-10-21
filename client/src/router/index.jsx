import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from '../screens/Login'
import Register from '../screens/Register'
import Dashboard from '../screens/Dashboard'
import ProtectedRoute from '../auth/ProtectedRoute'

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
