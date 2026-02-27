import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export default function AdminRestaurants() {
  const queryClient = useQueryClient();

  const { data: restaurants = [] } = useQuery({
    queryKey: ["admin-restaurants"],
    queryFn: async () => {
      const { data, error } = await supabase.from("restaurants").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: boolean }) => {
      const { error } = await supabase.from("restaurants").update({ is_active: val }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] }); toast.success("Updated"); },
  });

  const deleteRestaurant = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("restaurants").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] }); toast.success("Deleted"); },
  });

  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">All Restaurants ({restaurants.length})</h2>
      {restaurants.map((r) => (
        <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{r.name}</p>
            <p className="text-xs text-muted-foreground">{r.cuisine} · {r.address}</p>
          </div>
          <Switch checked={r.is_active ?? true} onCheckedChange={(val) => toggleActive.mutate({ id: r.id, val })} />
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteRestaurant.mutate(r.id)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
