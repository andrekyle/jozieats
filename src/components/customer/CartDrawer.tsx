import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

interface Props { open: boolean; onClose: () => void; }

export default function CartDrawer({ open, onClose }: Props) {
  const { items, restaurantName, subtotal, deliveryFee, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const total = subtotal + deliveryFee;

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Your Cart</SheetTitle>
          {restaurantName && <p className="text-sm text-muted-foreground text-left">{restaurantName}</p>}
        </SheetHeader>

        {items.length === 0 ? (
          <p className="text-center text-muted-foreground py-8 text-sm">Your cart is empty</p>
        ) : (
          <div className="mt-4 space-y-3">
            {items.map((ci) => (
              <div key={ci.menuItem.id} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{ci.menuItem.name}</p>
                  <p className="text-sm text-primary font-semibold">R{(ci.menuItem.price * ci.quantity).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => updateQuantity(ci.menuItem.id, ci.quantity - 1)}>
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-semibold w-4 text-center">{ci.quantity}</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg" onClick={() => updateQuantity(ci.menuItem.id, ci.quantity + 1)}>
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-destructive" onClick={() => removeItem(ci.menuItem.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}

            <div className="border-t border-border pt-3 space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>R{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{deliveryFee > 0 ? `R${deliveryFee.toFixed(2)}` : "Free"}</span></div>
              <div className="flex justify-between font-semibold text-base pt-1"><span>Total</span><span>R{total.toFixed(2)}</span></div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => { clearCart(); onClose(); }}>Clear</Button>
              <Button className="flex-1 rounded-lg font-semibold tracking-wide" onClick={() => { onClose(); navigate("/checkout"); }}>Checkout</Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
