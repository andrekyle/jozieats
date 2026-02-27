import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, MapPin, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, restaurantId, restaurantName, subtotal, deliveryFee, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [placing, setPlacing] = useState(false);

  const total = subtotal + deliveryFee;

  const placeOrder = async () => {
    if (!address.trim()) { toast.error("Please enter a delivery address"); return; }
    if (!user || !restaurantId || items.length === 0) return;

    setPlacing(true);
    try {
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_id: user.id,
          restaurant_id: restaurantId,
          delivery_address: address,
          delivery_fee: deliveryFee,
          total_price: total,
          special_instructions: instructions || null,
          status: "pending",
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      const orderItems = items.map((ci) => ({
        order_id: order.id,
        menu_item_id: ci.menuItem.id,
        quantity: ci.quantity,
        price: ci.menuItem.price,
        special_instructions: ci.specialInstructions || null,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(orderItems);
      if (itemsErr) throw itemsErr;

      clearCart();
      toast.success("Order placed!");
      navigate(`/order/${order.id}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <p className="text-muted-foreground mb-4">Your cart is empty</p>
        <Button onClick={() => navigate("/")} variant="outline" className="rounded-lg">Browse Restaurants</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="sticky top-0 z-30 glass px-4 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold tracking-wide">Checkout</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-4 mt-4 space-y-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Order from</p>
          <p className="font-semibold">{restaurantName}</p>
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1.5">
            <MapPin className="h-3 w-3" /> Delivery Address
          </label>
          <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, Apt 4B" className="rounded-lg" />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Special Instructions</label>
          <Textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Gate code, leave at door..." className="rounded-lg resize-none" rows={2} />
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1.5">
            <CreditCard className="h-3 w-3" /> Payment
          </label>
          <div className="p-3 rounded-lg bg-secondary text-sm text-muted-foreground">Cash on delivery</div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 space-y-2 text-sm">
          <h3 className="font-semibold text-base mb-2">Order Summary</h3>
          {items.map((ci) => (
            <div key={ci.menuItem.id} className="flex justify-between">
              <span>{ci.quantity}× {ci.menuItem.name}</span>
              <span>R{(ci.menuItem.price * ci.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-border pt-2 mt-2 space-y-1">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>R{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Delivery</span><span>{deliveryFee > 0 ? `R${deliveryFee.toFixed(2)}` : "Free"}</span></div>
            <div className="flex justify-between font-semibold text-base pt-1"><span>Total</span><span>R{total.toFixed(2)}</span></div>
          </div>
        </div>

        <Button onClick={placeOrder} disabled={placing} className="w-full h-14 rounded-lg text-base font-semibold tracking-wide">
          {placing ? "Placing Order..." : `Place Order · R${total.toFixed(2)}`}
        </Button>
      </motion.div>
    </div>
  );
}
