import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface Form { name: string; description: string; price: string; category: string; image_url: string; }
const emptyForm: Form = { name: "", description: "", price: "", category: "", image_url: "" };

export default function RestaurantMenuManager({ restaurantId }: { restaurantId: string }) {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Tables<"menu_items"> | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);

  const { data: items = [] } = useQuery({
    queryKey: ["menu-manage", restaurantId],
    queryFn: async () => {
      const { data, error } = await supabase.from("menu_items").select("*").eq("restaurant_id", restaurantId).order("category").order("name");
      if (error) throw error;
      return data;
    },
  });

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
    },
  });

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item: Tables<"menu_items">) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description || "", price: String(item.price), category: item.category || "", image_url: item.image_url || "" });
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-semibold tracking-wide">Menu Items ({items.length})</h2>
        <Button size="sm" className="rounded-lg" onClick={openNew}><Plus className="h-4 w-4 mr-1" />Add</Button>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.category} · R{Number(item.price).toFixed(2)}</p>
            </div>
            <Switch checked={item.is_available ?? true} onCheckedChange={(val) => toggleAvail.mutate({ id: item.id, val })} />
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item)}><Pencil className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteItem.mutate(item.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-sm rounded-lg">
          <DialogHeader><DialogTitle>{editing ? "Edit Item" : "Add Item"}</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg" />
            <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg resize-none" rows={2} />
            <div className="flex gap-2">
              <Input placeholder="Price (R)" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="rounded-lg" />
              <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="rounded-lg" />
            </div>
            <Input placeholder="Image URL (optional)" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="rounded-lg" />
            <Button onClick={() => upsert.mutate()} disabled={!form.name || !form.price} className="w-full rounded-lg tracking-wide">
              {editing ? "Save Changes" : "Add Item"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
