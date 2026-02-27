

# 🍔 Food Delivery App — Implementation Plan

## Design Direction
Clean, minimal Apple/Microsoft-inspired design: generous whitespace, SF Pro-style typography, subtle shadows, smooth animations, muted color palette with bold accent colors. Card-based layouts with rounded corners and glass-morphism touches.

---

## Phase 1: Foundation & Auth
- Set up Lovable Cloud (database, auth, storage)
- Configure PWA (installable from browser, offline support, app icons)
- Build login/signup screens (email + Google sign-in) with sleek Apple-style forms
- Create user roles system (customer, restaurant owner, driver, admin) with secure role-based routing
- Build user profiles table with auto-creation on signup

## Phase 2: Customer Experience
- **Home screen**: Location selector, search bar, category filters (Fast Food, Pizza, Healthy, etc.), featured restaurants carousel
- **Restaurant listing**: Cards with image, name, rating, delivery time, delivery fee
- **Restaurant detail page**: Menu organized by categories, item cards with images and prices
- **Item detail modal**: Customization options (size, extras, special instructions)
- **Cart**: Slide-up cart drawer with item list, quantities, subtotal, delivery fee, total
- **Checkout**: Delivery address input, payment method selection (mock), order summary, place order button
- **Order tracking**: Real-time order status timeline (Placed → Preparing → Out for Delivery → Delivered)
- **Order history**: Past orders with reorder option

## Phase 3: Restaurant Dashboard
- **Orders management**: Incoming orders with accept/reject, active orders list, order history
- **Menu management**: Add/edit/delete menu items with images, set prices, mark items unavailable
- **Restaurant profile**: Edit name, description, logo, operating hours, delivery radius
- **Analytics**: Simple stats — orders today, revenue, popular items

## Phase 4: Delivery Driver App
- **Available deliveries**: List of nearby orders ready for pickup
- **Active delivery view**: Pickup address, dropoff address, customer details, order summary
- **Status updates**: Mark as picked up → on the way → delivered
- **Earnings summary**: Today's deliveries and earnings

## Phase 5: Admin Panel
- **Dashboard**: Platform overview — total orders, active users, revenue
- **Restaurant management**: Approve/suspend restaurants, view all listings
- **User management**: View customers, drivers, restaurant owners; assign/revoke roles
- **Order oversight**: View and manage all orders across the platform

## Phase 6: Polish & PWA
- Install prompt page for mobile users
- Push notification placeholders for order updates
- Smooth page transitions and micro-animations
- Dark mode support
- Responsive design optimized for mobile-first

