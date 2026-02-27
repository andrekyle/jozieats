import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2, LayoutDashboard, Store, Users, ClipboardList, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminRestaurants from "@/components/admin/AdminRestaurants";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminOrders from "@/components/admin/AdminOrders";

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "restaurants", label: "Restaurants", icon: Store },
  { id: "users", label: "Users", icon: Users },
  { id: "orders", label: "Orders", icon: ClipboardList },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AdminDashboard() {
  const { hasRole, signOut, loading } = useAuth();
  const [tab, setTab] = useState<TabId>("overview");

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!hasRole("admin")) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-30 glass px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Admin</h1>
          <p className="text-xs text-muted-foreground">Platform Management</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
      </div>

      <div className="px-4 mt-4">
        {tab === "overview" && <AdminOverview />}
        {tab === "restaurants" && <AdminRestaurants />}
        {tab === "users" && <AdminUsers />}
        {tab === "orders" && <AdminOrders />}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 glass safe-bottom">
        <div className="flex items-center justify-around py-2">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex flex-col items-center gap-0.5 px-3 py-1 ${tab === t.id ? "text-primary" : "text-muted-foreground"}`}>
              <t.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
