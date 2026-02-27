import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import type { Tables } from "@/integrations/supabase/types";

interface Props {
  item: Tables<"menu_items"> | null;
  onClose: () => void;
}

export default function MenuItemModal({ item, onClose }: Props) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    if (item) { setQuantity(1); setInstructions(""); }
  }, [item]);

  if (!item) return null;

  const handleAdd = () => {
    addItem(item, quantity, instructions || undefined);
    onClose();
  };

  return (
    <Dialog open={!!item} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-sm mx-auto p-0 rounded-lg overflow-hidden" aria-describedby={undefined}>
        <DialogTitle className="sr-only">{item.name}</DialogTitle>
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-secondary flex items-center justify-center text-5xl">🍽️</div>
        )}
        <div className="p-5">
          <h2 className="text-lg font-bold">{item.name}</h2>
          {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
          <p className="text-lg font-semibold text-primary mt-2">R{Number(item.price).toFixed(2)}</p>

          <div className="mt-4">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Special Instructions</label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. No onions, extra sauce..."
              className="mt-1 text-sm rounded-lg resize-none"
              rows={2}
            />
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-3 bg-secondary rounded-lg px-2 py-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-base font-semibold w-6 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleAdd} className="h-11 rounded-lg px-6 font-semibold">
              Add · R{(Number(item.price) * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
