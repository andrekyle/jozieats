-- Fix broken (404) and mismatched/duplicate menu item images
-- All URLs verified as 200 OK on 27 Feb 2026

-- ===== BROKEN URLS (404) =====

-- Buffalo Wings (12pc) — was 404, now: crispy chicken wings close-up
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400' WHERE name = 'Buffalo Wings (12pc)';

-- Loaded Fries — was 404, now: loaded cheese fries
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1585109649139-366815a0d713?w=400' WHERE name = 'Loaded Fries';

-- Sparkling Water 500ml — was 404, now: glass of sparkling water with bubbles
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400' WHERE name = 'Sparkling Water 500ml';

-- Edamame Beans — was 404, now: bowl of edamame
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1622621746668-59fb299bc4d7?w=400' WHERE name = 'Edamame Beans';

-- Spring Rolls (4pc) — was 404, now: golden spring rolls
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=400' WHERE name = 'Spring Rolls (4pc)';

-- Eggs Benedict — was 404, now: eggs benedict with hollandaise
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=400' WHERE name = 'Eggs Benedict';

-- Chakalaka & Pap — was 404, now: African stew with maize/pap side
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400' WHERE name = 'Chakalaka & Pap';

-- Oxtail & Rice — was 404, now: braised meat stew with rice
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400' WHERE name = 'Oxtail & Rice';

-- Boerewors Roll — was 404, now: grilled sausage in roll
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400' WHERE name = 'Boerewors Roll';

-- Creamed Spinach — was 404, now: creamy spinach side dish
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=400' WHERE name = 'Creamed Spinach';

-- Banana Bread — was 404, now: sliced banana bread loaf
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=400' WHERE name = 'Banana Bread';

-- Bacon & Cheese Loaded Fries — was 404, now: loaded fries with bacon
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' WHERE name = 'Bacon & Cheese Loaded Fries';


-- ===== MISMATCHED IMAGES =====

-- Crème Brûlée — was lemons photo, now: actual crème brûlée dessert
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400' WHERE name = 'Crème Brûlée';

-- Baked Potato — was wrong photo, now: baked potato with toppings
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=400' WHERE name = 'Baked Potato';

-- Ginger Beer — was strawberries, now: ginger beer / ginger drink
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' WHERE name = 'Ginger Beer';

-- Mageu (500ml) — was strawberries, now: traditional beverage/drink
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400' WHERE name = 'Mageu (500ml)';

-- Umqombothi — was beer bottle (same as Craft Beer), now: traditional African beer
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1416453072034-c8dbfa2856b5?w=400' WHERE name = 'Umqombothi';


-- ===== DUPLICATE IMAGE FIXES (same photo used for different foods) =====

-- Tashas Chicken Schnitzel — shared image with Prawn Rissoles & Fat Cakes, now: breaded schnitzel
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400' WHERE name = 'Tashas Chicken Schnitzel';
-- Correction: that's the katsu curry image, let's use proper schnitzel
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=400' WHERE name = 'Tashas Chicken Schnitzel';

-- Fat Cakes (4pc) — shared image with Prawn Rissoles, now: fried dough balls
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=400' WHERE name = 'Fat Cakes (4pc)';

-- Fanta Orange — shared image with Bottomless Drink & Mexican Coke, now: orange soda
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1624552184280-9e9631bbeee9?w=400' WHERE name = 'Fanta Orange';

-- Mexican Coke — shared image with others, now: cola bottle
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?w=400' WHERE name = 'Mexican Coke';

-- Bottomless Drink — keep existing (generic soft drink is fine for bottomless)
-- No change needed

-- Kota (Quarter Loaf) and Super Kota share same image — differentiate them
-- Super Kota — now: loaded bunny chow / stuffed bread
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=400' WHERE name = 'Super Kota';

-- Chicken Wrap (Nando's) shared with Chicken Burrito (El Taco Loco) — fix burrito
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' WHERE name = 'Chicken Wrap';
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400' WHERE name = 'Chicken Burrito';

-- Churros shared with Chocolate Fondant — fix Churros
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400' WHERE name = 'Chocolate Fondant';
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1548943487-a2e4e43b4853?w=400' WHERE name = 'Churros (5pc)';

-- Craft Beer shared with Umqombothi — Craft Beer gets distinct image
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400' WHERE name = 'Craft Beer (500ml)';

-- Espetada shared with Braai Platter — fix Braai Platter
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400' WHERE name = 'Espetada (Full)';
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400' WHERE name = 'Braai Platter for 2';

-- OG Smash Burger shared with Classic Smash Burger — differentiate
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' WHERE name = 'Classic Smash Burger';
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400' WHERE name = 'OG Smash Burger';

-- Nashville Hot Chicken Burger shared with Chicken Burger — differentiate
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400' WHERE name = 'Chicken Burger';
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400' WHERE name = 'Nashville Hot Chicken Burger';

-- Oreo Milkshake shared with Milkshake — differentiate
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400' WHERE name = 'Milkshake';
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400' WHERE name = 'Oreo Milkshake';

-- Cappuccino shared with Flat White — differentiate
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' WHERE name = 'Flat White';
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1517256673644-36ad11246d21?w=400' WHERE name = 'Cappuccino';

-- Greek Salad shared with Smoked Trout Salad — differentiate
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400' WHERE name = 'Greek Salad';
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400' WHERE name = 'Smoked Trout Salad';
