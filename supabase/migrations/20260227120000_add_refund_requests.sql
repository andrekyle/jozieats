-- Create refund_requests table
CREATE TABLE IF NOT EXISTS public.refund_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  customer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason text NOT NULL,
  description text,
  photo_urls text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'approved', 'denied')),
  admin_notes text,
  refund_amount numeric(10,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own refund requests"
  ON public.refund_requests FOR SELECT
  USING (auth.uid() = customer_id OR public.is_admin(auth.uid()));

CREATE POLICY "Users can create refund requests"
  ON public.refund_requests FOR INSERT
  WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Only admins can update refund requests"
  ON public.refund_requests FOR UPDATE
  USING (public.is_admin(auth.uid()));

-- Storage bucket for refund photos
INSERT INTO storage.buckets (id, name, public) VALUES ('refund-photos', 'refund-photos', true)
  ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Authenticated users can upload refund photos"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'refund-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view refund photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'refund-photos');

CREATE POLICY "Users can delete own refund photos"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'refund-photos' AND auth.uid()::text = (storage.foldername(name))[1]);
