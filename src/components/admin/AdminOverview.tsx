import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Users, Store, DollarSign } from "lucide-react";

export default function AdminOverview() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [orders, restaurants, users] = await Promise.all([
        supabase.from("orders").select("total_price, status"),
        supabase.from("restaurants").select("id"),
        supabase.from("user_roles").select("id"),
      ]);

      const totalOrders = orders.data?.length || 0;
      const totalRevenue = orders.data?.reduce((s, o) => s + Number(o.total_price), 0) || 0;
      const activeOrders = orders.data?.filter((o) => !["delivered", "cancelled"].includes(o.status)).length || 0;
      const totalRestaurants = restaurants.data?.length || 0;
      const totalUsers = users.data?.length || 0;

      return { totalOrders, totalRevenue, activeOrders, totalRestaurants, totalUsers };
    },
  });

  const cards = [
    { label: "Total Orders", value: stats?.totalOrders || 0, icon: ShoppingBag, format: (v: number) => v },
    { label: "Revenue", value: stats?.totalRevenue || 0, icon: DollarSign, format: (v: number) => `R${v.toFixed(2)}` },
    { label: "Active Orders", value: stats?.activeOrders || 0, icon: ShoppingBag, format: (v: number) => v },
    { label: "Restaurants", value: stats?.totalRestaurants || 0, icon: Store, format: (v: number) => v },
    { label: "Users", value: stats?.totalUsers || 0, icon: Users, format: (v: number) => v },
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
