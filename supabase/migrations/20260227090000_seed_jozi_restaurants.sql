-- Seed Johannesburg restaurants with realistic SA pricing (Uber Eats / Mr D style)
-- Using a dummy owner_id since the FK constraint was dropped

DO $$
DECLARE
  dummy_owner UUID := '00000000-0000-0000-0000-000000000000';
  r_id UUID;
BEGIN

-- ===== SANDTON =====

-- Rockets Sandton
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'Rockets Sandton', 'Gourmet burgers, ribs, and wings in the heart of Sandton', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', 'Nelson Mandela Square, Sandton', '011 784 8888', 'Burgers, Ribs', 4.5, 19.99, '25-35 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Classic Smash Burger', 'Double beef patty, cheddar, pickles, Rockets sauce', 89.90, 'Burgers', true),
  (r_id, 'BBQ Bacon Burger', 'Beef patty, streaky bacon, BBQ glaze, onion rings', 109.90, 'Burgers', true),
  (r_id, 'Chicken Burger', 'Crumbed chicken breast, lettuce, mayo, tomato', 84.90, 'Burgers', true),
  (r_id, 'Full Rack Ribs', 'Slow-smoked pork ribs with house BBQ sauce, fries & slaw', 219.90, 'Ribs', true),
  (r_id, 'Half Rack Ribs', 'Half rack with fries and slaw', 149.90, 'Ribs', true),
  (r_id, 'Buffalo Wings (12pc)', 'Crispy wings tossed in buffalo sauce', 119.90, 'Starters', true),
  (r_id, 'Loaded Fries', 'Fries topped with cheese, bacon, jalapeños', 69.90, 'Sides', true),
  (r_id, 'Onion Rings', 'Beer-battered onion rings with ranch dip', 54.90, 'Sides', true),
  (r_id, 'Milkshake', 'Thick shake – chocolate, vanilla, or strawberry', 59.90, 'Drinks', true),
  (r_id, 'Craft Lemonade', 'Fresh-squeezed lemonade with mint', 39.90, 'Drinks', true);

-- Col''Cacchio Sandton
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'Col''Cacchio Sandton', 'Artisan thin-base pizzas with fresh local ingredients', 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800', 'Sandton City Mall, Sandton', '011 784 1419', 'Pizza, Italian', 4.3, 24.99, '30-40 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Margherita', 'Tomato, mozzarella, fresh basil', 89.90, 'Pizza', true),
  (r_id, 'Pepperoni Classico', 'Pepperoni, mozzarella, tomato base', 109.90, 'Pizza', true),
  (r_id, 'Pollo Fungi', 'Grilled chicken, mushrooms, garlic, mozzarella', 124.90, 'Pizza', true),
  (r_id, 'Prawn & Avo', 'Prawns, avo, garlic, chilli, lemon butter', 149.90, 'Pizza', true),
  (r_id, 'Caesar Salad', 'Cos lettuce, parmesan, croutons, caesar dressing', 84.90, 'Salads', true),
  (r_id, 'Chocolate Brownie', 'Warm brownie with vanilla ice cream', 64.90, 'Desserts', true),
  (r_id, 'Tiramisu', 'Classic Italian coffee dessert', 69.90, 'Desserts', true),
  (r_id, 'Sparkling Water 500ml', 'San Pellegrino', 34.90, 'Drinks', true);

-- Yamato Sandton (Sushi)
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'Yamato Sushi', 'Premium Japanese sushi and sashimi', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800', 'Benmore Gardens, Sandton', '011 884 0465', 'Sushi, Japanese', 4.6, 29.99, '35-45 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Salmon Rose (8pc)', 'Salmon, avo, cream cheese, tobiko', 129.90, 'Sushi Rolls', true),
  (r_id, 'Rainbow Roll (8pc)', 'Assorted fish on a California roll', 139.90, 'Sushi Rolls', true),
  (r_id, 'Prawn Tempura Roll (8pc)', 'Crispy prawn tempura, avo, spicy mayo', 119.90, 'Sushi Rolls', true),
  (r_id, 'Salmon Sashimi (10pc)', 'Fresh Norwegian salmon slices', 149.90, 'Sashimi', true),
  (r_id, 'Mixed Sashimi Platter', 'Salmon, tuna, yellowtail – 15 pieces', 219.90, 'Sashimi', true),
  (r_id, 'Chicken Katsu Curry', 'Crumbed chicken with Japanese curry, rice', 109.90, 'Hot Dishes', true),
  (r_id, 'Edamame Beans', 'Steamed and salted edamame', 49.90, 'Starters', true),
  (r_id, 'Miso Soup', 'Traditional Japanese miso with tofu, seaweed', 39.90, 'Starters', true);

