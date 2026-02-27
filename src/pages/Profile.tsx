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
  HelpCircle,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

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
    <div className="min-h-screen bg-background pb-12">
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
        <h1 className="text-lg font-semibold tracking-wide">Account</h1>
      </div>

      <div className="px-4 mt-6 space-y-5">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-[#1A6FDB] flex items-center justify-center text-white text-lg font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-bold tracking-wide truncate">
                {profile?.full_name || "Jozi Eater"}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-border">
            <div className="text-center">
              <p className="text-xl font-bold">{totalOrders}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Orders</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-emerald-500">{deliveredOrders}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Delivered</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold">R{totalSpent.toFixed(0)}</p>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Spent</p>
            </div>
          </div>
        </motion.div>

        {/* Contact Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Personal Information
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
              className="text-xs font-medium text-[#1A6FDB] flex items-center gap-1"
            >
              {saving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : editing ? (
                <><Save className="h-3 w-3" /> Save</>
              ) : (
                <><Edit2 className="h-3 w-3" /> Edit</>
              )}
            </button>
          </div>

          <div className="divide-y divide-border">
            <ProfileRow icon={User} label="Name">
              {editing ? (
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)}
                  className="h-8 rounded-lg bg-secondary/50 border-border text-sm" />
              ) : (
                <p className="text-sm">{profile?.full_name || "—"}</p>
              )}
            </ProfileRow>
            <ProfileRow icon={Mail} label="Email">
              <p className="text-sm">{user?.email || "—"}</p>
            </ProfileRow>
            <ProfileRow icon={Phone} label="Phone">
              {editing ? (
                <Input value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+27 82 123 4567"
                  className="h-8 rounded-lg bg-secondary/50 border-border text-sm" />
              ) : (
                <p className="text-sm text-muted-foreground">{profile?.phone || "Not set"}</p>
              )}
            </ProfileRow>
          </div>
        </motion.div>

        {/* Delivery & Payment */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Delivery & Payment
            </h3>
          </div>
          <div className="divide-y divide-border">
            <MenuRow icon={MapPin} title="Delivery Address"
              subtitle={orders.length > 0 && orders[0].delivery_address ? orders[0].delivery_address : "No saved address"} />
            <MenuRow icon={Banknote} title="Cash on Delivery" subtitle="Default payment method"
              badge="Active" />
            <MenuRow icon={CreditCard} title="Add Payment Method" subtitle="Visa, Mastercard, or EFT" chevron />
          </div>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent Orders
            </h3>
            {totalOrders > 0 && (
              <button onClick={() => navigate("/orders")}
                className="text-xs font-medium text-[#1A6FDB] flex items-center gap-0.5">
                View All <ChevronRight className="h-3 w-3" />
              </button>
            )}
          </div>
          {recentOrders.length === 0 ? (
            <div className="text-center py-10">
              <Package className="h-8 w-8 text-muted-foreground/20 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No orders yet</p>
              <button onClick={() => navigate("/")}
                className="mt-2 text-xs font-medium text-[#1A6FDB]">
                Browse Restaurants →
              </button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <button key={order.id} onClick={() => navigate(`/order/${order.id}`)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors text-left">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                    order.status === "delivered" ? "bg-emerald-500/10 text-emerald-500"
                      : order.status === "cancelled" ? "bg-destructive/10 text-destructive"
                      : "bg-[#1A6FDB]/10 text-[#1A6FDB]"}`}>
                    {order.status === "delivered" ? <CheckCircle2 className="h-3.5 w-3.5" />
                      : order.status === "cancelled" ? <XCircle className="h-3.5 w-3.5" />
                      : <Clock className="h-3.5 w-3.5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {(order as any).restaurants?.name || "Restaurant"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">R{Number(order.total_price).toFixed(2)}</p>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Support</h3>
          </div>
          <div className="divide-y divide-border">
            <MenuRow icon={HelpCircle} title="Help Centre" subtitle="FAQs and contact info" chevron
              onClick={() => toast({ title: "Contact Support", description: "Email support@jozieats.co.za or call 011 555 0123" })} />
            <MenuRow icon={RotateCcw} title="Refund Policy" subtitle="Returns and refund info" chevron
              onClick={() => toast({ title: "Refund Policy", description: "Refunds are processed within 3-5 business days." })} />
          </div>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-card rounded-xl border border-border overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-border">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Appearance</h3>
          </div>
          <div className="p-3">
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: "light" as const, icon: Sun, label: "Light" },
                { value: "dark" as const, icon: Moon, label: "Dark" },
                { value: "system" as const, icon: Monitor, label: "System" },
              ]).map(({ value, icon: Icon, label }) => (
                <button key={value} onClick={() => setTheme(value)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all ${
                    theme === value
                      ? "border-[#1A6FDB] bg-[#1A6FDB]/10 text-[#1A6FDB]"
                      : "border-border text-muted-foreground hover:bg-secondary/30"}`}>
                  <Icon className="h-4 w-4" />
                  <span className="text-[11px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sign Out */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {!showSignOutConfirm ? (
            <button
              onClick={() => setShowSignOutConfirm(true)}
              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-card border border-border hover:bg-secondary/30 transition-colors text-left"
            >
              <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <LogOut className="h-3.5 w-3.5 text-red-500" />
              </div>
              <p className="text-sm font-medium text-red-500">Sign Out</p>
            </button>
          ) : (
            <div className="rounded-xl bg-card border border-border overflow-hidden">
              <div className="px-4 py-5 text-center">
                <p className="text-sm font-semibold">Sign out of Jozi Eats?</p>
                <p className="text-xs text-muted-foreground mt-1">You'll need to sign in again to order</p>
              </div>
              <div className="grid grid-cols-2 border-t border-border">
                <button onClick={() => setShowSignOutConfirm(false)}
                  className="py-3 text-sm font-medium text-muted-foreground hover:bg-secondary/30 transition-colors border-r border-border">
                  Cancel
                </button>
                <button onClick={handleSignOut}
                  className="py-3 text-sm font-semibold text-red-500 hover:bg-red-500/5 transition-colors">
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-[10px] text-muted-foreground/40 pt-2 pb-4">
          Jozi Eats v1.0 · Made in Johannesburg 🇿🇦
        </p>
      </div>
    </div>
  );
}

/* ── Reusable row components ── */

function ProfileRow({ icon: Icon, label, children }: {
  icon: any; label: string; children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
        {children}
      </div>
    </div>
  );
}

function MenuRow({ icon: Icon, title, subtitle, badge, chevron, onClick }: {
  icon: any; title: string; subtitle: string; badge?: string; chevron?: boolean; onClick?: () => void;
}) {
  const Comp = onClick || chevron ? "button" : "div";
  return (
    <Comp onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${onClick || chevron ? "hover:bg-secondary/30 transition-colors" : ""}`}>
      <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
      </div>
      {badge && (
        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {chevron && <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
    </Comp>
  );
}
