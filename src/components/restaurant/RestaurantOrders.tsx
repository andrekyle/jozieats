import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";
import { Clock, CheckCircle2, ChefHat, Package, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string; bg: string; actions: { label: string; next: OrderStatus; variant?: "default" | "outline" | "destructive" }[] }> = {
  pending: {
    label: "New Order", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10",
    actions: [{ label: "Accept Order", next: "accepted" }, { label: "Reject", next: "cancelled", variant: "outline" }],
  },
  accepted: {
    label: "Accepted", icon: CheckCircle2, color: "text-[#1A6FDB]", bg: "bg-[#1A6FDB]/10",
    actions: [{ label: "Start Preparing", next: "preparing" }],
  },
  preparing: {
    label: "Preparing", icon: ChefHat, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10",
    actions: [{ label: "Ready for Pickup", next: "ready_for_pickup" }],
  },
  ready_for_pickup: {
    label: "Ready", icon: Package, color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10",
    actions: [],
  },
};

export default function RestaurantOrders({ restaurantId }: { restaurantId: string }) {
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ["restaurant-orders", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, profiles:customer_id(full_name, phone)")
        .eq("restaurant_id", restaurantId)
        .in("status", ["pending", "accepted", "preparing", "ready_for_pickup"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("restaurant-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders", filter: `restaurant_id=eq.${restaurantId}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["restaurant-orders", restaurantId] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [restaurantId, queryClient]);

  const updateStatus = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: OrderStatus }) => {
      const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant-orders"] });
      toast.success("Order updated");
    },
  });

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-wide">Active Orders</h2>
        {pendingCount > 0 && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse">
            {pendingCount} new
          </span>
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No active orders</p>
          <p className="text-xs text-muted-foreground/60 mt-0.5">New orders will appear here in real time</p>
        </div>
      ) : (
        orders.map((order, i) => {
          const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
          const StatusIcon = config.icon;
          const timeSince = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`p-4 rounded-xl bg-card border ${order.status === "pending" ? "border-amber-500/40" : "border-border"}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {(order as any).profiles?.full_name || "Customer"}
                    {(order as any).profiles?.phone && ` · ${(order as any).profiles.phone}`}
                  </p>
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${config.color} ${config.bg}`}>
                  <StatusIcon className="h-3 w-3" />
                  {config.label}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-border space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-semibold">R{Number(order.total_price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Delivery to</span>
                  <span className="text-right max-w-[60%] truncate">{order.delivery_address}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Time</span>
                  <span>{timeSince < 1 ? "Just now" : `${timeSince} min ago`}</span>
                </div>
                {order.special_instructions && (
                  <div className="mt-2 px-3 py-2 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Note: </span>{order.special_instructions}
                  </div>
                )}
              </div>

              {config.actions.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {config.actions.map((a) => (
                    <Button
                      key={a.next}
                      size="sm"
                      variant={a.variant || "default"}
                      className={`flex-1 rounded-lg text-xs font-semibold tracking-wide ${a.next === "cancelled" ? "text-destructive" : ""}`}
                      onClick={() => updateStatus.mutate({ orderId: order.id, status: a.next })}
                    >
                      {a.label}
                    </Button>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })
      )}
    </div>
  );
}
