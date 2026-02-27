import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Clock, CheckCircle2, XCircle, AlertTriangle, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const REASON_LABELS: Record<string, string> = {
  not_delivered: "Order not delivered",
  wrong_items: "Wrong items received",
  missing_items: "Missing items",
  food_quality: "Food quality issue",
  significant_delay: "Significant delay",
  other: "Other",
};

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending: { label: "Pending Review", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  reviewing: { label: "Under Review", icon: Search, color: "text-[#1A6FDB]", bg: "bg-[#1A6FDB]/10" },
  approved: { label: "Approved", icon: CheckCircle2, color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
  denied: { label: "Denied", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

export default function MyRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["my-refund-requests", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("refund_requests" as any)
        .select("*")
        .eq("customer_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const rows = data as any[];
      if (rows.length === 0) return [];

      const orderIds = rows.map((r: any) => r.order_id);
      const { data: orders } = await supabase
        .from("orders")
        .select("id, total_price, created_at, restaurants(name)")
        .in("id", orderIds);

      const orderMap = new Map((orders || []).map((o: any) => [o.id, o]));

      return rows.map((req: any) => ({
        ...req,
        order: orderMap.get(req.order_id) || null,
      }));
    },
    enabled: !!user,
  });

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" className="rounded-lg shrink-0" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-semibold tracking-wide">My Requests</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 mt-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-16">
            <AlertTriangle className="h-12 w-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm font-medium text-muted-foreground">No requests yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              If something goes wrong with an order, you can report it here
            </p>
            <Button variant="outline" className="mt-4 rounded-lg text-sm" onClick={() => navigate("/orders")}>
              View Orders
            </Button>
          </div>
        ) : (
          requests.map((req: any, i: number) => {
            const status = STATUS_CONFIG[req.status] || STATUS_CONFIG.pending;
            const StatusIcon = status.icon;
            return (
              <motion.button
                key={req.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => navigate(`/report-problem/${req.order_id}`)}
                className="w-full rounded-xl bg-card border border-border p-4 text-left hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {req.order?.restaurants?.name || "Restaurant"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Order #{req.order_id?.slice(0, 8)} ·{" "}
                      {new Date(req.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full shrink-0 ${status.color} ${status.bg}`}>
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>

                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground">
                      {REASON_LABELS[req.reason] || req.reason}
                    </p>
                    {req.description && (
                      <p className="text-xs text-muted-foreground/60 mt-0.5 truncate">{req.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {req.refund_amount != null && (
                      <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                        R{Number(req.refund_amount).toFixed(2)}
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>

                {req.admin_notes && (
                  <div className="mt-2 px-3 py-2 rounded-lg bg-secondary/50 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">Response: </span>
                    {req.admin_notes}
                  </div>
                )}

                {req.photo_urls && req.photo_urls.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {req.photo_urls.slice(0, 4).map((url: string, j: number) => (
                      <div key={j} className="h-12 w-12 rounded-lg overflow-hidden border border-border">
                        <img src={url} alt="" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
