import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import CustomerHome from "@/components/customer/CustomerHome";

export default function Index() {
  const { user, loading, roles } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  // Role-based redirects
  if (roles.includes("admin")) return <Navigate to="/admin" replace />;
  if (roles.includes("restaurant_owner")) return <Navigate to="/restaurant-dashboard" replace />;
  if (roles.includes("driver")) return <Navigate to="/driver" replace />;

  return <CustomerHome />;
}
