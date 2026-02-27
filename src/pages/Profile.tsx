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

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 glass px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold tracking-wide">My Profile</h1>
      </div>

      <div className="px-4 mt-4 space-y-6">
        {/* Avatar & Name */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <div className="h-16 w-16 rounded-full bg-[#1A6FDB] flex items-center justify-center text-white text-xl font-bold shrink-0">
            {profile?.full_name
              ? profile.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "JE"}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold tracking-wide truncate">
              {profile?.full_name || "Jozi Eater"}
            </h2>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Member since{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-ZA", {
                    month: "long",
                    year: "numeric",
                  })
                : "—"}
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-3"
        >
          <div className="bg-card rounded-lg border border-border p-3 text-center">
            <p className="text-xl font-bold text-[#1A6FDB]">{totalOrders}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
              Orders
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 text-center">
            <p className="text-xl font-bold text-green-500">{deliveredOrders}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
              Delivered
            </p>
          </div>
          <div className="bg-card rounded-lg border border-border p-3 text-center">
            <p className="text-xl font-bold">R{totalSpent.toFixed(0)}</p>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
              Total Spent
            </p>
          </div>
        </motion.div>

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border border-border p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold tracking-wide text-sm uppercase">
              Contact Details
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (editing) {
                  handleSaveProfile();
                } else {
                  setFullName(profile?.full_name || "");
                  setPhone(profile?.phone || "");
                  setEditing(true);
                }
              }}
              className="h-8 text-xs gap-1.5 text-[#1A6FDB]"
            >
              {saving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : editing ? (
                <>
                  <Save className="h-3.5 w-3.5" /> Save
                </>
              ) : (
                <>
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </>
              )}
            </Button>
          </div>

          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <User className="h-3 w-3" /> Full Name
              </Label>
              {editing ? (
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="h-10 rounded-lg bg-secondary/50 border-border text-sm"
                />
              ) : (
                <p className="text-sm font-medium">
                  {profile?.full_name || "—"}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3 w-3" /> Email
              </Label>
              <p className="text-sm font-medium">{user?.email || "—"}</p>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3 w-3" /> Phone
              </Label>
              {editing ? (
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+27 82 123 4567"
                  className="h-10 rounded-lg bg-secondary/50 border-border text-sm"
                />
              ) : (
                <p className="text-sm font-medium">
                  {profile?.phone || "Not set"}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Delivery Address */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-lg border border-border p-4"
        >
          <h3 className="font-semibold tracking-wide text-sm uppercase mb-3">
            Delivery Address
          </h3>
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div className="flex-1">
              {orders.length > 0 && orders[0].delivery_address ? (
                <p className="font-medium">{orders[0].delivery_address}</p>
              ) : (
                <p className="text-muted-foreground">
                  No saved address. Your delivery address will appear here after
                  your first order.
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Payment / Banking */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-lg border border-border p-4"
        >
          <h3 className="font-semibold tracking-wide text-sm uppercase mb-3">
            Payment Methods
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
              <CreditCard className="h-5 w-5 text-[#1A6FDB]" />
              <div className="flex-1">
                <p className="text-sm font-medium">Cash on Delivery</p>
                <p className="text-xs text-muted-foreground">Default method</p>
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <button className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border w-full text-left hover:bg-secondary/30 transition-colors">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Add Card or EFT
                </p>
                <p className="text-xs text-muted-foreground">
                  Visa, Mastercard, or bank transfer
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-lg border border-border p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold tracking-wide text-sm uppercase">
              Recent Orders
            </h3>
            {totalOrders > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/orders")}
                className="h-8 text-xs text-[#1A6FDB] gap-1"
              >
                View All <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No orders yet</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/")}
                className="mt-2 text-xs text-[#1A6FDB]"
              >
                Browse Restaurants
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => navigate(`/order/${order.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors text-left"
                >
                  <div
                    className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                      order.status === "delivered"
                        ? "bg-green-500/10 text-green-500"
                        : order.status === "cancelled"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-[#1A6FDB]/10 text-[#1A6FDB]"
                    }`}
                  >
                    {order.status === "delivered" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : order.status === "cancelled" ? (
                      <XCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
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
                          ? "text-green-500"
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

        {/* Returns & Support */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-lg border border-border p-4"
        >
          <h3 className="font-semibold tracking-wide text-sm uppercase mb-3">
            Returns & Support
          </h3>
          <div className="space-y-1">
            {cancelledOrders > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg">
                <RotateCcw className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Cancelled Orders</p>
                  <p className="text-xs text-muted-foreground">
                    {cancelledOrders} order{cancelledOrders > 1 ? "s" : ""}{" "}
                    cancelled
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <button
              onClick={() =>
                toast({
                  title: "Contact Support",
                  description:
                    "Email us at support@jozieats.co.za or call 011 555 0123",
                })
              }
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors text-left"
            >
              <Mail className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Contact Support</p>
                <p className="text-xs text-muted-foreground">
                  Get help with an order or refund
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() =>
                toast({
                  title: "Refund Policy",
                  description:
                    "Refunds are processed within 3-5 business days to your original payment method.",
                })
              }
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/30 transition-colors text-left"
            >
              <RotateCcw className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">Refund Policy</p>
                <p className="text-xs text-muted-foreground">
                  Learn about returns and refunds
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-card rounded-lg border border-border p-4"
        >
          <h3 className="font-semibold tracking-wide text-sm uppercase mb-3">
            Appearance
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "light" as const, icon: Sun, label: "Light" },
              { value: "dark" as const, icon: Moon, label: "Dark" },
              { value: "system" as const, icon: Monitor, label: "System" },
            ].map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-colors ${
                  theme === value
                    ? "border-[#1A6FDB] bg-[#1A6FDB]/10 text-[#1A6FDB]"
                    : "border-border hover:bg-secondary/30 text-muted-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="w-full h-12 rounded-lg text-destructive border-destructive/30 hover:bg-destructive/5 font-semibold tracking-wide gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </motion.div>

        {/* App info */}
        <p className="text-center text-[10px] text-muted-foreground/50 pb-4">
          Jozi Eats v1.0.0 · Made in Johannesburg 🇿🇦
        </p>
      </div>
    </div>
  );
}
