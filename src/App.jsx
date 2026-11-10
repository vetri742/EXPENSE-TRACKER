import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import TransactionProvider from "./context/transactioncontext";
import AuthScreen from "./components/AuthScreen";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import TransactionsPage from "./pages/TransactionsPage";

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  // If not authenticated, guard all routes and render Auth screen
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Dashboard and Category Breakdown on the same page */}
        <Route index element={<DashboardPage />} />
        {/* Dedicated Transaction History and Records page */}
        <Route path="transactions" element={<TransactionsPage />} />
        {/* Fallback to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function AuthenticatedAppWrapper() {
  const { currentUser } = useAuth();
  return (
    <TransactionProvider key={currentUser?.email || "guest"}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TransactionProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedAppWrapper />
    </AuthProvider>
  );
}