-- ===== BRYANSTON =====

-- Doppio Zero Bryanston
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'Doppio Zero Bryanston', 'Italian-inspired café with wood-fired pizzas and fresh pastas', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'Hobart Rd, Bryanston', '011 463 5903', 'Italian, Pizza, Café', 4.4, 19.99, '25-35 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Truffle Mushroom Pizza', 'Wild mushrooms, truffle oil, mozzarella, rocket', 119.90, 'Pizza', true),
  (r_id, 'Chicken Pesto Pasta', 'Grilled chicken, basil pesto, cherry tomatoes, penne', 109.90, 'Pasta', true),
  (r_id, 'Prawn Linguine', 'Tiger prawns, garlic, chilli, white wine, linguine', 139.90, 'Pasta', true),
  (r_id, 'Eggs Benedict', 'Poached eggs, hollandaise, bacon, English muffin', 89.90, 'Breakfast', true),
  (r_id, 'Açaí Bowl', 'Açaí, granola, banana, berries, honey', 79.90, 'Breakfast', true),
  (r_id, 'Flat White', 'Double-shot flat white', 34.90, 'Café', true),
  (r_id, 'Chocolate Fondant', 'Warm chocolate lava cake with vanilla ice cream', 69.90, 'Desserts', true),
  (r_id, 'Fresh Orange Juice', 'Freshly squeezed OJ', 44.90, 'Drinks', true);

-- Ocean Basket Bryanston
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'Ocean Basket Bryanston', 'Fresh seafood platters, fish & chips, and grills', 'https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=800', 'Nicolway Shopping Centre, Bryanston', '011 706 7024', 'Seafood', 4.2, 24.99, '30-40 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Fish & Chips', 'Hake fillets, hand-cut chips, tartare sauce', 99.90, 'Mains', true),
  (r_id, 'Grilled Prawns (6)', 'Mozambican-style peri-peri prawns with rice', 179.90, 'Mains', true),
  (r_id, 'Calamari & Chips', 'Grilled or fried calamari tubes, chips, lemon', 109.90, 'Mains', true),
  (r_id, 'Seafood Platter for 2', 'Prawns, calamari, mussels, line fish, rice, chips', 399.90, 'Platters', true),
  (r_id, 'Prawn Rissoles (4)', 'Crispy crumbed prawn rissoles', 69.90, 'Starters', true),
  (r_id, 'Greek Salad', 'Feta, olives, tomato, cucumber, red onion', 74.90, 'Salads', true),
  (r_id, 'Malva Pudding', 'Classic SA malva with custard', 54.90, 'Desserts', true);

-- ===== RANDBURG =====

-- Nando''s Randburg
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'Nando''s Randburg', 'Flame-grilled PERi-PERi chicken – proudly South African', 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800', 'Randburg Square, Randburg', '011 789 1456', 'Chicken, PERi-PERi', 4.3, 14.99, '20-30 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Quarter Chicken & 1 Side', 'Flame-grilled quarter chicken with your choice of side', 69.90, 'Chicken', true),
  (r_id, 'Half Chicken & 2 Sides', 'Flame-grilled half chicken with two sides', 109.90, 'Chicken', true),
  (r_id, 'Full Chicken & 4 Sides', 'Whole flame-grilled chicken with four sides', 199.90, 'Chicken', true),
  (r_id, 'Chicken Wrap', 'Grilled chicken, cheese, lettuce in a tortilla wrap', 79.90, 'Wraps', true),
  (r_id, 'Espetada (Full)', 'Chicken espetada with garlic bread and chips', 119.90, 'Platters', true),
  (r_id, 'Spicy Rice (Regular)', 'Nando''s famous spicy rice', 29.90, 'Sides', true),
  (r_id, 'Coleslaw', 'Creamy Nando''s coleslaw', 24.90, 'Sides', true),
  (r_id, 'Bottomless Drink', 'Refillable soft drink', 29.90, 'Drinks', true);

