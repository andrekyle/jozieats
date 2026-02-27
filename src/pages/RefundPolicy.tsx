import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RefundPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" className="rounded-lg shrink-0" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-semibold tracking-wide">Refund Policy</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">Last updated: 1 February 2026</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Overview</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            At Jozi Eats, we want every order to be a great experience. If something goes wrong with your delivery, we're here to make it right. This policy outlines when and how refunds are processed.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Eligibility for Refunds</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">You may be eligible for a full or partial refund in the following cases:</p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li><span className="text-foreground font-medium">Order not delivered</span> — Your order was confirmed but never arrived.</li>
            <li><span className="text-foreground font-medium">Wrong items</span> — You received items that don't match your order.</li>
            <li><span className="text-foreground font-medium">Missing items</span> — One or more items from your order were not included.</li>
            <li><span className="text-foreground font-medium">Food quality issues</span> — Items arrived cold, spoiled, or in an unacceptable condition.</li>
            <li><span className="text-foreground font-medium">Significant delay</span> — Your order arrived more than 45 minutes after the estimated delivery time without prior notice.</li>
          </ul>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Non-Refundable Situations</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Refunds will generally not be issued in the following cases:</p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li>Change of mind after the restaurant has started preparing your order.</li>
            <li>Incorrect delivery address provided by the customer.</li>
            <li>Customer was unavailable at the delivery location after reasonable attempts by the driver.</li>
            <li>Taste preference — refunds are not available because you didn't enjoy the flavour of a correctly prepared dish.</li>
          </ul>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">How to Request a Refund</h2>
          <ol className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li>Go to <button onClick={() => navigate("/orders")} className="text-primary font-medium underline underline-offset-2">Orders</button> in the Jozi Eats app.</li>
            <li>Select the order you'd like a refund for.</li>
            <li>Tap <span className="text-foreground font-medium">Report a Problem</span> and describe the issue.</li>
            <li>Attach photos if applicable (e.g. wrong or damaged items).</li>
            <li>Submit your request — our team will review it within 24 hours.</li>
          </ol>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Alternatively, you can email us at{" "}
            <a href="mailto:support@jozieats.co.za" className="text-primary underline underline-offset-2">support@jozieats.co.za</a>{" "}
            or call <span className="text-foreground font-medium">011 555 0123</span> during business hours (Mon–Fri, 08:00–18:00 SAST).
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Refund Processing</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-muted-foreground">Review time</span>
              <span className="text-sm font-medium">Within 24 hours</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-muted-foreground">Jozi Eats credit</span>
              <span className="text-sm font-medium">Instant once approved</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-muted-foreground">Card refund</span>
              <span className="text-sm font-medium">3–5 business days</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-muted-foreground">SnapScan / Zapper</span>
              <span className="text-sm font-medium">1–3 business days</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-muted-foreground">Cash orders</span>
              <span className="text-sm font-medium">Credited as Jozi Eats voucher</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You'll receive an email and in-app notification once your refund has been processed. Refunds are issued in South African Rands (ZAR).
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Partial Refunds</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If only part of your order was affected, we may issue a partial refund for the specific items. Delivery fees may also be refunded if the issue was caused by the delivery process.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Promotions &amp; Discounts</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Refunds for orders placed with a promotional code or discount will reflect the actual amount paid after the discount was applied. Promotional credits are non-refundable and non-transferable.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Consumer Protection</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This policy is subject to the Consumer Protection Act 68 of 2008 (South Africa). Nothing in this policy limits your rights under applicable South African legislation.
          </p>
        </section>

        <div className="pt-4 pb-8 text-center">
          <p className="text-xs text-muted-foreground">
            Questions? Reach us at{" "}
            <a href="mailto:support@jozieats.co.za" className="text-primary underline underline-offset-2">support@jozieats.co.za</a>
          </p>
        </div>
      </div>
    </div>
  );
}
