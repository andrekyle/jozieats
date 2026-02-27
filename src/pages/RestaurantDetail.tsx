import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Star, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import MenuItemModal from "@/components/customer/MenuItemModal";
import CartDrawer from "@/components/customer/CartDrawer";
import type { Tables } from "@/integrations/supabase/types";

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setRestaurantInfo, setDeliveryFee, itemCount } = useCart();
  const [selectedItem, setSelectedItem] = useState<Tables<"menu_items"> | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const { data: restaurant } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("restaurants").select("*").eq("id", id!).single();
      if (error) throw error;
      if (data) {
        setRestaurantInfo(data.id, data.name);
        setDeliveryFee(Number(data.delivery_fee) || 0);
      }
      return data;
    },
    enabled: !!id,
  });

  const { data: menuItems = [] } = useQuery({
    queryKey: ["menu", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", id!)
        .eq("is_available", true)
        .order("category");
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const categories = [...new Set(menuItems.map((i) => i.category || "Other"))];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <div className="relative h-52 bg-secondary">
        {restaurant?.cover_image_url && (
          <img src={restaurant.cover_image_url} alt={restaurant?.name} className="h-full w-full object-cover" />
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 rounded-full bg-card/80 backdrop-blur-sm h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      {/* Info */}
      <div className="px-4 -mt-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-lg p-4 border border-border shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <h1 className="text-xl font-bold tracking-wide">{restaurant?.name}</h1>
          {restaurant?.cuisine && <p className="text-sm text-muted-foreground mt-0.5">{restaurant.cuisine}</p>}
          {restaurant?.description && <p className="text-xs text-muted-foreground mt-1">{restaurant.description}</p>}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            {restaurant?.rating && Number(restaurant.rating) > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-primary text-primary" />
                {Number(restaurant.rating).toFixed(1)}
              </span>
            )}
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{restaurant?.estimated_delivery_time}</span>
            <span className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              {restaurant?.delivery_fee && Number(restaurant.delivery_fee) > 0
                ? `R${Number(restaurant.delivery_fee).toFixed(2)}`
                : "Free delivery"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Menu */}
      <div className="px-4 mt-6">
        {categories.map((cat) => (
          <div key={cat} className="mb-6">
            <h2 className="text-base font-semibold mb-3">{cat}</h2>
            <div className="space-y-3">
              {menuItems
                .filter((i) => (i.category || "Other") === cat)
                .map((item) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedItem(item)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-card border border-border text-left"
                  >
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.name} className="h-16 w-16 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="h-16 w-16 rounded-lg bg-secondary flex items-center justify-center text-2xl flex-shrink-0">🍽️</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      {item.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>}
                      <p className="text-sm font-semibold text-primary mt-1">R{Number(item.price).toFixed(2)}</p>
                    </div>
                  </motion.button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Button */}
      {itemCount > 0 && (
        <motion.div
          initial={{ y: 100 }} animate={{ y: 0 }}
          className="fixed bottom-6 left-4 right-4 z-40"
        >
          <Button onClick={() => setCartOpen(true)} className="w-full h-14 rounded-lg text-base font-semibold shadow-md tracking-wide">
            View Cart · {itemCount} item{itemCount > 1 ? "s" : ""}
          </Button>
        </motion.div>
      )}

      <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}
