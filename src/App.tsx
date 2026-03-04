import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import RestaurantDetail from "./pages/RestaurantDetail";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import OrderHistory from "./pages/OrderHistory";
import RestaurantDashboard from "./pages/RestaurantDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";
import RefundPolicy from "./pages/RefundPolicy";
import ReportProblem from "./pages/ReportProblem";
import MyRequests from "./pages/MyRequests";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/restaurant/:id" element={<RestaurantDetail />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order/:id" element={<OrderTracking />} />
                <Route path="/orders" element={<OrderHistory />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/report-problem/:orderId" element={<ReportProblem />} />
                <Route path="/my-requests" element={<MyRequests />} />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/restaurant-dashboard" element={<RestaurantDashboard />} />
                <Route path="/driver" element={<DriverDashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
