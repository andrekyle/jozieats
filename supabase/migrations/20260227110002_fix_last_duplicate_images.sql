-- Fix last 3 duplicate image URLs
-- All URLs verified as 200 OK on 27 Feb 2026

-- Bacon & Cheese Loaded Fries sharing with Chilli Cheese Fries — give bacon loaded fries distinct image
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400' WHERE name = 'Bacon & Cheese Loaded Fries';

-- Mexican Burger sharing with Beef Tacos — give Mexican Burger a burger-specific image
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1610614819513-58e34989848b?w=400' WHERE name = 'Mexican Burger';

-- Chicken Wings (6pc) sharing with Buffalo Wings — give Chicken Wings distinct image
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=400' WHERE name = 'Chicken Wings (6pc)';
