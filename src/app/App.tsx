import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ThemeProvider } from './providers'
import { AmbientEngine } from '@/components/ambient/AmbientEngine'

export function App() {
  return (
    <ThemeProvider>
      <AmbientEngine />
      <div className="ambient-app-content">
        <RouterProvider router={router} />
      </div>
    </ThemeProvider>
  )
}
