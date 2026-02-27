import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Store, MapPin, Phone, Clock, Truck, UtensilsCrossed, ImageIcon, Globe, Save, Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

function FormSection({ icon: Icon, title, children }: { icon: typeof Store; title: string; children: React.ReactNode }) {
  return (
    <div className="p-4 rounded-xl bg-card border border-border space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold tracking-wide">{title}</h3>
      </div>
      {children}
    </div>
  );
}

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
    cover_image_url: restaurant.cover_image_url || "",
    logo_url: restaurant.logo_url || "",
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
          cover_image_url: form.cover_image_url || null,
          logo_url: form.logo_url || null,
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
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold tracking-wide">Restaurant Profile</h2>
        <div className={`flex items-center gap-2 text-xs font-medium px-2.5 py-1 rounded-full ${
          form.is_active 
            ? "bg-green-500/10 text-green-600 dark:text-green-400" 
            : "bg-destructive/10 text-destructive"
        }`}>
          <span className={`h-1.5 w-1.5 rounded-full ${form.is_active ? "bg-green-500" : "bg-destructive"}`} />
          {form.is_active ? "Active" : "Inactive"}
        </div>
      </div>

      {/* Cover image preview */}
      {form.cover_image_url && (
        <div className="h-32 w-full rounded-xl overflow-hidden bg-secondary">
          <img src={form.cover_image_url} alt="Cover" className="h-full w-full object-cover" />
        </div>
      )}

      {/* Store Status Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
        <div>
          <p className="text-sm font-semibold">Accepting Orders</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {form.is_active ? "Your restaurant is visible and accepting orders" : "Your restaurant is hidden from customers"}
          </p>
        </div>
        <Switch checked={form.is_active} onCheckedChange={(v) => setForm({ ...form, is_active: v })} />
      </div>

      {/* Basic Info */}
      <FormSection icon={Store} title="Basic Information">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Restaurant Name</label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Description</label>
          <Textarea
            placeholder="Tell customers about your restaurant..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-lg resize-none"
            rows={3}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Cuisine Type</label>
          <Input
            placeholder="e.g. PERi-PERi, Pizza, Sushi"
            value={form.cuisine}
            onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
            className="rounded-lg"
          />
        </div>
      </FormSection>

      {/* Contact & Location */}
      <FormSection icon={MapPin} title="Contact & Location">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Address</label>
          <Input
            placeholder="e.g. 123 Jan Smuts Ave, Rosebank"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="rounded-lg"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone</label>
          <Input
            placeholder="e.g. 011 234 5678"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-lg"
          />
        </div>
      </FormSection>

      {/* Delivery Settings */}
      <FormSection icon={Truck} title="Delivery Settings">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Delivery Fee (R)</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={form.delivery_fee}
              onChange={(e) => setForm({ ...form, delivery_fee: e.target.value })}
              className="rounded-lg"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-1 block">Est. Delivery Time</label>
            <Input
              placeholder="30-45 min"
              value={form.estimated_delivery_time}
              onChange={(e) => setForm({ ...form, estimated_delivery_time: e.target.value })}
              className="rounded-lg"
            />
          </div>
        </div>
      </FormSection>

      {/* Images */}
      <FormSection icon={ImageIcon} title="Images">
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Cover Image URL</label>
          <Input
            placeholder="https://..."
            value={form.cover_image_url}
            onChange={(e) => setForm({ ...form, cover_image_url: e.target.value })}
            className="rounded-lg"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1 block">Logo URL</label>
          <Input
            placeholder="https://..."
            value={form.logo_url}
            onChange={(e) => setForm({ ...form, logo_url: e.target.value })}
            className="rounded-lg"
          />
          {form.logo_url && (
            <div className="mt-2 h-16 w-16 rounded-lg overflow-hidden bg-secondary">
              <img src={form.logo_url} alt="Logo" className="h-full w-full object-cover" />
            </div>
          )}
        </div>
      </FormSection>

      {/* Save */}
      <Button
        onClick={() => update.mutate()}
        disabled={update.isPending || !form.name}
        className="w-full rounded-lg tracking-wide font-semibold uppercase text-xs"
      >
        {update.isPending ? (
          <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</>
        ) : (
          <><Save className="h-4 w-4 mr-2" />Save Changes</>
        )}
      </Button>

      {/* Restaurant ID info */}
      <p className="text-[10px] text-muted-foreground/40 text-center">
        ID: {restaurant.id.slice(0, 12)}... · Created {new Date(restaurant.created_at).toLocaleDateString("en-ZA")}
      </p>
    </div>
  );
}
