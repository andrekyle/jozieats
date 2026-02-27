import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { ArrowLeft, CheckCircle2, Clock, ChefHat, Truck, Package, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

const STEPS = [
  { status: "pending", label: "Order Placed", icon: Clock },
  { status: "accepted", label: "Accepted", icon: CheckCircle2 },
  { status: "preparing", label: "Preparing", icon: ChefHat },
  { status: "ready_for_pickup", label: "Ready", icon: Package },
  { status: "out_for_delivery", label: "On the Way", icon: Truck },
  { status: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: order } = useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", order?.restaurant_id],
    queryFn: async () => {
      const { data } = await supabase.from("restaurants").select("name").eq("id", order!.restaurant_id).single();
      return data;
    },
    enabled: !!order?.restaurant_id,
  });

  // Realtime subscription
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`order-${id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["order", id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id, queryClient]);

  const currentIndex = STEPS.findIndex((s) => s.status === order?.status);
  const isCancelled = order?.status === "cancelled";

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-30 glass px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" onClick={() => navigate("/")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold tracking-wide">Order Status</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-4 mt-6">
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-semibold">{restaurant?.name || "Restaurant"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Order #{id?.slice(0, 8)}</p>
            </div>
            {isCancelled && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-destructive/10 text-destructive">Cancelled</span>
            )}
          </div>

          {!isCancelled && (
            <div className="space-y-4">
              {STEPS.map((step, i) => {
                const done = i <= currentIndex;
                const active = i === currentIndex;
                return (
                  <div key={step.status} className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      done ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                    } ${active ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}>
                      <step.icon className="h-4 w-4" />
                    </div>
                    <span className={`text-sm ${done ? "font-medium" : "text-muted-foreground"}`}>{step.label}</span>
                    {active && <span className="ml-auto text-xs text-primary font-medium animate-pulse">Current</span>}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-border text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Total</span><span className="font-semibold">R{Number(order?.total_price || 0).toFixed(2)}</span></div>
            <div className="flex justify-between mt-1"><span className="text-muted-foreground">Delivery to</span><span className="text-right max-w-[60%]">{order?.delivery_address}</span></div>
          </div>

          {/* Report a Problem */}
          <div className="mt-4 pt-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full rounded-lg text-sm font-medium gap-2"
              onClick={() => navigate(`/report-problem/${id}`)}
            >
              <AlertTriangle className="h-4 w-4" />
              Report a Problem
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
