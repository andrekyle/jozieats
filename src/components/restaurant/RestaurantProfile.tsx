import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

export default function RestaurantProfile({ restaurant }: { restaurant: Tables<"restaurants"> }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: restaurant.name,
    description: restaurant.description || "",
    cuisine: restaurant.cuisine || "",
    address: restaurant.address || "",
    phone: restaurant.phone || "",
    delivery_fee: String(restaurant.delivery_fee || 0),
    estimated_delivery_time: restaurant.estimated_delivery_time || "30-45 min",
    is_active: restaurant.is_active ?? true,
  });

  const update = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("restaurants")
        .update({
          name: form.name,
          description: form.description || null,
          cuisine: form.cuisine || null,
          address: form.address || null,
          phone: form.phone || null,
          delivery_fee: parseFloat(form.delivery_fee),
          estimated_delivery_time: form.estimated_delivery_time,
          is_active: form.is_active,
        })
        .eq("id", restaurant.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-restaurant"] });
      toast.success("Profile updated");
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <div className="space-y-4">
      <h2 className="text-base font-semibold tracking-wide">Restaurant Profile</h2>
      <div className="space-y-3">
        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-lg" />
        <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="rounded-lg resize-none" rows={2} />
        <Input placeholder="Cuisine" value={form.cuisine} onChange={(e) => setForm({ ...form, cuisine: e.target.value })} className="rounded-lg" />
        <Input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="rounded-lg" />
        <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-lg" />
        <div className="flex gap-2">
          <Input placeholder="Delivery fee (R)" type="number" step="0.01" value={form.delivery_fee} onChange={(e) => setForm({ ...form, delivery_fee: e.target.value })} className="rounded-lg" />
          <Input placeholder="Est. time" value={form.estimated_delivery_time} onChange={(e) => setForm({ ...form, estimated_delivery_time: e.target.value })} className="rounded-lg" />
        </div>
        <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
          <span className="text-sm font-medium">Active / Accepting Orders</span>
          <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
        </div>
        <Button onClick={() => update.mutate()} className="w-full rounded-lg tracking-wide">Save Changes</Button>
      </div>
    </div>
  );
}
