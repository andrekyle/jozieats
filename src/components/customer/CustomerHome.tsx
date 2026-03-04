import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ShoppingBag, User, Home, Clock, ChevronDown, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RestaurantCard from "./RestaurantCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CATEGORIES = [
  { emoji: "🍗", label: "PERi-PERi" },
  { emoji: "🥩", label: "Steakhouse" },
  { emoji: "🍔", label: "Burgers" },
  { emoji: "🍕", label: "Pizza" },
  { emoji: "🍣", label: "Sushi" },
  { emoji: "🐟", label: "Seafood" },
  { emoji: "🍲", label: "Traditional" },
  { emoji: "🌯", label: "Street Food" },
  { emoji: "☕", label: "Café" },
  { emoji: "🌮", label: "Mexican" },
  { emoji: "🍜", label: "Asian" },
  { emoji: "🥗", label: "Healthy" },
];

const AREAS = [
  "All Areas",
  "Sandton",
  "Bryanston",
  "Randburg",
  "Soweto",
  "Rosebank",
  "Melville",
  "Fourways",
  "Parkhurst",
];

export default function CustomerHome() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState("All Areas");
  const [showAreaPicker, setShowAreaPicker] = useState(false);

  const { data: restaurants = [], isLoading } = useQuery({
    queryKey: ["restaurants", search, selectedCategory, selectedArea],
    queryFn: async () => {
      let query = supabase
        .from("restaurants")
        .select("*")
        .eq("is_active", true)
        .order("rating", { ascending: false });

      if (search) {
        query = query.or(`name.ilike.%${search}%,cuisine.ilike.%${search}%,address.ilike.%${search}%`);
      }
      if (selectedCategory) {
        query = query.ilike("cuisine", `%${selectedCategory}%`);
      }
      if (selectedArea && selectedArea !== "All Areas") {
        query = query.ilike("address", `%${selectedArea}%`);
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
            <button
              onClick={() => setShowAreaPicker(!showAreaPicker)}
              className="flex items-center gap-1 text-sm font-semibold text-foreground"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              {selectedArea === "All Areas" ? "All of Jozi" : selectedArea}
              <ChevronDown className="h-3 w-3 text-muted-foreground" />
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

        {/* Area Picker Dropdown */}
        {showAreaPicker && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-3 flex flex-wrap gap-2"
          >
            {AREAS.map((area) => (
              <button
                key={area}
                onClick={() => {
                  setSelectedArea(area);
                  setShowAreaPicker(false);
                }}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedArea === area
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {area}
              </button>
            ))}
          </motion.div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search restaurants, cuisines, or areas..."
            className="h-11 rounded-lg bg-secondary/80 border-0 pl-10 pr-10 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
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

        {/* Active Filters */}
        {(selectedCategory || selectedArea !== "All Areas") && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            {selectedArea !== "All Areas" && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary text-xs font-medium px-2.5 py-1">
                <MapPin className="h-3 w-3" />
                {selectedArea}
                <button onClick={() => setSelectedArea("All Areas")}>
                  <X className="h-3 w-3 ml-0.5" />
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 text-primary text-xs font-medium px-2.5 py-1">
                {selectedCategory}
                <button onClick={() => setSelectedCategory(null)}>
                  <X className="h-3 w-3 ml-0.5" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Restaurant List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-wide">
              {selectedArea !== "All Areas" ? `Restaurants in ${selectedArea}` : "Nearby Restaurants"}
            </h2>
            <span className="text-xs text-muted-foreground">{restaurants.length} found</span>
          </div>
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
              {(selectedCategory || selectedArea !== "All Areas" || search) && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory(null);
                    setSelectedArea("All Areas");
                  }}
                  className="mt-2 text-xs text-primary hover:underline"
                >
                  Clear all filters
                </button>
              )}
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

      {/* Legal footer */}
      <div className="flex items-center justify-center gap-4 pb-28 pt-4 flex-wrap px-4">
        <button
          onClick={() => navigate("/privacy-policy")}
          className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          Privacy Policy
        </button>
        <span className="text-muted-foreground/30 text-[11px]">·</span>
        <button
          onClick={() => navigate("/terms")}
          className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          Terms of Service
        </button>
        <span className="text-muted-foreground/30 text-[11px]">·</span>
        <button
          onClick={() => navigate("/refund-policy")}
          className="text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          Refund Policy
        </button>
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
