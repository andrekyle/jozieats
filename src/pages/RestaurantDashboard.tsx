import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, ClipboardList, UtensilsCrossed, BarChart3, Store, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import RestaurantOrders from "@/components/restaurant/RestaurantOrders";
import RestaurantMenuManager from "@/components/restaurant/RestaurantMenuManager";
import RestaurantAnalytics from "@/components/restaurant/RestaurantAnalytics";
import RestaurantProfile from "@/components/restaurant/RestaurantProfile";

const TABS = [
  { id: "orders", label: "Orders", icon: ClipboardList },
  { id: "menu", label: "Menu", icon: UtensilsCrossed },
  { id: "analytics", label: "Stats", icon: BarChart3 },
  { id: "profile", label: "Profile", icon: Store },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function RestaurantDashboard() {
  const { user, hasRole, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("orders");

  const { data: restaurant, isLoading } = useQuery({
    queryKey: ["my-restaurant", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!hasRole("restaurant_owner") && !hasRole("admin")) return <Navigate to="/" replace />;

  if (isLoading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  if (!restaurant) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <Store className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-lg font-semibold mb-1">No Restaurant Found</p>
        <p className="text-muted-foreground text-sm mb-4">Contact admin to set up your restaurant profile.</p>
        <Button variant="outline" className="rounded-lg" onClick={() => navigate("/")}>
          <Home className="h-4 w-4 mr-2" />Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-30 glass px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => navigate("/")}>
            <Home className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold tracking-wide">{restaurant.name}</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground font-light tracking-wide">Restaurant Dashboard</p>
              <span className={`h-1.5 w-1.5 rounded-full ${restaurant.is_active ? "bg-green-500" : "bg-destructive"}`} />
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={signOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>

      <div className="px-4 mt-4">
        {tab === "orders" && <RestaurantOrders restaurantId={restaurant.id} />}
        {tab === "menu" && <RestaurantMenuManager restaurantId={restaurant.id} />}
        {tab === "analytics" && <RestaurantAnalytics restaurantId={restaurant.id} />}
        {tab === "profile" && <RestaurantProfile restaurant={restaurant} />}
      </div>

      {/* Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass safe-bottom">
        <div className="flex items-center justify-around py-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${tab === t.id ? "text-primary" : "text-muted-foreground"}`}
            >
              <t.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
