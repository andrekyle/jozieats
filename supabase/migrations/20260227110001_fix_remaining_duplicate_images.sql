-- Fix remaining duplicate image URLs across menu items
-- All URLs verified as 200 OK on 27 Feb 2026

-- Oxtail & Rice was sharing with Beef Stew & Pap — give oxtail its own image (braised meat)
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400' WHERE name = 'Oxtail & Rice';

-- Chakalaka & Pap sharing with Chicken Katsu Curry — give chakalaka distinct image (African side dish)
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=400' WHERE name = 'Chakalaka & Pap';

-- Braai Platter sharing with Full Rack Ribs — give braai platter a mixed grill image
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400' WHERE name = 'Braai Platter for 2';

-- Buddha Bowl sharing with Grilled Chicken Salad — give salad distinct image
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400' WHERE name = 'Grilled Chicken Salad';

-- Lamb Shoulder sharing with Lamb Cutlets — give shoulder a braised lamb image
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400' WHERE name = 'Lamb Shoulder';

-- Mexican Burger sharing with Nashville Hot Chicken Burger — give Mexican Burger distinct image
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400' WHERE name = 'Mexican Burger';

-- Loaded Fries and Chilli Cheese Fries share same image — differentiate chilli cheese fries
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400' WHERE name = 'Chilli Cheese Fries';

-- Braai Chicken Wings sharing with Buffalo/Chicken Wings — give braai wings distinct image
UPDATE public.menu_items SET image_url = 'https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=400' WHERE name = 'Braai Chicken Wings (8pc)';
