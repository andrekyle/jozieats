import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  UtensilsCrossed,
  ShoppingBag,
  MapPin,
  Search,
  Bell,
  CreditCard,
  Camera,
  BarChart3,
  ClipboardList,
  ChefHat,
  Truck,
  Shield,
  Users,
  Star,
  Clock,
  Smartphone,
  Moon,
  Globe,
  Heart,
  Zap,
  Lock,
  Palette,
  Database,
  Code2,
  Layers,
  ArrowRight,
  CheckCircle2,
  Package,
  Banknote,
  Eye,
  TrendingUp,
  Navigation,
  ImageIcon,
  Filter,
  PieChart,
  Activity,
  Settings,
  UserCheck,
  Coins,
  Route,
  MessageSquare,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 glass px-4 py-3 flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold tracking-wide">About Jozi Eats</h1>
      </div>

      {/* Hero */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden border-b border-border"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/40 to-transparent dark:from-secondary/20" />

        <div className="relative px-5 pt-10 pb-20 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto h-20 w-20 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center mb-5"
          >
            <img src="/logo.png" alt="Jozi Eats" className="h-14 w-14 object-contain" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-extrabold tracking-tight"
          >
            Jozi Eats
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-3 text-base text-muted-foreground leading-relaxed max-w-lg mx-auto"
          >
            Johannesburg's modern food delivery platform. Discover restaurants across the city,
            order your favourite meals, and track delivery to your door — all priced in South African Rands.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-3 mt-6"
          >
            <Button
              onClick={() => navigate("/")}
              className="rounded-lg bg-[#1A6FDB] hover:bg-[#1558B0] text-white font-semibold text-xs uppercase tracking-wider px-5 h-10"
            >
              Start Ordering <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/auth")}
              className="rounded-lg font-semibold text-xs uppercase tracking-wider px-5 h-10"
            >
              Sign In
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <div className="px-5 max-w-2xl mx-auto space-y-16 mt-20 pb-16">

        {/* For Customers */}
        <FeatureSection
          icon={UtensilsCrossed}
          color="text-orange-500"
          bg="bg-orange-500/10"
          title="For Customers"
          subtitle="Discover, order, and enjoy food from Johannesburg's best restaurants"
          features={[
            { icon: Search, title: "Smart Search & Discovery", desc: "Search restaurants by name, cuisine type, or area. Browse 14 curated Johannesburg restaurants spanning PERi-PERi, steakhouse, sushi, traditional SA, street food, and more." },
            { icon: Filter, title: "Area Filter", desc: "Select your neighbourhood from the header — Sandton, Rosebank, Braamfontein, Melville, Greenside, Maboneng, Parkhurst, or Fourways — to see only nearby restaurants." },
            { icon: ImageIcon, title: "Visual Menus", desc: "Every menu item comes with a high-quality photo, detailed description, and price in Rands. Over 120 items across 12 SA cuisine categories." },
            { icon: ShoppingBag, title: "Cart & Checkout", desc: "Add multiple items with quantity selectors, review your cart in a slide-out drawer, enter your delivery address, add special instructions, and confirm your order." },
            { icon: Navigation, title: "Real-Time Order Tracking", desc: "Follow every step: Pending → Confirmed → Preparing → Ready for Pickup → Picked Up → Delivered. See your driver info and estimated times." },
            { icon: Clock, title: "Order History", desc: "Full history of all past orders with colour-coded status badges, restaurant names, dates, and totals. Tap any order to view full details." },
            { icon: Camera, title: "Report a Problem", desc: "Had an issue? Select a reason (missing items, wrong order, quality, late delivery), describe the problem, attach photos, and submit a refund request." },
            { icon: Eye, title: "Request Tracking", desc: "Monitor your refund requests with real-time status updates, admin notes, photo thumbnails, and colour-coded progress badges." },
            { icon: Banknote, title: "Cash on Delivery", desc: "Default payment method — pay the driver when your food arrives. Card (Visa, Mastercard) and EFT integration coming soon." },
          ]}
        />

        {/* For Restaurant Owners */}
        <FeatureSection
          icon={ChefHat}
          color="text-[#1A6FDB]"
          bg="bg-[#1A6FDB]/10"
          title="For Restaurant Owners"
          subtitle="A complete dashboard to run your restaurant operations"
          features={[
            { icon: ClipboardList, title: "Live Order Queue", desc: "Incoming orders appear in real time with pending count pulse badges, customer name, phone number, order items, total, delivery address, time since order, and special instructions." },
            { icon: CheckCircle2, title: "Order Actions", desc: "One-tap actions: Accept or Reject pending orders, mark as Preparing, then Ready for Pickup. Colour-coded status badges (amber/blue/purple/green) for instant visibility." },
            { icon: UtensilsCrossed, title: "Menu Manager", desc: "Full CRUD for menu items — add, edit, delete with confirmation dialog. Items are grouped by category in collapsible sections with image thumbnails and availability toggles." },
            { icon: Search, title: "Menu Search & Counts", desc: "Search bar to filter menu items instantly. Available and hidden item counts displayed at the top. Form includes image URL preview." },
            { icon: BarChart3, title: "Revenue Analytics", desc: "Three stat cards (today / this week / this month) with coloured icon backgrounds. Animated 7-day bar chart showing daily revenue trends." },
            { icon: PieChart, title: "Business Insights", desc: "Average order value, cancellation rate percentage, peak ordering hour, and a dedicated insights section with actionable tips." },
            { icon: Settings, title: "Restaurant Profile", desc: "Sectioned form: Basic Info, Contact & Location, Delivery Settings, and Images. Cover image and logo preview. Active/inactive status with visual indicator dot." },
          ]}
        />

        {/* For Drivers */}
        <FeatureSection
          icon={Truck}
          color="text-emerald-500"
          bg="bg-emerald-500/10"
          title="For Drivers"
          subtitle="Pick up deliveries, track routes, and grow your earnings"
          features={[
            { icon: Package, title: "Available Deliveries", desc: "Browse open orders with green-bordered cards showing delivery fee highlight, order total, restaurant name, and time since the order was placed." },
            { icon: Route, title: "Active Delivery View", desc: "Route visualisation with MapPin → Navigation dotted-line graphic. Status badges (amber for pickup, blue for in-transit), customer name, and phone call link." },
            { icon: Coins, title: "Earnings Dashboard", desc: "Four stat cards: today's earnings, this week, lifetime total, and average per trip. Animated 7-day earnings bar chart." },
            { icon: Activity, title: "Delivery History", desc: "Recent deliveries list with green (completed) and red (cancelled) status indicators, restaurant names, and delivery fee earned per trip." },
            { icon: Bell, title: "Tab Badges", desc: "Live badge counts on Available and Active tabs so you always know how many orders are waiting or in progress." },
          ]}
        />

        {/* For Admins */}
        <FeatureSection
          icon={Shield}
          color="text-amber-500"
          bg="bg-amber-500/10"
          title="For Admins"
          subtitle="Full visibility and control over the entire platform"
          features={[
            { icon: TrendingUp, title: "Platform Overview", desc: "Today's orders & revenue, active orders, week revenue — all as stat cards. Animated 7-day bar chart. Delivered, cancelled, and cancel-rate breakdown row." },
            { icon: Database, title: "Full Platform Stats", desc: "Total revenue, total delivery fees, all-time order count, active vs. total restaurants, registered users, total drivers, and restaurant owners." },
            { icon: Star, title: "Restaurant Management", desc: "Search by name, logo thumbnails, cuisine type, delivery fee, address. Active/inactive counts with visual opacity. Delete confirmation dialog." },
            { icon: UserCheck, title: "User Management", desc: "Search by name, role filter dropdown with clickable summary pills and counts. Colour-coded role badges (Customer=blue, Owner=purple, Driver=green, Admin=amber) with remove button." },
            { icon: ClipboardList, title: "Order Management", desc: "Search by order ID, restaurant, customer, or address. Status filter with dropdown and clickable pills. Customer name, delivery fee, driver indicator. Smart time formatting." },
            { icon: Users, title: "Role Assignment", desc: "Add or remove roles directly from the user card. Users can hold multiple roles simultaneously (customer + admin + owner + driver)." },
          ]}
        />

        {/* User Account */}
        <FeatureSection
          icon={Users}
          color="text-sky-500"
          bg="bg-sky-500/10"
          title="User Account & Profile"
          subtitle="Personal settings, orders, and support"
          features={[
            { icon: Users, title: "Profile Card", desc: "Avatar with initials, full name, email. Stats row: total orders, delivered count (green), and total amount spent in Rands." },
            { icon: Layers, title: "Role-Based Dashboards", desc: "Your profile automatically shows navigation links to Admin Panel, Restaurant Dashboard, or Driver Dashboard — based on your assigned roles." },
            { icon: Settings, title: "Editable Details", desc: "Inline edit for name and phone with save/cancel. Email displayed (read-only from auth provider). South African phone format placeholder." },
            { icon: MessageSquare, title: "Support Section", desc: "My Requests (refund tracking), Help Centre (contact info), Refund Policy page, and this About page — all accessible from your profile." },
            { icon: Palette, title: "Appearance Toggle", desc: "Switch between Light, Dark, and System themes. Selection persists across sessions. Dark mode is the default." },
            { icon: Lock, title: "Secure Sign In/Out", desc: "Email + password or Google OAuth. Sign-out with confirmation dialog. Session managed by Supabase Auth." },
          ]}
        />

        {/* Platform & Design */}
        <FeatureSection
          icon={Globe}
          color="text-[#1A6FDB]"
          bg="bg-[#1A6FDB]/10"
          title="Platform & Design"
          subtitle="The engineering and design behind Jozi Eats"
          features={[
            { icon: Heart, title: "Woolworths SA Styling", desc: "Nunito Sans font family, charcoal-on-white palette, 0.5rem border radius, rounded-lg cards, tracking-wide uppercase headings, and font-semibold uppercase buttons." },
            { icon: Moon, title: "Dark Mode System", desc: "ThemeContext with light / dark / system detection. Default dark. FOUC (flash of unstyled content) prevention via inline script in index.html." },
            { icon: Smartphone, title: "Mobile-First PWA", desc: "Fully responsive design optimised for phones. Web app manifest with icons (192px, 512px). Installable on home screen. SPA routing via Vercel rewrites." },
            { icon: Zap, title: "Performance", desc: "Vite build system for fast HMR and optimised production bundles. React Query for intelligent data caching and background refetching. Framer Motion for GPU-accelerated animations." },
            { icon: Lock, title: "Authentication", desc: "Supabase Auth with email/password and Google OAuth. Row-level security on all database tables. Role-based access control via user_roles table." },
            { icon: Globe, title: "South African Localisation", desc: "All prices in Rands (R). South African phone format (+27). en-ZA date locale. Real Johannesburg restaurant names and areas. SA cuisine categories." },
          ]}
        />

        {/* Tech Stack */}
        <motion.section
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="pt-6"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-secondary/80 flex items-center justify-center shrink-0">
              <Code2 className="h-[18px] w-[18px] text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-wide">Tech Stack</h3>
              <p className="text-sm text-muted-foreground">Modern tools for a modern platform</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "React 18", desc: "UI framework with hooks & concurrent features", icon: Code2 },
              { name: "TypeScript", desc: "Type-safe development across the stack", icon: FileText },
              { name: "Vite", desc: "Lightning-fast dev server & build tool", icon: Zap },
              { name: "Tailwind CSS", desc: "Utility-first styling with custom design tokens", icon: Palette },
              { name: "shadcn/ui", desc: "Radix-based accessible component library", icon: Layers },
              { name: "Supabase", desc: "Postgres database, Auth, Storage, and APIs", icon: Database },
              { name: "React Query", desc: "Server state management & caching", icon: Activity },
              { name: "Framer Motion", desc: "Production-ready animations & transitions", icon: Star },
            ].map(({ name, desc, icon: Icon }) => (
              <motion.div
                key={name}
                variants={scaleIn}
                className="bg-card border border-border rounded-xl p-4 flex gap-3 items-start"
              >
                <Icon className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-[#1A6FDB] to-[#1558B0] rounded-2xl p-6 text-center text-white"
        >
          <h3 className="text-lg font-extrabold tracking-tight">Ready to order?</h3>
          <p className="text-sm text-white/70 mt-1.5 max-w-sm mx-auto leading-relaxed">
            Explore Johannesburg's finest restaurants and get your favourite meals delivered in minutes.
          </p>
          <Button
            onClick={() => navigate("/")}
            className="mt-5 rounded-lg bg-white text-[#1A6FDB] hover:bg-white/90 font-semibold text-xs uppercase tracking-wider px-6 h-10"
          >
            Browse Restaurants <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </motion.section>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center space-y-2 pt-2 pb-8"
        >
          <p className="text-xs text-muted-foreground">
            React · TypeScript · Tailwind CSS · shadcn/ui · Supabase · Framer Motion
          </p>
          <p className="text-[10px] text-muted-foreground/40">
            Jozi Eats v1.0 · Made in Johannesburg 🇿🇦
          </p>
        </motion.div>
      </div>
    </div>
  );
}

/* Feature Section */
function FeatureSection({
  icon: SectionIcon,
  color,
  bg,
  title,
  subtitle,
  features,
}: {
  icon: any;
  color: string;
  bg: string;
  title: string;
  subtitle: string;
  features: { icon: any; title: string; desc: string }[];
}) {
  return (
    <motion.section
      variants={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="pt-6"
    >
      {/* Section Header */}
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
        <div className={`h-9 w-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
          <SectionIcon className={`h-[18px] w-[18px] ${color}`} />
        </div>
        <div>
          <h3 className="text-lg font-bold tracking-wide">{title}</h3>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </motion.div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {features.map(({ icon: FeatureIcon, title: fTitle, desc }) => (
          <motion.div
            key={fTitle}
            variants={fadeUp}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <FeatureIcon className={`h-4 w-4 ${color} shrink-0 mt-1`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold">{fTitle}</p>
                <p className="text-xs text-muted-foreground leading-relaxed mt-1">{desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
