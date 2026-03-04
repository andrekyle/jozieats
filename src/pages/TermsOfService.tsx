import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" className="rounded-lg shrink-0" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-base font-semibold tracking-wide">Terms of Service</h1>
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
            Welcome to Jozi Eats. By accessing or using our platform — including the website, progressive web app, and any related services (collectively, the "Platform") — you agree to be bound by these Terms of Service ("Terms"). Please read them carefully before using Jozi Eats.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These Terms constitute a binding legal agreement between you and Jozi Eats (Pty) Ltd ("Jozi Eats", "we", "us", or "our"), a company registered in the Republic of South Africa.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Eligibility</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You must be at least 18 years old to use Jozi Eats. By creating an account, you confirm that:
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li>You are 18 years of age or older.</li>
            <li>You have the legal capacity to enter into a binding agreement.</li>
            <li>All information you provide is accurate and up to date.</li>
            <li>You are not prohibited from using this Platform under any applicable law.</li>
          </ul>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Your Account</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You agree to:
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li>Provide accurate and complete registration information.</li>
            <li>Keep your password secure and not share it with anyone.</li>
            <li>Notify us immediately at <a href="mailto:support@jozieats.co.za" className="text-primary underline underline-offset-2">support@jozieats.co.za</a> if you suspect unauthorised access.</li>
            <li>Not create accounts for others without their consent.</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate these Terms or that we reasonably believe have been compromised.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Placing Orders</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When you place an order through Jozi Eats, you are entering into a contract directly with the restaurant. Jozi Eats acts as a technology platform connecting customers, restaurants, and drivers — we are not a party to the sale of food.
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li>Orders are confirmed only once you receive an in-app confirmation.</li>
            <li>You are responsible for providing an accurate delivery address.</li>
            <li>You must be available at the delivery address to receive your order.</li>
            <li>Once a restaurant has started preparing your order, it may not be possible to cancel without charge.</li>
            <li>Prices displayed are in South African Rands (ZAR) and include applicable taxes.</li>
          </ul>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Delivery</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Delivery times are estimates only and may vary due to traffic, weather, restaurant preparation time, or driver availability. Jozi Eats is not liable for delays beyond our reasonable control.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If a driver is unable to complete delivery due to the customer being unreachable or an incorrect address, you may not be eligible for a refund. See our{" "}
            <button onClick={() => navigate("/refund-policy")} className="text-primary font-medium underline underline-offset-2">Refund Policy</button>{" "}
            for full details.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Payments</h2>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li><span className="text-foreground font-medium">Cash on Delivery</span> — Pay the driver upon receipt of your order. The exact amount is displayed at checkout.</li>
            <li><span className="text-foreground font-medium">Card payments</span> — Where available, card payments are processed securely by our payment provider. Jozi Eats does not store card details.</li>
            <li><span className="text-foreground font-medium">Delivery fees</span> — A delivery fee set by each restaurant applies and is shown before you confirm your order.</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All transactions are in South African Rands (ZAR). Jozi Eats is not responsible for any bank charges or currency conversion fees applied by your financial institution.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Acceptable Use</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">You agree not to use the Platform to:</p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li>Place fraudulent, false, or test orders.</li>
            <li>Harass, threaten, or abuse restaurants, drivers, or other users.</li>
            <li>Attempt to gain unauthorised access to our systems or other users' accounts.</li>
            <li>Use automated bots, scrapers, or scripts to interact with the Platform.</li>
            <li>Upload or transmit malicious code, spam, or illegal content.</li>
            <li>Circumvent any security or access-control measures.</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Violation of these rules may result in immediate account suspension and, where appropriate, referral to law enforcement.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Intellectual Property</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All content on the Jozi Eats Platform — including but not limited to the logo, design, text, graphics, and software — is the property of Jozi Eats (Pty) Ltd or its licensors and is protected by South African and international intellectual property laws.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You may not copy, reproduce, modify, distribute, or create derivative works from any part of our Platform without express written permission.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Limitation of Liability</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To the maximum extent permitted by South African law, Jozi Eats shall not be liable for:
          </p>
          <ul className="text-sm text-muted-foreground leading-relaxed space-y-2">
            <li>Any indirect, incidental, special, or consequential loss arising from your use of the Platform.</li>
            <li>The quality, safety, or suitability of food prepared by restaurants.</li>
            <li>Loss or damage caused by events outside our reasonable control (force majeure).</li>
            <li>Service interruptions due to maintenance, technical failures, or third-party outages.</li>
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our total liability to you in connection with any claim shall not exceed the value of the order to which the claim relates. Nothing in these Terms limits liability for death or personal injury caused by our negligence, or for fraud.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Termination</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You may close your account at any time by contacting us at{" "}
            <a href="mailto:support@jozieats.co.za" className="text-primary underline underline-offset-2">support@jozieats.co.za</a>.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We reserve the right to suspend or permanently terminate your account, without notice, if you breach these Terms, engage in fraudulent activity, or if we are required to do so by law. Upon termination, your right to use the Platform ceases immediately.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Changes to These Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We may update these Terms from time to time. We'll notify you of material changes via email or an in-app notice. The "Last updated" date at the top of this page will always reflect the most recent revision. Continued use of the Platform after changes take effect constitutes acceptance of the updated Terms.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Governing Law</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These Terms are governed by and construed in accordance with the laws of the Republic of South Africa. Any disputes arising from these Terms or your use of the Platform shall be subject to the exclusive jurisdiction of the courts of South Africa.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            These Terms are also subject to the Consumer Protection Act 68 of 2008 and the Electronic Communications and Transactions Act 25 of 2002, where applicable. Nothing in these Terms limits your rights under South African consumer protection legislation.
          </p>
        </section>

        <hr className="border-border" />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider">Contact Us</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For any questions about these Terms, please reach us at:
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
            These Terms are governed by the laws of the Republic of South Africa.
          </p>
        </div>
      </div>
    </div>
  );
}
