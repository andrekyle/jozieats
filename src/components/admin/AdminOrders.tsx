import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function AdminOrders() {
  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, restaurants(name)")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">Recent Orders ({orders.length})</h2>
      {orders.map((order) => (
        <div key={order.id} className="p-3 rounded-lg bg-card border border-border">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium">#{order.id.slice(0, 8)}</p>
              <p className="text-xs text-muted-foreground">{(order as any).restaurants?.name}</p>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${
              order.status === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : order.status === "cancelled" ? "bg-destructive/10 text-destructive"
              : "bg-primary/10 text-primary"
            }`}>
              {order.status.replace(/_/g, " ")}
            </span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground flex justify-between">
            <span>R{Number(order.total_price).toFixed(2)}</span>
            <span>{new Date(order.created_at).toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