-- Kung Fu Kitchen Randburg
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'Kung Fu Kitchen', 'Authentic Chinese and Asian street food', 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800', 'Cresta Shopping Centre, Randburg', '011 476 8899', 'Chinese, Asian', 4.1, 19.99, '25-35 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Sweet & Sour Chicken', 'Crispy chicken in sweet & sour sauce with egg fried rice', 89.90, 'Mains', true),
  (r_id, 'Beef Chow Mein', 'Stir-fried beef with egg noodles and vegetables', 94.90, 'Noodles', true),
  (r_id, 'Chicken Fried Rice', 'Wok-tossed chicken fried rice with egg and veg', 74.90, 'Rice', true),
  (r_id, 'Dim Sum Basket (6pc)', 'Steamed prawn and pork dumplings', 79.90, 'Starters', true),
  (r_id, 'Spring Rolls (4pc)', 'Crispy vegetable spring rolls', 49.90, 'Starters', true),
  (r_id, 'Honey Chilli Chicken', 'Crispy chicken strips in honey chilli glaze', 99.90, 'Mains', true),
  (r_id, 'Wonton Soup', 'Pork wontons in clear broth', 54.90, 'Soups', true);

-- ===== SOWETO =====

-- Sakhumzi Restaurant
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'Sakhumzi Restaurant', 'Traditional South African cuisine on Vilakazi Street', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 'Vilakazi St, Orlando West, Soweto', '011 536 1379', 'Traditional, African', 4.5, 24.99, '30-45 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Mogodu (Tripe)', 'Slow-cooked tripe with pap and chakalaka', 89.90, 'Traditional', true),
  (r_id, 'Beef Stew & Pap', 'Hearty beef stew served with mielie pap', 79.90, 'Traditional', true),
  (r_id, 'Chicken Dust (Quarter)', 'Flame-grilled quarter chicken with pap & sauce', 69.90, 'Grills', true),
  (r_id, 'Oxtail & Rice', 'Tender braised oxtail with rice', 119.90, 'Traditional', true),
  (r_id, 'Chakalaka & Pap', 'Vegetable relish with pap (vegetarian)', 54.90, 'Traditional', true),
  (r_id, 'Braai Platter for 2', 'Boerewors, lamb chops, chicken, pap, sides', 249.90, 'Platters', true),
  (r_id, 'Umqombothi', 'Traditional African beer (500ml)', 29.90, 'Drinks', true),
  (r_id, 'Ginger Beer', 'Homemade ginger beer', 24.90, 'Drinks', true);

-- Chaf-Pozi
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'Chaf-Pozi', 'Modern Soweto street food – burgers, kota, braai', 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=800', 'Vilakazi St, Orlando West, Soweto', '011 536 1610', 'Street Food, Burgers', 4.4, 19.99, '20-30 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Kota (Quarter Loaf)', 'Stuffed quarter bread with chips, polony, atchar, cheese', 44.90, 'Kota', true),
  (r_id, 'Super Kota', 'Quarter loaf with russian, chips, cheese, egg, atchar', 64.90, 'Kota', true),
  (r_id, 'Chaf Burger', 'Beef patty, cheese, lettuce, tomato, fries', 79.90, 'Burgers', true),
  (r_id, 'Prego Chicken Roll', 'Peri-peri chicken in a Portuguese roll with fries', 74.90, 'Rolls', true),
  (r_id, 'Boerewors Roll', 'Grilled boerewors in a roll with chakalaka', 54.90, 'Rolls', true),
  (r_id, 'Braai Chicken Wings (8pc)', 'Flame-grilled wings with peri-peri sauce', 69.90, 'Starters', true),
  (r_id, 'Fat Cakes (4pc)', 'Traditional vetkoek with mince filling', 39.90, 'Sides', true),
  (r_id, 'Mageu (500ml)', 'Traditional fermented maize drink', 19.90, 'Drinks', true);

-- ===== ROSEBANK =====

