import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" className="rounded-lg shrink-0" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-semibold tracking-wide">Privacy Policy</h1>
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
            Jozi Eats ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy explains what data we collect, how we use it, and your rights as a user of our platform — in accordance with the Protection of Personal Information Act 4 of 2013 (POPIA) and applicable South African law.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Information We Collect</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">We collect the following categories of personal information:</p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li><span className="text-foreground font-medium">Account information</span> — Your full name, email address, and phone number when you register.</li>
            <li><span className="text-foreground font-medium">Order data</span> — Delivery addresses, order history, items ordered, and payment method used.</li>
            <li><span className="text-foreground font-medium">Location data</span> — Delivery address you provide at checkout. We do not track your device's GPS location.</li>
            <li><span className="text-foreground font-medium">Device & usage data</span> — Browser type, IP address, pages visited, and in-app interactions, collected automatically for analytics and security.</li>
            <li><span className="text-foreground font-medium">Communications</span> — Messages or photos submitted via our Report a Problem feature or support emails.</li>
          </ul>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">How We Use Your Information</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li>To process and fulfil your food orders and notify you of status updates.</li>
            <li>To manage your account, authenticate your identity, and maintain account security.</li>
            <li>To communicate with you about your orders, refunds, and support requests.</li>
            <li>To improve the platform, personalise your experience, and conduct internal analytics.</li>
            <li>To comply with our legal obligations under South African law.</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We do <span className="text-foreground font-medium">not</span> sell your personal information to third parties.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Sharing Your Information</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">We may share your information only in the following circumstances:</p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li><span className="text-foreground font-medium">Restaurants</span> — Your name, delivery address, and order details are shared with the restaurant preparing your order.</li>
            <li><span className="text-foreground font-medium">Drivers</span> — Your delivery address and first name are shared with the driver assigned to your delivery.</li>
            <li><span className="text-foreground font-medium">Service providers</span> — Trusted third-party services (such as Supabase for database hosting and authentication) that process data on our behalf under strict data processing agreements.</li>
            <li><span className="text-foreground font-medium">Legal requirements</span> — If required by law, court order, or to protect the rights and safety of our users or the public.</li>
          </ul>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Data Retention</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-muted-foreground">Account data</span>
              <span className="text-sm font-medium">Until account is deleted</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-muted-foreground">Order history</span>
              <span className="text-sm font-medium">5 years (legal requirement)</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-muted-foreground">Support communications</span>
              <span className="text-sm font-medium">2 years</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-muted-foreground">Usage & analytics data</span>
              <span className="text-sm font-medium">12 months</span>
            </div>
          </div>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Cookies & Tracking</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Jozi Eats uses essential cookies and local storage to maintain your login session and remember your theme preference (light/dark/system). We do not use advertising trackers or third-party marketing cookies.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Security</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We take reasonable technical and organisational measures to protect your personal information against unauthorised access, loss, or misuse. All data is encrypted in transit (HTTPS/TLS) and at rest. Access to personal data is restricted to authorised personnel only.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            However, no system is completely secure. If you suspect any unauthorised access to your account, please contact us immediately at{" "}
            <a href="mailto:support@jozieats.co.za" className="text-primary underline underline-offset-2">support@jozieats.co.za</a>.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Your Rights (POPIA)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">Under POPIA, you have the right to:</p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li><span className="text-foreground font-medium">Access</span> — Request a copy of the personal information we hold about you.</li>
            <li><span className="text-foreground font-medium">Correction</span> — Request that we correct inaccurate or incomplete information.</li>
            <li><span className="text-foreground font-medium">Deletion</span> — Request that we delete your personal information, subject to legal retention obligations.</li>
            <li><span className="text-foreground font-medium">Objection</span> — Object to the processing of your personal information in certain circumstances.</li>
            <li><span className="text-foreground font-medium">Complaint</span> — Lodge a complaint with the Information Regulator of South Africa if you believe your rights have been violated.</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To exercise any of these rights, email us at{" "}
            <a href="mailto:support@jozieats.co.za" className="text-primary underline underline-offset-2">support@jozieats.co.za</a>.
            We will respond within 30 days.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Children's Privacy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Jozi Eats is not intended for use by persons under the age of 18. We do not knowingly collect personal information from children. If you believe a child has provided us with their information, please contact us and we will delete it promptly.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Changes to This Policy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We may update this Privacy Policy from time to time. When we do, we'll update the "Last updated" date at the top and, where appropriate, notify you via email or an in-app notice. Your continued use of Jozi Eats after changes take effect constitutes your acceptance of the updated policy.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Contact Us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For any privacy-related questions or to exercise your rights, please contact our Information Officer:
          </p>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-muted-foreground">Email</span>
              <a href="mailto:support@jozieats.co.za" className="text-sm font-medium text-primary underline underline-offset-2">
                support@jozieats.co.za
              </a>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-muted-foreground">Phone</span>
              <span className="text-sm font-medium">011 555 0123</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3">
              <span className="text-sm text-muted-foreground">Hours</span>
              <span className="text-sm font-medium">Mon–Fri, 08:00–18:00 SAST</span>
            </div>
          </div>
        </section>

        <div className="pt-4 pb-8 text-center">
          <p className="text-xs text-muted-foreground">
            This policy is governed by the laws of the Republic of South Africa.
          </p>
        </div>
      </div>
    </div>
  );
}
