import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Camera, X, CheckCircle2, Loader2, ImagePlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const REASONS = [
  { value: "not_delivered", label: "Order not delivered" },
  { value: "wrong_items", label: "Wrong items received" },
  { value: "missing_items", label: "Missing items" },
  { value: "food_quality", label: "Food quality issue" },
  { value: "significant_delay", label: "Significant delay (45+ min)" },
  { value: "other", label: "Other" },
];

export default function ReportProblem() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  // Fetch order details
  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, restaurants(name)")
        .eq("id", orderId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });

  // Check for existing refund request
  const { data: existingRequest } = useQuery({
    queryKey: ["refund-request", orderId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("refund_requests" as any)
        .select("*")
        .eq("order_id", orderId!)
        .eq("customer_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
    enabled: !!orderId && !!user,
  });

  const handlePhotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (photos.length + files.length > 4) {
      toast({ title: "Maximum 4 photos", description: "You can attach up to 4 photos.", variant: "destructive" });
      return;
    }
    const newPhotos = [...photos, ...files].slice(0, 4);
    setPhotos(newPhotos);
    setPreviews(newPhotos.map((f) => URL.createObjectURL(f)));
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos((p) => p.filter((_, i) => i !== index));
    setPreviews((p) => p.filter((_, i) => i !== index));
  };

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user || !orderId) throw new Error("Missing data");

      // Upload photos
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const ext = photo.name.split(".").pop();
        const path = `${user.id}/${orderId}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("refund-photos").upload(path, photo);
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("refund-photos").getPublicUrl(path);
        photoUrls.push(urlData.publicUrl);
      }

      // Insert refund request
      const { error } = await supabase.from("refund_requests" as any).insert({
        order_id: orderId,
        customer_id: user.id,
        reason,
        description: description || null,
        photo_urls: photoUrls,
      } as any);
      if (error) throw error;
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const handleSubmit = () => {
    if (!reason) {
      toast({ title: "Select a reason", description: "Please tell us what went wrong.", variant: "destructive" });
      return;
    }
    submitMutation.mutate();
  };

  // Already submitted — show confirmation
  if (submitted || existingRequest) {
    const req = existingRequest;
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
            <Button variant="ghost" size="icon" className="rounded-lg shrink-0" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-base font-semibold tracking-wide">Report a Problem</h1>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center px-6 py-20 text-center"
        >
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400 mb-4" />
          <h2 className="text-lg font-semibold">Request Submitted</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs">
            {req
              ? `Your refund request is currently ${req.status}. We'll notify you once it's been reviewed.`
              : "We've received your report and our team will review it within 24 hours. You'll receive a notification once it's resolved."}
          </p>
          {req && (
            <div className="mt-4 bg-card rounded-xl border border-border p-4 w-full max-w-xs text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium capitalize ${
                  req.status === "approved" ? "text-green-600 dark:text-green-400"
                    : req.status === "denied" ? "text-destructive"
                    : "text-primary"
                }`}>{req.status}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Submitted</span>
                <span>{new Date(req.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              {req.refund_amount && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Refund amount</span>
                  <span className="font-medium">R{Number(req.refund_amount).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="rounded-lg" onClick={() => navigate("/orders")}>View Orders</Button>
            <Button className="rounded-lg" onClick={() => navigate("/")}>Back to Home</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" className="rounded-lg shrink-0" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-semibold tracking-wide">Report a Problem</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-5">
        {/* Order context */}
        {order && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl border border-border p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium">{(order as any).restaurants?.name || "Restaurant"}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Order #{orderId?.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                </p>
              </div>
              <p className="text-sm font-semibold">R{Number(order.total_price).toFixed(2)}</p>
            </div>
          </motion.div>
        )}

        {/* Step 1: Reason */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">What went wrong?</h2>
          <div className="grid grid-cols-1 gap-2">
            {REASONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setReason(r.value)}
                className={`text-left px-4 py-3 rounded-xl border transition-colors text-sm font-medium ${
                  reason === r.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-card text-foreground hover:border-primary/40"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Step 2: Description */}
        <AnimatePresence>
          {reason && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Describe the issue</h2>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us what happened so we can help..."
                className="rounded-lg resize-none text-sm"
                rows={4}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: Photos */}
        <AnimatePresence>
          {reason && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Attach photos <span className="font-normal normal-case">(optional, max 4)</span>
              </h2>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handlePhotos}
              />
              <div className="flex gap-3 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative h-20 w-20 rounded-lg overflow-hidden border border-border">
                    <img src={src} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 flex items-center justify-center"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  </div>
                ))}
                {photos.length < 4 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="h-20 w-20 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-[10px]">Add</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 4: Submit */}
        <AnimatePresence>
          {reason && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="pt-2 pb-8"
            >
              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                className="w-full h-12 rounded-lg font-semibold tracking-wide text-sm"
              >
                {submitMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Submitting...</>
                ) : (
                  "Submit Request"
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-3">
                Our team will review your request within 24 hours
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
