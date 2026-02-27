import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Search, Users, Shield, Store, Truck, User, X } from "lucide-react";
import { motion } from "framer-motion";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
const ALL_ROLES: AppRole[] = ["customer", "restaurant_owner", "driver", "admin"];

const ROLE_CONFIG: Record<string, { label: string; icon: typeof User; color: string; bg: string }> = {
  customer: { label: "Customer", icon: User, color: "text-[#1A6FDB]", bg: "bg-[#1A6FDB]/10" },
  restaurant_owner: { label: "Owner", icon: Store, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10" },
  driver: { label: "Driver", icon: Truck, color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" },
  admin: { label: "Admin", icon: Shield, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
};

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [addingRole, setAddingRole] = useState<{ userId: string; role: AppRole } | null>(null);
  const [filterRole, setFilterRole] = useState<string>("all");

  const { data: userRoles = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*, profiles:user_id(full_name, phone, avatar_url)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addRole = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role added");
      setAddingRole(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteRole = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("user_roles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role removed");
    },
  });

  // Group by user
  const grouped = useMemo(() => {
    const byUser = userRoles.reduce<Record<string, typeof userRoles>>((acc, r) => {
      const key = r.user_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(r);
      return acc;
    }, {});

    // Filter by role
    let entries = Object.entries(byUser);
    if (filterRole !== "all") {
      entries = entries.filter(([, roles]) => roles.some((r) => r.role === filterRole));
    }

    // Filter by search
    if (search) {
      entries = entries.filter(([, roles]) => {
        const name = (roles[0] as any).profiles?.full_name || "";
        return name.toLowerCase().includes(search.toLowerCase());
      });
    }

    return entries;
  }, [userRoles, search, filterRole]);

  const totalUsers = new Set(userRoles.map((r) => r.user_id)).size;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold tracking-wide">Users</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{totalUsers} users · {userRoles.length} role assignments</p>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-lg"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-32 rounded-lg text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ALL_ROLES.map((r) => (
              <SelectItem key={r} value={r}>{ROLE_CONFIG[r].label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Role summary pills */}
      <div className="flex flex-wrap gap-2">
        {ALL_ROLES.map((role) => {
          const count = new Set(userRoles.filter((r) => r.role === role).map((r) => r.user_id)).size;
          const cfg = ROLE_CONFIG[role];
          return (
            <button
              key={role}
              onClick={() => setFilterRole(filterRole === role ? "all" : role)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                filterRole === role ? `${cfg.bg} ${cfg.color}` : "bg-secondary text-muted-foreground"
              }`}
            >
              <cfg.icon className="h-3 w-3" />
              {cfg.label} ({count})
            </button>
          );
        })}
      </div>

      {/* User list */}
      {grouped.length === 0 ? (
        <div className="text-center py-12">
          <Users className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {search || filterRole !== "all" ? "No users match your filters" : "No users yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {grouped.map(([userId, roles], i) => {
            const profile = (roles[0] as any).profiles;
            const name = profile?.full_name || "Unknown User";

            return (
              <motion.div
                key={userId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
                className="p-4 rounded-xl bg-card border border-border"
              >
                {/* User header */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{name}</p>
                    <p className="text-[10px] text-muted-foreground">{userId.slice(0, 16)}...</p>
                  </div>
                </div>

                {/* Role badges */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {roles.map((r) => {
                    const cfg = ROLE_CONFIG[r.role];
                    return (
                      <span
                        key={r.id}
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}
                      >
                        <cfg.icon className="h-3 w-3" />
                        {cfg.label}
                        <button
                          onClick={() => deleteRole.mutate(r.id)}
                          className="ml-0.5 hover:opacity-70 transition-opacity"
                          title="Remove role"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>

                {/* Add role */}
                <div className="flex gap-2 mt-3">
                  <Select onValueChange={(v) => setAddingRole({ userId, role: v as AppRole })}>
                    <SelectTrigger className="h-8 rounded-lg text-xs flex-1">
                      <SelectValue placeholder="Add role..." />
                    </SelectTrigger>
                    <SelectContent>
                      {ALL_ROLES.filter((r) => !roles.some((ur) => ur.role === r)).map((r) => (
                        <SelectItem key={r} value={r}>
                          <span className="flex items-center gap-1.5">
                            {ROLE_CONFIG[r].label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {addingRole?.userId === userId && (
                    <Button
                      size="sm"
                      className="rounded-lg text-xs font-semibold tracking-wide uppercase"
                      onClick={() => addRole.mutate(addingRole)}
                      disabled={addRole.isPending}
                    >
                      Add
                    </Button>
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
