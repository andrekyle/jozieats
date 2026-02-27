import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { Loader2, Truck, Package, DollarSign, LogOut, MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

export default function DriverDashboard() {
  const { user, hasRole, signOut, loading } = useAuth();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"available" | "active" | "earnings">("available");

  // Realtime
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
        .select("*, restaurants(name, address)")
        .eq("driver_id", user!.id)
        .in("status", ["ready_for_pickup", "out_for_delivery"])
        .order("created_at");
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: earnings } = useQuery({
    queryKey: ["driver", "earnings", user?.id],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("orders")
        .select("delivery_fee, created_at")
        .eq("driver_id", user!.id)
        .eq("status", "delivered");

      const todayEarnings = data?.filter((o) => o.created_at >= today).reduce((s, o) => s + Number(o.delivery_fee), 0) || 0;
      const totalEarnings = data?.reduce((s, o) => s + Number(o.delivery_fee), 0) || 0;
      const totalDeliveries = data?.length || 0;
      return { todayEarnings, totalEarnings, totalDeliveries };
    },
    enabled: !!user,
  });

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driver"] });
      toast.success("Status updated");
    },
  });

  if (loading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!hasRole("driver") && !hasRole("admin")) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-30 glass px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-wide">Driver</h1>
          <p className="text-xs text-muted-foreground font-light tracking-wide">Delivery Dashboard</p>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={signOut}><LogOut className="h-4 w-4" /></Button>
      </div>

      <div className="px-4 mt-4">
        {tab === "available" && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold tracking-wide">Available Deliveries ({available.length})</h2>
            {available.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No deliveries available right now</p>
            ) : available.map((order) => (
              <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 rounded-lg bg-card border border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">{(order as any).restaurants?.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" />{(order as any).restaurants?.address}</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">R{Number(order.delivery_fee).toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1"><Navigation className="h-3 w-3" />{order.delivery_address}</p>
                <Button size="sm" className="mt-3 w-full rounded-lg" onClick={() => claimOrder.mutate(order.id)}>Accept Delivery</Button>
              </motion.div>
            ))}
          </div>
        )}

        {tab === "active" && (
          <div className="space-y-3">
            <h2 className="text-base font-semibold tracking-wide">Active Deliveries ({active.length})</h2>
            {active.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No active deliveries</p>
            ) : active.map((order) => (
              <div key={order.id} className="p-4 rounded-lg bg-card border border-border">
                <p className="font-medium text-sm">{(order as any).restaurants?.name}</p>
                <p className="text-xs text-muted-foreground mt-1">Pickup: {(order as any).restaurants?.address}</p>
                <p className="text-xs text-muted-foreground">Dropoff: {order.delivery_address}</p>
                <p className="text-xs mt-1">Status: <span className="font-medium text-primary">{order.status.replace(/_/g, " ")}</span></p>
                <div className="flex gap-2 mt-3">
                  {order.status === "ready_for_pickup" && (
                    <Button size="sm" className="flex-1 rounded-lg" onClick={() => updateStatus.mutate({ orderId: order.id, status: "out_for_delivery" })}>Picked Up</Button>
                  )}
                  {order.status === "out_for_delivery" && (
                    <Button size="sm" className="flex-1 rounded-lg" onClick={() => updateStatus.mutate({ orderId: order.id, status: "delivered" })}>Delivered</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "earnings" && (
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 rounded-lg bg-card border border-border">
              <DollarSign className="h-5 w-5 text-primary mb-2" />
              <p className="text-2xl font-bold">R{(earnings?.todayEarnings || 0).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Today's Earnings</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <DollarSign className="h-5 w-5 text-primary mb-2" />
              <p className="text-2xl font-bold">R{(earnings?.totalEarnings || 0).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Total Earnings</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <Truck className="h-5 w-5 text-primary mb-2" />
              <p className="text-2xl font-bold">{earnings?.totalDeliveries || 0}</p>
              <p className="text-xs text-muted-foreground">Total Deliveries</p>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 glass safe-bottom">
        <div className="flex items-center justify-around py-2">
          {[
            { id: "available" as const, label: "Available", icon: Package },
            { id: "active" as const, label: "Active", icon: Truck },
            { id: "earnings" as const, label: "Earnings", icon: DollarSign },
          ].map((t) => (
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
