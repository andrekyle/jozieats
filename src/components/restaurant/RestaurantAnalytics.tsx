import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DollarSign, ShoppingBag, TrendingUp, Star } from "lucide-react";

export default function RestaurantAnalytics({ restaurantId }: { restaurantId: string }) {
  const { data: stats } = useQuery({
    queryKey: ["restaurant-stats", restaurantId],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data: todayOrders } = await supabase
        .from("orders")
        .select("total_price, status")
        .eq("restaurant_id", restaurantId)
        .gte("created_at", today);

      const { data: allOrders } = await supabase
        .from("orders")
        .select("total_price")
        .eq("restaurant_id", restaurantId)
        .eq("status", "delivered");

      const todayCount = todayOrders?.length || 0;
      const todayRevenue = todayOrders?.reduce((s, o) => s + Number(o.total_price), 0) || 0;
      const totalRevenue = allOrders?.reduce((s, o) => s + Number(o.total_price), 0) || 0;
      const totalOrders = allOrders?.length || 0;

      return { todayCount, todayRevenue, totalRevenue, totalOrders };
    },
  });

  const cards = [
    { label: "Today's Orders", value: stats?.todayCount || 0, icon: ShoppingBag, format: (v: number) => v },
    { label: "Today's Revenue", value: stats?.todayRevenue || 0, icon: DollarSign, format: (v: number) => `R${v.toFixed(2)}` },
    { label: "Total Revenue", value: stats?.totalRevenue || 0, icon: TrendingUp, format: (v: number) => `R${v.toFixed(2)}` },
    { label: "Total Delivered", value: stats?.totalOrders || 0, icon: Star, format: (v: number) => v },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="p-4 rounded-lg bg-card border border-border">
          <c.icon className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-bold">{c.format(c.value)}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
