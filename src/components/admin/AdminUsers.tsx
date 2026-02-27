import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useState } from "react";
import type { Database } from "@/integrations/supabase/types";

type AppRole = Database["public"]["Enums"]["app_role"];
const ALL_ROLES: AppRole[] = ["customer", "restaurant_owner", "driver", "admin"];

export default function AdminUsers() {
  const queryClient = useQueryClient();
  const [addingRole, setAddingRole] = useState<{ userId: string; role: AppRole } | null>(null);

  const { data: userRoles = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*, profiles:user_id(full_name)")
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
  const grouped = userRoles.reduce<Record<string, typeof userRoles>>((acc, r) => {
    const key = r.user_id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">Users ({Object.keys(grouped).length})</h2>
      {Object.entries(grouped).map(([userId, roles]) => (
        <div key={userId} className="p-4 rounded-lg bg-card border border-border">
          <p className="text-sm font-medium">{(roles[0] as any).profiles?.full_name || "User"}</p>
          <p className="text-xs text-muted-foreground mb-2">{userId.slice(0, 12)}...</p>
          <div className="flex flex-wrap gap-1.5">
            {roles.map((r) => (
              <span key={r.id} className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                {r.role}
                <button onClick={() => deleteRole.mutate(r.id)} className="ml-0.5 hover:text-destructive">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Select onValueChange={(v) => setAddingRole({ userId, role: v as AppRole })}>
              <SelectTrigger className="h-8 rounded-lg text-xs flex-1"><SelectValue placeholder="Add role..." /></SelectTrigger>
              <SelectContent>
                {ALL_ROLES.filter((r) => !roles.some((ur) => ur.role === r)).map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {addingRole?.userId === userId && (
              <Button size="sm" className="rounded-lg text-xs" onClick={() => addRole.mutate(addingRole)}>Add</Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
