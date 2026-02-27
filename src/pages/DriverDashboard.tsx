import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, Truck, Package, Banknote, LogOut, MapPin, Navigation, Phone, Clock, CheckCircle2, ArrowRight, Home, CalendarDays, TrendingUp, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

const STATUS_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  ready_for_pickup: { label: "Ready for Pickup", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  out_for_delivery: { label: "Out for Delivery", color: "text-[#1A6FDB]", bg: "bg-[#1A6FDB]/10" },
};

export default function DriverDashboard() {
  const { user, hasRole, signOut, loading } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"available" | "active" | "earnings">("available");

  useEffect(() => {
    const channel = supabase
      .channel("driver-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        queryClient.invalidateQueries({ queryKey: ["driver"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  const { data: available = [] } = useQuery({
    queryKey: ["driver", "available"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, restaurants(name, address)")
        .eq("status", "ready_for_pickup")
        .is("driver_id", null)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });

  const { data: active = [] } = useQuery({
    queryKey: ["driver", "active", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, restaurants(name, address), profiles:customer_id(full_name, phone)")
        .eq("driver_id", user!.id)
        .in("status", ["ready_for_pickup", "out_for_delivery"])
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: deliveryHistory = [] } = useQuery({
    queryKey: ["driver", "history", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("delivery_fee, created_at, status, total_price, restaurants(name)")
        .eq("driver_id", user!.id)
        .in("status", ["delivered", "cancelled"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const earnings = useMemo(() => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];
    const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();

    const delivered = deliveryHistory.filter((o) => o.status === "delivered");
    const todayDelivered = delivered.filter((o) => o.created_at >= today);
    const weekDelivered = delivered.filter((o) => o.created_at >= weekAgo);

    const todayEarnings = todayDelivered.reduce((s, o) => s + Number(o.delivery_fee), 0);
    const weekEarnings = weekDelivered.reduce((s, o) => s + Number(o.delivery_fee), 0);
    const totalEarnings = delivered.reduce((s, o) => s + Number(o.delivery_fee), 0);
    const totalDeliveries = delivered.length;
    const todayTrips = todayDelivered.length;
    const avgPerDelivery = totalDeliveries > 0 ? totalEarnings / totalDeliveries : 0;

    // Daily breakdown for last 7 days
    const dailyData: { label: string; earnings: number; trips: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const dateStr = d.toISOString().split("T")[0];
      const dayLabel = d.toLocaleDateString("en-ZA", { weekday: "short" });
      const dayOrders = delivered.filter((o) => o.created_at.startsWith(dateStr));
      dailyData.push({
        label: dayLabel,
        earnings: dayOrders.reduce((s, o) => s + Number(o.delivery_fee), 0),
        trips: dayOrders.length,
      });
    }

    return { todayEarnings, weekEarnings, totalEarnings, totalDeliveries, todayTrips, avgPerDelivery, dailyData };
  }, [deliveryHistory]);

  const claimOrder = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase.from("orders").update({ driver_id: user!.id }).eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver"] });
      toast.success("Order claimed!");
      setTab("active");
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      queryClient.invalidateQueries({ queryKey: ["driver"] });
      toast.success(vars.status === "delivered" ? "Delivery complete! 🎉" : "Status updated");
    },
  });

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!hasRole("driver") && !hasRole("admin")) return <Navigate to="/" replace />;

  const maxDayEarnings = Math.max(...earnings.dailyData.map((d) => d.earnings), 1);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-30 glass px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => navigate("/")}>
            <Home className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-lg font-bold tracking-wide">Driver</h1>
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground font-light tracking-wide">Delivery Dashboard</p>
              {active.length > 0 && (
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              )}
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
      </div>

      <div className="px-4 mt-4">
        {/* ===== AVAILABLE TAB ===== */}
        {tab === "available" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-wide">Available Deliveries</h2>
              {available.length > 0 && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 animate-pulse">
                  {available.length} available
                </span>
              )}
            </div>

            {available.length === 0 ? (
              <div className="text-center py-16">
                <Package className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No deliveries available</p>
                <p className="text-xs text-muted-foreground/60 mt-1">New orders will appear here in real time</p>
              </div>
            ) : available.map((order, i) => {
              const timeSince = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="p-4 rounded-xl bg-card border border-green-500/30 hover:border-green-500/50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm">{(order as any).restaurants?.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{(order as any).restaurants?.address}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-green-600 dark:text-green-400">
                        R{Number(order.delivery_fee).toFixed(2)}
                      </span>
                      <p className="text-[10px] text-muted-foreground mt-0.5">delivery fee</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <Navigation className="h-3 w-3 text-primary" />
                      <span className="font-medium text-foreground">Drop-off:</span> {order.delivery_address}
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Banknote className="h-3 w-3" />
                        Order total: R{Number(order.total_price).toFixed(2)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {timeSince < 1 ? "Just now" : `${timeSince}m ago`}
                      </span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    className="mt-3 w-full rounded-lg font-semibold tracking-wide uppercase text-xs"
                    onClick={() => claimOrder.mutate(order.id)}
                    disabled={claimOrder.isPending}
                  >
                    {claimOrder.isPending ? "Claiming..." : "Accept Delivery"}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ===== ACTIVE TAB ===== */}
        {tab === "active" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold tracking-wide">Active Deliveries</h2>
              {active.length > 0 && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1A6FDB]/10 text-[#1A6FDB]">
                  {active.length} active
                </span>
              )}
            </div>

            {active.length === 0 ? (
              <div className="text-center py-16">
                <Truck className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-muted-foreground">No active deliveries</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Accept a delivery from the Available tab</p>
              </div>
            ) : active.map((order, i) => {
              const badge = STATUS_BADGE[order.status] || STATUS_BADGE.ready_for_pickup;
              const timeSince = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);

              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className={`p-4 rounded-xl bg-card border ${
                    order.status === "out_for_delivery" ? "border-[#1A6FDB]/40" : "border-amber-500/40"
                  }`}
                >
                  {/* Status badge */}
                  <div className="flex justify-between items-start mb-3">
                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${badge.color} ${badge.bg}`}>
                      {order.status === "ready_for_pickup" ? <Package className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
                      {badge.label}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />{timeSince}m
                    </span>
                  </div>

                  {/* Restaurant */}
                  <p className="font-semibold text-sm">{(order as any).restaurants?.name}</p>

                  {/* Route details */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-start gap-2 text-xs">
                      <div className="mt-0.5 flex flex-col items-center gap-0.5">
                        <MapPin className="h-3.5 w-3.5 text-amber-500" />
                        <div className="w-px h-4 bg-border" />
                        <Navigation className="h-3.5 w-3.5 text-green-500" />
                      </div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">Pickup</p>
                          <p className="font-medium">{(order as any).restaurants?.address}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">Drop-off</p>
                          <p className="font-medium">{order.delivery_address}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer info */}
                  <div className="mt-3 pt-3 border-t border-border flex justify-between items-center text-xs">
                    <div>
                      <span className="text-muted-foreground">Customer: </span>
                      <span className="font-medium">{(order as any).profiles?.full_name || "Customer"}</span>
                    </div>
                    {(order as any).profiles?.phone && (
                      <a href={`tel:${(order as any).profiles.phone}`} className="flex items-center gap-1 text-primary font-medium">
                        <Phone className="h-3 w-3" />Call
                      </a>
                    )}
                  </div>

                  {/* Earnings */}
                  <div className="mt-2 flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Delivery fee</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">R{Number(order.delivery_fee).toFixed(2)}</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mt-3">
                    {order.status === "ready_for_pickup" && (
                      <Button
                        size="sm"
                        className="flex-1 rounded-lg font-semibold tracking-wide uppercase text-xs"
                        onClick={() => updateStatus.mutate({ orderId: order.id, status: "out_for_delivery" })}
                        disabled={updateStatus.isPending}
                      >
                        <Package className="h-3.5 w-3.5 mr-1.5" />Picked Up
                      </Button>
                    )}
                    {order.status === "out_for_delivery" && (
                      <Button
                        size="sm"
                        className="flex-1 rounded-lg font-semibold tracking-wide uppercase text-xs bg-green-600 hover:bg-green-700"
                        onClick={() => updateStatus.mutate({ orderId: order.id, status: "delivered" })}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Mark Delivered
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* ===== EARNINGS TAB ===== */}
        {tab === "earnings" && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold tracking-wide">Earnings</h2>

            {/* Top cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Today", value: `R${earnings.todayEarnings.toFixed(2)}`, sub: `${earnings.todayTrips} trips`, icon: Banknote, color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
                { label: "This Week", value: `R${earnings.weekEarnings.toFixed(2)}`, sub: "last 7 days", icon: CalendarDays, color: "text-[#1A6FDB]", bg: "bg-[#1A6FDB]/10" },
                { label: "Total Earnings", value: `R${earnings.totalEarnings.toFixed(2)}`, sub: "all time", icon: TrendingUp, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
                { label: "Avg per Trip", value: `R${earnings.avgPerDelivery.toFixed(2)}`, sub: `${earnings.totalDeliveries} trips`, icon: Truck, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
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
                  <p className="text-[10px] text-muted-foreground/60">{card.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Weekly chart */}
            <div className="p-4 rounded-xl bg-card border border-border">
              <h3 className="text-sm font-semibold tracking-wide mb-4">Last 7 Days</h3>
              <div className="flex items-end gap-2 h-28">
                {earnings.dailyData.map((day) => (
                  <div key={day.label} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {day.earnings > 0 ? `R${day.earnings.toFixed(0)}` : "—"}
                    </span>
                    <div className="w-full rounded-t-md bg-secondary relative overflow-hidden" style={{ height: "100%" }}>
                      <motion.div
                        className="absolute bottom-0 w-full bg-green-500/70 dark:bg-green-400/70 rounded-t-md"
                        initial={{ height: 0 }}
                        animate={{ height: `${(day.earnings / maxDayEarnings) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-[10px] text-muted-foreground">{day.label}</span>
                      {day.trips > 0 && (
                        <p className="text-[9px] text-muted-foreground/50">{day.trips} trips</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent deliveries */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold tracking-wide">Recent Deliveries</h3>
              {deliveryHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No deliveries yet</p>
              ) : (
                deliveryHistory.slice(0, 10).map((order) => (
                  <div key={order.created_at + order.total_price} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      order.status === "delivered" ? "bg-green-500/10" : "bg-destructive/10"
                    }`}>
                      {order.status === "delivered" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{(order as any).restaurants?.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(order.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })} · {new Date(order.created_at).toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    <span className={`text-sm font-semibold ${order.status === "delivered" ? "text-green-600 dark:text-green-400" : "text-destructive"}`}>
                      {order.status === "delivered" ? `+R${Number(order.delivery_fee).toFixed(2)}` : "Cancelled"}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass safe-bottom">
        <div className="flex items-center justify-around py-2">
          {[
            { id: "available" as const, label: "Available", icon: Package, badge: available.length },
            { id: "active" as const, label: "Active", icon: Truck, badge: active.length },
            { id: "earnings" as const, label: "Earnings", icon: Banknote, badge: 0 },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 relative transition-colors ${tab === t.id ? "text-primary" : "text-muted-foreground"}`}
            >
              <div className="relative">
                <t.icon className="h-5 w-5" />
                {t.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {t.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
