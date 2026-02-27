import { motion } from "framer-motion";
import { Star, Clock, Truck, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

interface Props {
  restaurant: Tables<"restaurants">;
}

export default function RestaurantCard({ restaurant }: Props) {
  const navigate = useNavigate();
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0 },
      }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/restaurant/${restaurant.id}`)}
      className="overflow-hidden rounded-lg bg-card border border-border shadow-[0_1px_3px_rgba(0,0,0,0.06)] cursor-pointer"
    >
      {/* Cover Image */}
      <div className="relative h-36 bg-secondary">
        {restaurant.cover_image_url ? (
          <img
            src={restaurant.cover_image_url}
            alt={restaurant.name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl">
            🍽️
          </div>
        )}
        {/* Rating Badge */}
        {restaurant.rating && Number(restaurant.rating) > 0 && (
          <div className="absolute top-3 right-3 flex items-center gap-1 rounded-lg bg-card/90 backdrop-blur-sm px-2 py-1">
            <Star className="h-3 w-3 fill-primary text-primary" />
            <span className="text-xs font-semibold">{Number(restaurant.rating).toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="font-semibold text-base text-foreground leading-tight">
          {restaurant.name}
        </h3>
        <div className="flex items-center gap-2 mt-0.5">
          {restaurant.cuisine && (
            <p className="text-xs text-muted-foreground">
              {restaurant.cuisine}
            </p>
          )}
          {restaurant.cuisine && restaurant.address && (
            <span className="text-xs text-muted-foreground/40">•</span>
          )}
          {restaurant.address && (
            <p className="text-xs text-muted-foreground flex items-center gap-0.5">
              <MapPin className="h-2.5 w-2.5" />
              {restaurant.address.split(",").pop()?.trim() || restaurant.address}
            </p>
          )}
        </div>
        <div className="mt-2.5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {restaurant.estimated_delivery_time || "30-45 min"}
          </span>
          <span className="flex items-center gap-1">
            <Truck className="h-3 w-3" />
            {restaurant.delivery_fee
              ? `R${Number(restaurant.delivery_fee).toFixed(2)}`
              : "Free"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
