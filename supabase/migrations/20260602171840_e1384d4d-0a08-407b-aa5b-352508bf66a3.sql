ALTER TABLE public.azkomoly_leads
  ADD COLUMN IF NOT EXISTS name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS phone_country_code text;

DROP POLICY IF EXISTS "Anyone can subscribe" ON public.azkomoly_leads;
CREATE POLICY "Anyone can subscribe"
ON public.azkomoly_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND length(email) <= 320
  AND (name IS NULL OR length(name) <= 120)
  AND (phone IS NULL OR length(phone) <= 32)
  AND (phone_country_code IS NULL OR length(phone_country_code) <= 8)
);