-- The Grillhouse Rosebank
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'The Grillhouse Rosebank', 'Premium steaks and grill, aged to perfection', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', 'The Firs, Rosebank', '011 880 3945', 'Steakhouse, Grill', 4.7, 29.99, '35-45 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Fillet Steak 200g', '200g prime beef fillet, flame-grilled', 199.90, 'Steaks', true),
  (r_id, 'Sirloin 300g', '300g aged sirloin with pepper sauce', 179.90, 'Steaks', true),
  (r_id, 'Ribeye 400g', '400g bone-in ribeye, herb butter', 229.90, 'Steaks', true),
  (r_id, 'Lamb Cutlets', 'Grilled lamb cutlets with mint jelly, veg', 189.90, 'Grills', true),
  (r_id, 'Prawn Cocktail', 'Classic prawn cocktail with Marie Rose', 89.90, 'Starters', true),
  (r_id, 'Creamed Spinach', 'Rich and creamy spinach side', 44.90, 'Sides', true),
  (r_id, 'Baked Potato', 'Loaded with sour cream, bacon, chives', 49.90, 'Sides', true),
  (r_id, 'Crème Brûlée', 'Classic vanilla crème brûlée', 69.90, 'Desserts', true);

-- Tashas Rosebank
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'Tashas Rosebank', 'Elegant café and bistro with wholesome, fresh dishes', 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800', 'The Zone @ Rosebank Mall, Rosebank', '011 447 3041', 'Café, Healthy, Salads', 4.5, 24.99, '25-35 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Avo Toast', 'Smashed avo, poached eggs, sourdough, chilli flakes', 89.90, 'Breakfast', true),
  (r_id, 'Salmon Poke Bowl', 'Fresh salmon, edamame, avo, sushi rice, sesame', 129.90, 'Bowls', true),
  (r_id, 'Grilled Chicken Salad', 'Grilled chicken breast, mixed leaves, feta, honey mustard', 109.90, 'Salads', true),
  (r_id, 'Tashas Chicken Schnitzel', 'Crumbed chicken breast, lemon, chips, salad', 119.90, 'Mains', true),
  (r_id, 'Beetroot & Quinoa Salad', 'Roasted beetroot, quinoa, goat cheese, rocket', 99.90, 'Salads', true),
  (r_id, 'Cappuccino', 'Single or double-shot cappuccino', 36.90, 'Café', true),
  (r_id, 'Iced Latte', 'Cold brew espresso with milk over ice', 44.90, 'Café', true),
  (r_id, 'Red Velvet Cake', 'Layered red velvet with cream cheese frosting', 64.90, 'Desserts', true);

-- ===== MELVILLE =====

-- Lucky Bean Melville
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'Lucky Bean Melville', 'Trendy café on 7th Street with artisan coffee and brunch', 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', '7th Street, Melville', '011 482 4983', 'Café, Breakfast', 4.3, 19.99, '20-30 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Big Breakfast', 'Eggs, bacon, boerewors, toast, tomato, mushrooms', 99.90, 'Breakfast', true),
  (r_id, 'Pancake Stack', 'Fluffy pancakes with berries, maple syrup, cream', 74.90, 'Breakfast', true),
  (r_id, 'Chicken Mayo Sandwich', 'Toasted ciabatta with grilled chicken and avo mayo', 79.90, 'Sandwiches', true),
  (r_id, 'Beef Burger & Chips', 'Gourmet beef burger, cheese, hand-cut chips', 94.90, 'Burgers', true),
  (r_id, 'Halloumi Salad', 'Grilled halloumi, roasted veg, leaves, balsamic', 89.90, 'Salads', true),
  (r_id, 'Cortado', 'Double espresso with a dash of steamed milk', 32.90, 'Café', true),
  (r_id, 'Chai Latte', 'Spiced chai with steamed milk', 39.90, 'Café', true),
  (r_id, 'Banana Bread', 'Warm banana bread with butter', 39.90, 'Treats', true);

-- ===== FOURWAYS =====

