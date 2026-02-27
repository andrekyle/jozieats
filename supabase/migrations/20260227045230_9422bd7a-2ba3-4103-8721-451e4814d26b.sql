
-- Drop the foreign key constraint on restaurants.owner_id referencing auth.users
ALTER TABLE public.restaurants DROP CONSTRAINT IF EXISTS restaurants_owner_id_fkey;
