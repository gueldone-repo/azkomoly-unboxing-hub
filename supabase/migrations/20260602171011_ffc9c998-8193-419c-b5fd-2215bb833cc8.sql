
CREATE TABLE public.azkomoly_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX azkomoly_leads_email_idx ON public.azkomoly_leads (lower(email));

GRANT INSERT ON public.azkomoly_leads TO anon, authenticated;
GRANT ALL ON public.azkomoly_leads TO service_role;

ALTER TABLE public.azkomoly_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON public.azkomoly_leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND length(email) <= 320);
