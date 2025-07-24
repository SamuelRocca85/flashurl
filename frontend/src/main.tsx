import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './Home.tsx'
import { ThemeProvider } from '@/components/theme-provider'
import { createBrowserRouter, RouterProvider } from 'react-router'
import BaseLayout from './BaseLayout.tsx'

const router = createBrowserRouter([
  {
    element: <BaseLayout />,
    children: [
      {
        index: true,
        path: '/',
        element: <Home />,
      },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
