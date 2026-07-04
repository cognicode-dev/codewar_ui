import { createBrowserRouter, Navigate } from 'react-router-dom'
import { EmptyHomePage } from '@/features/home/empty-home-page'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <EmptyHomePage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
