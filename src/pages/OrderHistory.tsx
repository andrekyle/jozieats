import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function OrderHistory() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: orders = [] } = useQuery({
    queryKey: ["my-orders", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, restaurants(name)")
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-30 glass px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold tracking-wide">Order History</h1>
      </div>

      <div className="px-4 mt-4 space-y-3">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          orders.map((order) => (
            <motion.button
              key={order.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/order/${order.id}`)}
              className="w-full p-4 rounded-lg bg-card border border-border text-left"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{(order as any).restaurants?.name || "Restaurant"}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(order.created_at).toLocaleDateString()} · R{Number(order.total_price).toFixed(2)}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  order.status === "delivered" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : order.status === "cancelled" ? "bg-destructive/10 text-destructive"
                  : "bg-primary/10 text-primary"
                }`}>
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
