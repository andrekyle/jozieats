import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Search, EyeOff, ImageIcon, UtensilsCrossed, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Tables } from "@/integrations/supabase/types";

interface Form { name: string; description: string; price: string; category: string; image_url: string; }
const emptyForm: Form = { name: "", description: "", price: "", category: "", image_url: "" };

export default function RestaurantMenuManager({ restaurantId }: { restaurantId: string }) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Tables<"menu_items"> | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [search, setSearch] = useState("");
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const { data: items = [] } = useQuery({
    queryKey: ["menu-manage", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("category")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const grouped = useMemo(() => {
    const filtered = items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(search.toLowerCase())
    );
    return filtered.reduce<Record<string, typeof items>>((acc, item) => {
      const cat = item.category || "Uncategorised";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});
  }, [items, search]);

  const availableCount = items.filter((i) => i.is_available !== false).length;
  const unavailableCount = items.length - availableCount;

  const upsert = useMutation({
    mutationFn: async () => {
      const payload = {
        restaurant_id: restaurantId,
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        category: form.category || null,
        image_url: form.image_url || null,
      };
      if (editing) {
        const { error } = await supabase.from("menu_items").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("menu_items").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-manage", restaurantId] });
      toast.success(editing ? "Item updated" : "Item added");
      setModalOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleAvail = useMutation({
    mutationFn: async ({ id, val }: { id: string; val: boolean }) => {
      const { error } = await supabase.from("menu_items").update({ is_available: val }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["menu-manage", restaurantId] }),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("menu_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["menu-manage", restaurantId] });
      toast.success("Item deleted");
      setDeleteConfirmId(null);
    },
  });

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item: Tables<"menu_items">) => {
    setEditing(item);
    setForm({
      name: item.name,
      description: item.description || "",
      price: String(item.price),
      category: item.category || "",
      image_url: item.image_url || "",
    });
    setModalOpen(true);
  };

  const toggleCategory = (cat: string) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold tracking-wide">Menu Items</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {items.length} items · <span className="text-green-600 dark:text-green-400">{availableCount} active</span>
            {unavailableCount > 0 && <> · <span className="text-amber-600 dark:text-amber-400">{unavailableCount} hidden</span></>}
          </p>
        </div>
        <Button size="sm" className="rounded-lg font-semibold tracking-wide text-xs uppercase" onClick={openNew}>
          <Plus className="h-4 w-4 mr-1" />Add Item
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search items or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-lg"
        />
      </div>

      {/* Grouped items */}
      {Object.keys(grouped).length === 0 ? (
        <div className="text-center py-12">
          <UtensilsCrossed className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {search ? "No items match your search" : "No menu items yet"}
          </p>
          {!search && (
            <Button size="sm" variant="link" className="mt-1 text-xs" onClick={openNew}>
              Add your first item
            </Button>
          )}
        </div>
      ) : (
        Object.entries(grouped).map(([category, catItems]) => {
          const isCollapsed = collapsedCategories.has(category);
          const catAvailable = catItems.filter((i) => i.is_available !== false).length;

          return (
            <div key={category}>
              <button
                onClick={() => toggleCategory(category)}
                className="flex items-center gap-2 w-full py-2 text-left group"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm font-semibold tracking-wide uppercase text-muted-foreground group-hover:text-foreground transition-colors">
                  {category}
                </span>
                <span className="text-xs text-muted-foreground/60 font-normal normal-case">
                  {catAvailable}/{catItems.length}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-2 pb-3">
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-center gap-3 p-3 rounded-xl bg-card border transition-colors ${
                            item.is_available === false ? "border-border opacity-60" : "border-border"
                          }`}
                        >
                          {/* Image thumbnail */}
                          <div className="h-12 w-12 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                            {item.image_url ? (
                              <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center">
                                <ImageIcon className="h-4 w-4 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              {item.is_available === false && (
                                <EyeOff className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {item.description || "No description"}
                            </p>
                            <p className="text-xs font-semibold text-primary mt-0.5">
                              R{Number(item.price).toFixed(2)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Switch
                              checked={item.is_available ?? true}
                              onCheckedChange={(val) => toggleAvail.mutate({ id: item.id, val })}
                            />
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => setDeleteConfirmId(item.id)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm rounded-lg" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Item" : "Add Menu Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Item Name *</label>
              <Input
                placeholder="e.g. PERi-PERi Chicken Burger"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-lg"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
              <Textarea
                placeholder="A short description of the item..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="rounded-lg resize-none"
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Price (R) *</label>
                <Input
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="rounded-lg"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
                <Input
                  placeholder="e.g. Mains"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Image URL</label>
              <Input
                placeholder="https://..."
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                className="rounded-lg"
              />
              {form.image_url && (
                <div className="mt-2 h-24 w-full rounded-lg overflow-hidden bg-secondary">
                  <img src={form.image_url} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
            <Button
              onClick={() => upsert.mutate()}
              disabled={!form.name || !form.price || upsert.isPending}
              className="w-full rounded-lg tracking-wide font-semibold uppercase text-xs"
            >
              {upsert.isPending ? "Saving..." : editing ? "Save Changes" : "Add Item"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <DialogContent className="max-w-xs rounded-lg" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this item? This action cannot be undone.
          </p>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 rounded-lg font-semibold tracking-wide uppercase text-xs"
              onClick={() => deleteConfirmId && deleteItem.mutate(deleteConfirmId)}
              disabled={deleteItem.isPending}
            >
              {deleteItem.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
