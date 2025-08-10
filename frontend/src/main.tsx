import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Home from './Home.tsx';
import { ThemeProvider } from '@/components/theme-provider';
import { createBrowserRouter, RouterProvider } from 'react-router';
import BaseLayout from './BaseLayout.tsx';
// import UrlDashoboard from "./UrlDashoboard.tsx";
import { mockStats } from './data/mockDashboard.ts';
import UrlDashboard from './routes/UrlDashboard.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    Component: BaseLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'dashboard/:id',
        loader: () => {
          return mockStats;
        },
        Component: UrlDashboard,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='dark'>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