-- RocoMamas Fourways
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'RocoMamas Fourways', 'Rock-star smash burgers and loaded fries', 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=800', 'Fourways Mall, Fourways', '011 465 1234', 'Burgers, American', 4.2, 19.99, '20-30 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'OG Smash Burger', 'Double smashed beef, American cheese, pickles', 84.90, 'Burgers', true),
  (r_id, 'Mexican Burger', 'Beef patty, jalapeños, guac, nachos, chipotle mayo', 99.90, 'Burgers', true),
  (r_id, 'Nashville Hot Chicken Burger', 'Fried chicken, Nashville hot sauce, slaw', 94.90, 'Burgers', true),
  (r_id, 'Bacon & Cheese Loaded Fries', 'Fries with melted cheese, crispy bacon, ranch', 64.90, 'Loaded Fries', true),
  (r_id, 'Chilli Cheese Fries', 'Fries topped with beef chilli and cheddar', 74.90, 'Loaded Fries', true),
  (r_id, 'Chicken Wings (6pc)', 'Choose your sauce: BBQ, peri-peri, or buffalo', 74.90, 'Starters', true),
  (r_id, 'Oreo Milkshake', 'Thick Oreo cookie milkshake', 54.90, 'Drinks', true),
  (r_id, 'Fanta Orange', '440ml can', 24.90, 'Drinks', true);

-- Mex Fourways (Mexican)
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'El Taco Loco', 'Authentic Mexican street food – tacos, burritos, quesadillas', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800', 'Leaping Frog Centre, Fourways', '011 467 7788', 'Mexican', 4.1, 19.99, '25-35 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Beef Tacos (3pc)', 'Soft corn tortillas, seasoned beef, salsa, sour cream', 79.90, 'Tacos', true),
  (r_id, 'Chicken Burrito', 'Grilled chicken, rice, beans, cheese, guac in a flour tortilla', 89.90, 'Burritos', true),
  (r_id, 'Cheese Quesadilla', 'Melted cheese in a crispy tortilla with salsa', 64.90, 'Quesadillas', true),
  (r_id, 'Nachos Supreme', 'Loaded nachos with beef, cheese, jalapeños, guac, sour cream', 94.90, 'Sharing', true),
  (r_id, 'Fish Tacos (3pc)', 'Beer-battered fish, cabbage slaw, chipotle mayo', 89.90, 'Tacos', true),
  (r_id, 'Churros (5pc)', 'Cinnamon sugar churros with chocolate sauce', 49.90, 'Desserts', true),
  (r_id, 'Frozen Margarita', 'Classic lime frozen margarita', 69.90, 'Drinks', true),
  (r_id, 'Mexican Coke', 'Glass bottle Mexican Coca-Cola', 29.90, 'Drinks', true);

-- ===== GREENSIDE / PARKHURST =====

-- Craft Kitchen Parkhurst
r_id := gen_random_uuid();
INSERT INTO public.restaurants (id, owner_id, name, description, cover_image_url, address, phone, cuisine, rating, delivery_fee, estimated_delivery_time, is_active)
VALUES (r_id, dummy_owner, 'Craft Kitchen Parkhurst', 'Locally sourced, seasonal menu on trendy 4th Avenue', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', '4th Avenue, Parkhurst', '011 447 0011', 'Healthy, Contemporary', 4.4, 24.99, '30-40 min', true);
INSERT INTO public.menu_items (restaurant_id, name, description, price, category, is_available) VALUES
  (r_id, 'Buddha Bowl', 'Quinoa, roasted sweet potato, chickpeas, tahini, greens', 99.90, 'Bowls', true),
  (r_id, 'Grilled Linefish', 'Catch of the day with roasted veg and lemon butter', 149.90, 'Mains', true),
  (r_id, 'Lamb Shoulder', 'Slow-roasted lamb shoulder with rosemary jus, mash', 169.90, 'Mains', true),
  (r_id, 'Smoked Trout Salad', 'Smoked trout, avo, fennel, citrus dressing', 109.90, 'Salads', true),
  (r_id, 'Mushroom Risotto', 'Creamy arborio rice with wild mushrooms, parmesan', 114.90, 'Mains', true),
  (r_id, 'Cheese Board', 'Selection of local cheeses with crackers, preserves', 129.90, 'Sharing', true),
  (r_id, 'Craft Beer (500ml)', 'Rotating local craft beer on tap', 54.90, 'Drinks', true),
  (r_id, 'Kombucha', 'House-brewed kombucha', 44.90, 'Drinks', true);

END $$;
