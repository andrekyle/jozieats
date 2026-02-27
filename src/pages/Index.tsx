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

  // Role-based redirects — only if user has ONLY that role (no customer view)
  if (roles.length === 1 && roles[0] === "admin") return <Navigate to="/admin" replace />;
  if (roles.length === 1 && roles[0] === "restaurant_owner") return <Navigate to="/restaurant-dashboard" replace />;
  if (roles.length === 1 && roles[0] === "driver") return <Navigate to="/driver" replace />;

  return <CustomerHome />;
}
