import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Package,
  RotateCcw,
  Sun,
  Moon,
  Monitor,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  Edit2,
  Save,
  Loader2,
  Shield,
  HelpCircle,
  FileText,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { user, profile, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState("");
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  // Fetch orders summary
  const { data: orders = [] } = useQuery({
    queryKey: ["profile-orders", user?.id],
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

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;
  const activeOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status)
  ).length;
  const totalSpent = orders
    .filter((o) => o.status === "delivered")
    .reduce((sum, o) => sum + Number(o.total_price), 0);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone: phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
      if (error) throw error;
      toast({ title: "Profile updated", description: "Your details have been saved." });
      setEditing(false);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const recentOrders = orders.slice(0, 5);

  const initials = profile?.full_name
    ? profile.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "JE";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A6FDB] via-[#1560C0] to-[#0D3F80]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />

        <div className="relative safe-top px-4 pt-4 pb-8">
          {/* Nav */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/")}
              className="h-9 w-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition-colors"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
            </button>
            <h1 className="text-base font-semibold tracking-wide text-white/90">
              Account
            </h1>
            <div className="w-9" />
          </div>

          {/* Profile Info */}
          <div className="flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-white tracking-wide">
              {profile?.full_name || "Jozi Eater"}
            </h2>
            <p className="text-sm text-white/70 mt-0.5">{user?.email}</p>
            <p className="text-xs text-white/50 mt-1">
              Member since{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-ZA", {
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </div>

        {/* Stats Row - overlapping the hero */}
        <div className="relative px-4 -mb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="grid grid-cols-3 gap-2 bg-card rounded-xl border border-border p-1 shadow-lg"
          >
            <div className="p-3 text-center">
              <p className="text-xl font-bold text-[#1A6FDB]">{totalOrders}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                Orders
              </p>
            </div>
            <div className="p-3 text-center border-x border-border">
              <p className="text-xl font-bold text-emerald-500">{deliveredOrders}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                Delivered
              </p>
            </div>
            <div className="p-3 text-center">
              <p className="text-xl font-bold">R{totalSpent.toFixed(0)}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                Spent
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-14 pb-12 space-y-4">

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold tracking-wide text-xs uppercase text-muted-foreground">
              Contact Details
            </h3>
            <button
              onClick={() => {
                if (editing) {
                  handleSaveProfile();
                } else {
                  setFullName(profile?.full_name || "");
                  setPhone(profile?.phone || "");
                  setEditing(true);
                }
              }}
              className="text-xs font-medium text-[#1A6FDB] flex items-center gap-1 hover:text-[#1560C0] transition-colors"
            >
              {saving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : editing ? (
                <>
                  <Save className="h-3 w-3" /> Save
                </>
              ) : (
                <>
                  <Edit2 className="h-3 w-3" /> Edit
                </>
              )}
            </button>
          </div>

          <div className="divide-y divide-border">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Name</p>
                {editing ? (
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-8 mt-0.5 rounded-lg bg-secondary/50 border-border text-sm px-2"
                  />
                ) : (
                  <p className="text-sm font-medium truncate">{profile?.full_name || "—"}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Email</p>
                <p className="text-sm font-medium truncate">{user?.email || "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Phone</p>
                {editing ? (
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+27 82 123 4567"
                    className="h-8 mt-0.5 rounded-lg bg-secondary/50 border-border text-sm px-2"
                  />
                ) : (
                  <p className="text-sm font-medium">{profile?.phone || "Not set"}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Delivery & Payment */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold tracking-wide text-xs uppercase text-muted-foreground">
              Delivery & Payment
            </h3>
          </div>

          <div className="divide-y divide-border">
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Delivery Address</p>
                <p className="text-xs text-muted-foreground truncate">
                  {orders.length > 0 && orders[0].delivery_address
                    ? orders[0].delivery_address
                    : "No saved address"}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </div>

            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Banknote className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Cash on Delivery</p>
                <p className="text-xs text-muted-foreground">Default payment method</p>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/30 transition-colors text-left">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <CreditCard className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Add Payment Method</p>
                <p className="text-xs text-muted-foreground">Visa, Mastercard, or EFT</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold tracking-wide text-xs uppercase text-muted-foreground">
              Recent Orders
            </h3>
            {totalOrders > 0 && (
              <button
                onClick={() => navigate("/orders")}
                className="text-xs font-medium text-[#1A6FDB] flex items-center gap-0.5 hover:text-[#1560C0] transition-colors"
              >
                View All <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-10 px-4">
              <Package className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-sm font-medium text-muted-foreground">No orders yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Your order history will appear here</p>
              <button
                onClick={() => navigate("/")}
                className="mt-3 text-xs font-medium text-[#1A6FDB] hover:text-[#1560C0] transition-colors"
              >
                Browse Restaurants →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors text-left"
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                      order.status === "delivered"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : order.status === "cancelled"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-[#1A6FDB]/10 text-[#1A6FDB]"
                    }`}
                  >
                    {order.status === "delivered" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : order.status === "cancelled" ? (
                      <XCircle className="h-3.5 w-3.5" />
                    ) : (
                      <Clock className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {(order as any).restaurants?.name || "Restaurant"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-ZA", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold">
                      R{Number(order.total_price).toFixed(2)}
                    </p>
                    <p
                      className={`text-[10px] font-medium uppercase tracking-wider ${
                        order.status === "delivered"
                          ? "text-emerald-500"
                          : order.status === "cancelled"
                          ? "text-destructive"
                          : "text-[#1A6FDB]"
                      }`}
                    >
                      {order.status.replace(/_/g, " ")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Help & Support */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold tracking-wide text-xs uppercase text-muted-foreground">
              Help & Support
            </h3>
          </div>

          <div className="divide-y divide-border">
            <button
              onClick={() =>
                toast({
                  title: "Contact Support",
                  description: "Email us at support@jozieats.co.za or call 011 555 0123",
                })
              }
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/30 transition-colors text-left"
            >
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Contact Support</p>
                <p className="text-xs text-muted-foreground">Get help with an order</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>

            <button
              onClick={() =>
                toast({
                  title: "Refund Policy",
                  description: "Refunds are processed within 3-5 business days to your original payment method.",
                })
              }
              className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/30 transition-colors text-left"
            >
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Refund Policy</p>
                <p className="text-xs text-muted-foreground">Returns and refund info</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>

            <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-secondary/30 transition-colors text-left">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Privacy & Security</p>
                <p className="text-xs text-muted-foreground">Manage your data preferences</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border">
            <h3 className="font-semibold tracking-wide text-xs uppercase text-muted-foreground">
              Appearance
            </h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "light" as const, icon: Sun, label: "Light" },
                { value: "dark" as const, icon: Moon, label: "Dark" },
                { value: "system" as const, icon: Monitor, label: "System" },
              ].map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => setTheme(value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all duration-200 ${
                    theme === value
                      ? "border-[#1A6FDB] bg-[#1A6FDB]/10 text-[#1A6FDB] shadow-sm"
                      : "border-border hover:bg-secondary/30 text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="pt-2"
        >
          {!showSignOutConfirm ? (
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-card border border-border hover:bg-secondary/30 transition-colors text-left group"
            >
              <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <LogOut className="h-3.5 w-3.5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-500">Sign Out</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div className="rounded-xl bg-card border border-red-500/20 overflow-hidden">
              <div className="px-4 py-4 text-center">
                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-2">
                  <LogOut className="h-4 w-4 text-red-500" />
                </div>
                <p className="text-sm font-semibold">Sign out of Jozi Eats?</p>
                <p className="text-xs text-muted-foreground mt-1">
                  You'll need to sign in again to place orders
                </p>
              </div>
              <div className="grid grid-cols-2 border-t border-border">
                <button
                  onClick={() => setShowSignOutConfirm(false)}
                  className="py-3 text-sm font-medium text-muted-foreground hover:bg-secondary/30 transition-colors border-r border-border"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSignOut}
                  className="py-3 text-sm font-semibold text-red-500 hover:bg-red-500/5 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* App info */}
        <div className="text-center pt-4 pb-8">
          <img src="/logo.png" alt="Jozi Eats" className="h-8 w-8 mx-auto mb-2 opacity-30" />
          <p className="text-[10px] text-muted-foreground/40">
            Jozi Eats v1.0.0 · Made in Johannesburg 🇿🇦
          </p>
        </div>
      </div>
    </div>
  );
}
