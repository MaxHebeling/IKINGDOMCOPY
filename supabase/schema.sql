-- iKingdom / IKINGDOMCOPY — esquema mínimo para un proyecto Supabase nuevo
-- Ejecutá TODO este archivo en: Supabase Dashboard → SQL Editor → New query → Run
--
-- Después: Settings → API → copiá URL y keys al .env.local y a Vercel.
-- Auth: Authentication → URL configuration → Site URL y Redirect URLs (incl. localhost).

-- ── Extensión (UUID) ─────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Organización fija (debe coincidir con ORG_ID en src/lib/leads/helpers.ts) ─
CREATE TABLE IF NOT EXISTS public.organizations (
  id   UUID PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO public.organizations (id, name)
VALUES ('4059832a-ff39-43e6-984f-d9e866dfb8a4', 'Hebeling Imperium Group')
ON CONFLICT (id) DO NOTHING;

-- ── Perfiles (staff: requireStaff lee role aquí) ─────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id    UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email TEXT,
  role  TEXT NOT NULL DEFAULT 'user'
    CHECK (role IN ('user', 'superadmin', 'admin', 'sales', 'ops'))
);

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Auto-crear fila al registrarse (rol por defecto: user → subilo a staff a mano)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ── Pipeline: etapas para deals (createDealFromLead busca name New o Lead) ───
CREATE TABLE IF NOT EXISTS public.stages (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL
);

INSERT INTO public.stages (name)
SELECT v FROM (VALUES ('New'), ('Lead')) AS t(v)
WHERE NOT EXISTS (SELECT 1 FROM public.stages s WHERE s.name = t.v);

-- ── Leads ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leads (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id                   UUID NOT NULL REFERENCES public.organizations (id),
  lead_code                TEXT NOT NULL,
  full_name                TEXT NOT NULL,
  company_name             TEXT,
  email                    TEXT,
  whatsapp                 TEXT,
  country                  TEXT,
  city                     TEXT,
  project_description      TEXT,
  organization_type      TEXT,
  website_url              TEXT,
  social_links             TEXT,
  main_goal                TEXT,
  expected_result          TEXT,
  main_service             TEXT,
  ideal_client             TEXT,
  has_logo                 BOOLEAN,
  has_brand_colors         BOOLEAN,
  visual_style             TEXT,
  available_content        TEXT,
  reference_websites       TEXT,
  has_current_landing      BOOLEAN,
  project_type             TEXT,
  budget_range             TEXT,
  timeline                 TEXT,
  preferred_contact_method TEXT,
  additional_notes         TEXT,
  source                   TEXT NOT NULL DEFAULT 'website',
  brand                    TEXT NOT NULL DEFAULT 'ikingdom',
  origin_page              TEXT,
  form_type                TEXT,
  status                   TEXT NOT NULL DEFAULT 'new_lead',
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (lead_code)
);

CREATE INDEX IF NOT EXISTS leads_brand_created_idx ON public.leads (brand, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_email_lower_idx ON public.leads (lower(email));
CREATE INDEX IF NOT EXISTS leads_status_idx ON public.leads (status);

CREATE OR REPLACE FUNCTION public.leads_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_updated_at ON public.leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.leads_set_updated_at();

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- ── Deals ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.deals (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id    UUID NOT NULL REFERENCES public.organizations (id),
  lead_id   UUID NOT NULL REFERENCES public.leads (id) ON DELETE CASCADE,
  lead_code TEXT NOT NULL,
  title     TEXT NOT NULL,
  pipeline  TEXT NOT NULL,
  stage_id  UUID REFERENCES public.stages (id),
  status    TEXT NOT NULL DEFAULT 'open',
  owner     TEXT NOT NULL DEFAULT 'max',
  value     NUMERIC(14, 2) NOT NULL DEFAULT 0,
  currency  TEXT NOT NULL DEFAULT 'USD',
  source    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS deals_lead_id_idx ON public.deals (lead_id);

DROP TRIGGER IF EXISTS deals_updated_at ON public.deals;
CREATE TRIGGER deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.leads_set_updated_at();

ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;

-- ── Briefs ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.lead_briefs (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id             UUID NOT NULL REFERENCES public.organizations (id),
  lead_id            UUID NOT NULL REFERENCES public.leads (id) ON DELETE CASCADE,
  brand              TEXT NOT NULL DEFAULT 'ikingdom',
  source             TEXT,
  origin_page        TEXT,
  status             TEXT NOT NULL DEFAULT 'received',
  company_name       TEXT NOT NULL,
  contact_email      TEXT,
  contact_phone      TEXT,
  city_country       TEXT,
  website_url        TEXT,
  social_media       TEXT,
  problem_solved     TEXT,
  differentiator     TEXT,
  why_choose_you     TEXT,
  main_services      TEXT,
  key_service        TEXT,
  ideal_client       TEXT,
  not_ideal_client   TEXT,
  years_experience   TEXT,
  clients_served     TEXT,
  testimonials       TEXT,
  landing_objective  TEXT,
  traffic_strategy   TEXT,
  design_style       TEXT,
  address            TEXT,
  main_offer         TEXT,
  generated_prompt   TEXT,
  raw_payload        JSONB,
  submitted_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lead_briefs_lead_id_idx ON public.lead_briefs (lead_id);

ALTER TABLE public.lead_briefs ENABLE ROW LEVEL SECURITY;

-- ── Activity log ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id     UUID NOT NULL REFERENCES public.organizations (id),
  action     TEXT NOT NULL,
  entity     TEXT NOT NULL,
  entity_id  TEXT NOT NULL,
  metadata   JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS activity_logs_entity_idx ON public.activity_logs (entity, created_at DESC);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Las tablas anteriores solo las toca el backend con SERVICE_ROLE (bypass RLS).
-- No hace falta política para anon/authenticated salvo profiles.
