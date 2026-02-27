import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ShoppingBag, User, Home, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RestaurantCard from "./RestaurantCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = [
  { emoji: "🍔", label: "Burgers" },
  { emoji: "🍕", label: "Pizza" },
  { emoji: "🥗", label: "Healthy" },
  { emoji: "🍣", label: "Sushi" },
  { emoji: "🌮", label: "Mexican" },
  { emoji: "🍜", label: "Asian" },
  { emoji: "☕", label: "Café" },
  { emoji: "🍰", label: "Dessert" },
];

export default function CustomerHome() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ["restaurants", search, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("restaurants")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,cuisine.ilike.%${search}%`);
      }
      if (selectedCategory) {
        query = query.ilike("cuisine", `%${selectedCategory}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const firstName = profile?.full_name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="safe-top sticky top-0 z-30 glass px-4 pb-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Deliver to
            </p>
            <button className="flex items-center gap-1 text-sm font-semibold text-foreground">
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Current Location
            </button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/profile")}
            className="rounded-full h-10 w-10 bg-secondary"
          >
            <User className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants or cuisines..."
            className="h-11 rounded-lg bg-secondary/80 border-0 pl-10 text-sm"
          />
        </div>
      </div>

      <div className="px-4 pt-5">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold tracking-wide">
            Hey {firstName} 👋
          </h1>
          <p className="text-sm font-light tracking-wide text-muted-foreground mt-0.5">
            What are you craving today?
          </p>
        </motion.div>

        {/* Categories */}
        <div className="mb-6 flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat.label}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setSelectedCategory(
                  selectedCategory === cat.label ? null : cat.label
                )
              }
              className={`flex flex-col items-center gap-1.5 min-w-[64px] rounded-lg px-3 py-3 transition-all duration-200 ${
                selectedCategory === cat.label
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-foreground"
              }`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <span className="text-[11px] font-medium">{cat.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Restaurant List */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-wide">Nearby Restaurants</h2>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-lg bg-secondary animate-pulse"
                />
              ))}
            </div>
          ) : restaurants.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">
                No restaurants found
              </p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.08 } },
              }}
              className="space-y-4"
            >
              {restaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass safe-bottom">
        <div className="flex items-center justify-around py-2">
          {[
            { icon: Home, label: "Home", active: true, action: () => {} },
            { icon: Search, label: "Browse", active: false, action: () => {} },
            { icon: ShoppingBag, label: "Orders", active: false, action: () => navigate("/orders") },
            { icon: Clock, label: "History", active: false, action: () => navigate("/orders") },
            { icon: User, label: "Profile", active: false, action: () => navigate("/profile") },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={tab.action}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 ${
                tab.active
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
