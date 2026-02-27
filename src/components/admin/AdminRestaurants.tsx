import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Trash2, Search, MapPin, Store, UtensilsCrossed, Truck, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminRestaurants() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: restaurants = [] } = useQuery({
    queryKey: ["admin-restaurants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = restaurants.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.cuisine || "").toLowerCase().includes(search.toLowerCase()) ||
    (r.address || "").toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = restaurants.filter((r) => r.is_active).length;

  const toggleActive = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: boolean }) => {
      const { error } = await supabase.from("restaurants").update({ is_active: val }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] });
      toast.success("Updated");
    },
  });

  const deleteRestaurant = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("restaurants").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-restaurants"] });
      toast.success("Restaurant deleted");
      setDeleteId(null);
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-wide">Restaurants</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {restaurants.length} total · <span className="text-green-600 dark:text-green-400">{activeCount} active</span>
            {restaurants.length - activeCount > 0 && (
              <> · <span className="text-amber-600 dark:text-amber-400">{restaurants.length - activeCount} inactive</span></>
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search restaurants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-lg"
        />
      </div>

      {/* Restaurant list */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <Store className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {search ? "No restaurants match your search" : "No restaurants yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              className={`p-4 rounded-xl bg-card border transition-colors ${
                r.is_active ? "border-border" : "border-border opacity-60"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Logo */}
                <div className="h-11 w-11 rounded-lg bg-secondary flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {r.logo_url ? (
                    <img src={r.logo_url} alt={r.name} className="h-full w-full object-cover" />
                  ) : (
                    <Store className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{r.name}</p>
                    {!r.is_active && <EyeOff className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {r.cuisine && (
                      <span className="flex items-center gap-1">
                        <UtensilsCrossed className="h-3 w-3" />{r.cuisine}
                      </span>
                    )}
                    {r.delivery_fee !== null && (
                      <span className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />R{Number(r.delivery_fee).toFixed(2)}
                      </span>
                    )}
                  </div>
                  {r.address && (
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 truncate">
                      <MapPin className="h-3 w-3 flex-shrink-0" />{r.address}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Switch
                    checked={r.is_active ?? true}
                    onCheckedChange={(val) => toggleActive.mutate({ id: r.id, val })}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(r.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Meta */}
              <div className="mt-2 pt-2 border-t border-border flex justify-between text-[10px] text-muted-foreground/60">
                <span>ID: {r.id.slice(0, 8)}...</span>
                <span>Created {new Date(r.created_at).toLocaleDateString("en-ZA")}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-xs rounded-lg" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Delete Restaurant</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure? This will permanently delete the restaurant and all its menu items. This action cannot be undone.
          </p>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-lg font-semibold tracking-wide uppercase text-xs"
              onClick={() => deleteId && deleteRestaurant.mutate(deleteId)}
              disabled={deleteRestaurant.isPending}
            >
              {deleteRestaurant.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
