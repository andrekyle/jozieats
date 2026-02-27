import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, TrendingUp, Clock, CheckCircle2, XCircle, Banknote, CalendarDays, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

export default function RestaurantAnalytics({ restaurantId }: { restaurantId: string }) {
  const { data: orders = [] } = useQuery({
    queryKey: ["restaurant-analytics", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("total_price, delivery_fee, status, created_at")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const stats = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
    const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

    const delivered = orders.filter((o) => o.status === "delivered");
    const cancelled = orders.filter((o) => o.status === "cancelled");
    const todayOrders = orders.filter((o) => o.created_at >= today);
    const weekOrders = orders.filter((o) => o.created_at >= weekAgo);
    const monthOrders = orders.filter((o) => o.created_at >= monthAgo);

    const todayRevenue = todayOrders.reduce((s, o) => s + Number(o.total_price), 0);
    const weekRevenue = weekOrders.filter((o) => o.status === "delivered").reduce((s, o) => s + Number(o.total_price), 0);
    const monthRevenue = monthOrders.filter((o) => o.status === "delivered").reduce((s, o) => s + Number(o.total_price), 0);
    const totalRevenue = delivered.reduce((s, o) => s + Number(o.total_price), 0);
    const avgOrderValue = delivered.length > 0 ? totalRevenue / delivered.length : 0;
    const cancelRate = orders.length > 0 ? (cancelled.length / orders.length) * 100 : 0;

    // Daily orders for last 7 days
    const dailyData: { label: string; count: number; revenue: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-ZA", { weekday: "short" });
      const dayOrders = orders.filter((o) => o.created_at.startsWith(dateStr));
      dailyData.push({
        label: dayLabel,
        count: dayOrders.length,
        revenue: dayOrders.filter((o) => o.status === "delivered").reduce((s, o) => s + Number(o.total_price), 0),
      });
    }

    // Popular hours
    const hourCounts: Record<number, number> = {};
    orders.forEach((o) => {
      const h = new Date(o.created_at).getHours();
      hourCounts[h] = (hourCounts[h] || 0) + 1;
    });
    const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
    const peakHourLabel = peakHour ? `${String(Number(peakHour[0])).padStart(2, "0")}:00` : "—";

    return {
      todayOrders: todayOrders.length,
      todayRevenue,
      weekOrders: weekOrders.length,
      weekRevenue,
      monthRevenue,
      totalRevenue,
      totalDelivered: delivered.length,
      totalOrders: orders.length,
      avgOrderValue,
      cancelRate,
      dailyData,
      peakHourLabel,
    };
  }, [orders]);

  const maxCount = Math.max(...stats.dailyData.map((d) => d.count), 1);

  return (
    <div className="space-y-5">
      <h2 className="text-base font-semibold tracking-wide">Analytics</h2>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Today's Orders", value: stats.todayOrders, icon: ShoppingBag, color: "text-[#1A6FDB]", bg: "bg-[#1A6FDB]/10" },
          { label: "Today's Revenue", value: `R${stats.todayRevenue.toFixed(2)}`, icon: Banknote, color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
          { label: "This Week", value: `R${stats.weekRevenue.toFixed(2)}`, icon: CalendarDays, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
          { label: "This Month", value: `R${stats.monthRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
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
          <span className="text-sm font-semibold tracking-wide">Last 7 Days</span>
        </div>
        <div className="flex items-end gap-2 h-32">
          {stats.dailyData.map((day) => (
            <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] font-medium text-muted-foreground">{day.count}</span>
              <div className="w-full rounded-t-md bg-secondary relative overflow-hidden" style={{ height: "100%" }}>
                <motion.div
                  className="absolute bottom-0 w-full bg-primary/80 rounded-t-md"
                  initial={{ height: 0 }}
                  animate={{ height: `${(day.count / maxCount) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">{day.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mx-auto mb-1" />
          <p className="text-lg font-bold">{stats.totalDelivered}</p>
          <p className="text-[10px] text-muted-foreground">Delivered</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <Clock className="h-4 w-4 text-[#1A6FDB] mx-auto mb-1" />
          <p className="text-lg font-bold">R{stats.avgOrderValue.toFixed(0)}</p>
          <p className="text-[10px] text-muted-foreground">Avg Order</p>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border text-center">
          <XCircle className="h-4 w-4 text-destructive mx-auto mb-1" />
          <p className="text-lg font-bold">{stats.cancelRate.toFixed(1)}%</p>
          <p className="text-[10px] text-muted-foreground">Cancelled</p>
        </div>
      </div>

      {/* Extra insights */}
      <div className="p-4 rounded-xl bg-card border border-border space-y-3">
        <h3 className="text-sm font-semibold tracking-wide">Insights</h3>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total Revenue (all time)</span>
          <span className="font-semibold">R{stats.totalRevenue.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Total Orders</span>
          <span className="font-semibold">{stats.totalOrders}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Peak Hour</span>
          <span className="font-semibold">{stats.peakHourLabel}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Week Orders</span>
          <span className="font-semibold">{stats.weekOrders}</span>
        </div>
      </div>
    </div>
  );
}
