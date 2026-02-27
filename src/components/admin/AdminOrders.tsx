import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Clock, CheckCircle2, ChefHat, Package, Truck, XCircle, ShoppingBag, MapPin, Banknote } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_CONFIG: Record<string, { label: string; icon: typeof Clock; color: string; bg: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  accepted: { label: "Accepted", icon: CheckCircle2, color: "text-[#1A6FDB]", bg: "bg-[#1A6FDB]/10" },
  preparing: { label: "Preparing", icon: ChefHat, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
  ready_for_pickup: { label: "Ready", icon: Package, color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10" },
  out_for_delivery: { label: "On the way", icon: Truck, color: "text-[#1A6FDB]", bg: "bg-[#1A6FDB]/10" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-destructive", bg: "bg-destructive/10" },
};

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, restaurants(name), profiles:customer_id(full_name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data;
    },
  });

  const filtered = useMemo(() => {
    let result = orders;
    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }
    if (search) {
      result = result.filter((o) =>
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        ((o as any).restaurants?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        ((o as any).profiles?.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
        o.delivery_address.toLowerCase().includes(search.toLowerCase())
      );
    }
    return result;
  }, [orders, search, statusFilter]);

  // Status count summary
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => { counts[o.status] = (counts[o.status] || 0) + 1; });
    return counts;
  }, [orders]);

  const activeCount = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold tracking-wide">Orders</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {orders.length} recent · <span className="text-amber-600 dark:text-amber-400">{activeCount} active</span>
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by ID, restaurant, customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-lg"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 rounded-lg text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <SelectItem key={key} value={key}>
                {cfg.label} ({statusCounts[key] || 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-1.5">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = statusCounts[key] || 0;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
              className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full transition-colors ${
                statusFilter === key ? `${cfg.bg} ${cfg.color}` : "bg-secondary text-muted-foreground"
              }`}
            >
              <cfg.icon className="h-3 w-3" />
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {search || statusFilter !== "all" ? "No orders match your filters" : "No orders yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((order, i) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const StatusIcon = config.icon;
            const timeSince = Math.floor((Date.now() - new Date(order.created_at).getTime()) / 60000);

            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className={`p-4 rounded-xl bg-card border ${
                  !["delivered", "cancelled"].includes(order.status) ? "border-amber-500/20" : "border-border"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-semibold">#{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {(order as any).restaurants?.name}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${config.color} ${config.bg}`}>
                    <StatusIcon className="h-3 w-3" />
                    {config.label}
                  </span>
                </div>

                {/* Details */}
                <div className="mt-3 pt-3 border-t border-border space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium">{(order as any).profiles?.full_name || "—"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total</span>
                    <span className="font-semibold">R{Number(order.total_price).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Delivery Fee</span>
                    <span>R{Number(order.delivery_fee).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" />Address</span>
                    <span className="text-right max-w-[55%] truncate">{order.delivery_address}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Time</span>
                    <span>
                      {timeSince < 60
                        ? `${timeSince}m ago`
                        : timeSince < 1440
                        ? `${Math.floor(timeSince / 60)}h ago`
                        : new Date(order.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })
                      }
                    </span>
                  </div>
                  {order.driver_id && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Driver</span>
                      <span className="font-medium text-green-600 dark:text-green-400">Assigned</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
