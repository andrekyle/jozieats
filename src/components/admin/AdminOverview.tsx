import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, Users, Store, Banknote, TrendingUp, Clock, CheckCircle2, XCircle, Truck, BarChart3, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminOverview() {
  const { data: allOrders = [] } = useQuery({
    queryKey: ["admin-stats-orders"],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("total_price, delivery_fee, status, created_at");
      if (error) throw error;
      return data;
    },
  });

  const { data: restaurants = [] } = useQuery({
    queryKey: ["admin-stats-restaurants"],
    queryFn: async () => {
      const { data, error } = await supabase.from("restaurants").select("id, is_active");
      if (error) throw error;
      return data;
    },
  });

  const { data: userRoles = [] } = useQuery({
    queryKey: ["admin-stats-users"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      return data;
    },
  });

  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

    const delivered = allOrders.filter((o) => o.status === "delivered");
    const cancelled = allOrders.filter((o) => o.status === "cancelled");
    const active = allOrders.filter((o) => !["delivered", "cancelled"].includes(o.status));
    const todayOrders = allOrders.filter((o) => o.created_at >= today);
    const weekOrders = allOrders.filter((o) => o.created_at >= weekAgo);

    const totalRevenue = delivered.reduce((s, o) => s + Number(o.total_price), 0);
    const todayRevenue = todayOrders.filter((o) => o.status === "delivered").reduce((s, o) => s + Number(o.total_price), 0);
    const weekRevenue = weekOrders.filter((o) => o.status === "delivered").reduce((s, o) => s + Number(o.total_price), 0);
    const totalDeliveryFees = delivered.reduce((s, o) => s + Number(o.delivery_fee), 0);

    const activeRestaurants = restaurants.filter((r) => r.is_active).length;
    const uniqueUsers = new Set(userRoles.map((r) => r.user_id)).size;
    const drivers = new Set(userRoles.filter((r) => r.role === "driver").map((r) => r.user_id)).size;
    const owners = new Set(userRoles.filter((r) => r.role === "restaurant_owner").map((r) => r.user_id)).size;

    // 7-day chart
    const dailyData: { label: string; orders: number; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-ZA", { weekday: "short" });
      const dayOrders = allOrders.filter((o) => o.created_at.startsWith(dateStr));
      dailyData.push({
        label: dayLabel,
        orders: dayOrders.length,
        revenue: dayOrders.filter((o) => o.status === "delivered").reduce((s, o) => s + Number(o.total_price), 0),
      });
    }

    return {
      totalOrders: allOrders.length,
      totalRevenue,
      todayOrders: todayOrders.length,
      todayRevenue,
      weekRevenue,
      activeOrders: active.length,
      delivered: delivered.length,
      cancelled: cancelled.length,
      cancelRate: allOrders.length > 0 ? (cancelled.length / allOrders.length * 100) : 0,
      totalRestaurants: restaurants.length,
      activeRestaurants,
      uniqueUsers,
      drivers,
      owners,
      totalDeliveryFees,
      dailyData,
    };
  }, [allOrders, restaurants, userRoles]);

  const maxOrders = Math.max(...stats.dailyData.map((d) => d.orders), 1);

  return (
    <div className="space-y-5">
      <h2 className="text-base font-semibold tracking-wide">Platform Overview</h2>

      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Today's Orders", value: stats.todayOrders, icon: ShoppingBag, color: "text-[#1A6FDB]", bg: "bg-[#1A6FDB]/10" },
          { label: "Today's Revenue", value: `R${stats.todayRevenue.toFixed(2)}`, icon: Banknote, color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
          { label: "Active Orders", value: stats.activeOrders, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
          { label: "This Week", value: `R${stats.weekRevenue.toFixed(2)}`, icon: CalendarDays, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-card border border-border"
          >
            <div className={`h-8 w-8 rounded-lg ${card.bg} flex items-center justify-center mb-2`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
            <p className="text-xl font-bold">{card.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* 7-day chart */}
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold tracking-wide">Orders — Last 7 Days</span>
        </div>
        <div className="flex items-end gap-2 h-28">
          {stats.dailyData.map((day) => (
            <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-muted-foreground">{day.orders}</span>
              <div className="w-full rounded-t-md bg-secondary relative overflow-hidden" style={{ height: "100%" }}>
                <motion.div
                  className="absolute bottom-0 w-full bg-primary/80 rounded-t-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.orders / maxOrders) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
          <p className="text-lg font-bold">{stats.delivered}</p>
          <p className="text-[10px] text-muted-foreground">Delivered</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <XCircle className="h-4 w-4 text-destructive mx-auto mb-1" />
          <p className="text-lg font-bold">{stats.cancelled}</p>
          <p className="text-[10px] text-muted-foreground">Cancelled</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <TrendingUp className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold">{stats.cancelRate.toFixed(1)}%</p>
          <p className="text-[10px] text-muted-foreground">Cancel Rate</p>
        </div>
      </div>

      {/* Platform stats */}
      <div className="p-4 rounded-xl bg-card border border-border space-y-3">
        <h3 className="text-sm font-semibold tracking-wide">Platform Stats</h3>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground flex items-center gap-2"><Banknote className="h-3.5 w-3.5" />Total Revenue</span>
          <span className="font-semibold">R{stats.totalRevenue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground flex items-center gap-2"><Truck className="h-3.5 w-3.5" />Total Delivery Fees</span>
          <span className="font-semibold">R{stats.totalDeliveryFees.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground flex items-center gap-2"><ShoppingBag className="h-3.5 w-3.5" />Total Orders</span>
          <span className="font-semibold">{stats.totalOrders}</span>
        </div>
        <div className="border-t border-border my-2" />
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground flex items-center gap-2"><Store className="h-3.5 w-3.5" />Restaurants</span>
          <span className="font-semibold">{stats.activeRestaurants}/{stats.totalRestaurants} active</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground flex items-center gap-2"><Users className="h-3.5 w-3.5" />Users</span>
          <span className="font-semibold">{stats.uniqueUsers}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground flex items-center gap-2"><Truck className="h-3.5 w-3.5" />Drivers</span>
          <span className="font-semibold">{stats.drivers}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground flex items-center gap-2"><Store className="h-3.5 w-3.5" />Restaurant Owners</span>
          <span className="font-semibold">{stats.owners}</span>
        </div>
      </div>
    </div>
  );
}
