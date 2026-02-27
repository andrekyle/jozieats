import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";
import type { Database } from "@/integrations/supabase/types";

type OrderStatus = Database["public"]["Enums"]["order_status"];

const STATUS_ACTIONS: Record<string, { label: string; next: OrderStatus }[]> = {
  pending: [{ label: "Accept", next: "accepted" }, { label: "Reject", next: "cancelled" }],
  accepted: [{ label: "Start Preparing", next: "preparing" }],
  preparing: [{ label: "Ready for Pickup", next: "ready_for_pickup" }],
};

export default function RestaurantOrders({ restaurantId }: { restaurantId: string }) {
  const queryClient = useQueryClient();

  const { data: orders = [] } = useQuery({
    queryKey: ["restaurant-orders", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, profiles:customer_id(full_name)")
        .eq("restaurant_id", restaurantId)
        .in("status", ["pending", "accepted", "preparing", "ready_for_pickup"])
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Realtime
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

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">Active Orders ({orders.length})</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-8">No active orders</p>
      ) : (
        orders.map((order) => {
          const actions = STATUS_ACTIONS[order.status] || [];
          return (
            <div key={order.id} className="p-4 rounded-lg bg-card border border-border">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{(order as any).profiles?.full_name || "Customer"}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  order.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  : "bg-primary/10 text-primary"
                }`}>
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                <p>R{Number(order.total_price).toFixed(2)} · {order.delivery_address}</p>
              </div>
              {actions.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {actions.map((a) => (
                    <Button
                      key={a.next}
                      size="sm"
                      variant={a.next === "cancelled" ? "outline" : "default"}
                      className="rounded-lg text-xs"
                      onClick={() => updateStatus.mutate({ orderId: order.id, status: a.next })}
                    >
                      {a.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
