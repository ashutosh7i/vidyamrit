import { createBrowserRouter, RouterProvider, Outlet } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
//
import { AuthProvider } from "./providers/AuthProvider";
import "./lib/i18n";
import { Toaster } from "@/components/ui/sonner";
//
import ProtectedRoute from "./components/ProtectedRoute";
import NotFoundComponent from "./components/NotFound";
//
import RegisterPage from "./pages/auth/RegisterPage";
import LoginPage from "./pages/auth/LoginPage";
import LogoutPage from "./pages/auth/LogoutPage";
//
import DashboardLayout from "./components/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";

import LandingPage from "./pages/public/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    Component: () => <LandingPage />,
  },

  // 404 not found
  {
    path: "*",
    Component: () => <NotFoundComponent />,
  },
  // Auth routes
  {
    path: "/login",
    Component: () => <LoginPage />,
  },
  {
    path: "/register",
    Component: () => <RegisterPage />,
  },
  {
    path: "/logout",
    Component: () => <LogoutPage />,
  },
  // Protected route with outlet for dashboard sidebar and layout
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster richColors />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
