-- ==============================================================================
-- Homepot Inclusivity & Accessibility Migration (PostgreSQL / Supabase)
-- Feature: Delivery Partner Gender, PwD (Differently-Abled) Support & UDID Storage
-- ==============================================================================

-- 1. Create or Update delivery_partners table with Inclusivity & Accessibility columns
CREATE TABLE IF NOT EXISTS public.delivery_partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,

    -- Gender field (Protected for privacy - not displayed to customer)
    gender VARCHAR(30) NOT NULL DEFAULT 'male' 
        CHECK (gender IN ('male', 'female', 'other_prefer_not_to_say')),

    -- PwD (Differently-Abled) status
    is_pwd BOOLEAN NOT NULL DEFAULT FALSE,

    -- PwD Category (Locomotor/Mobility, Hearing & Speech, or Other)
    pwd_category VARCHAR(50) 
        CHECK (pwd_category IS NULL OR pwd_category IN ('locomotor_mobility', 'hearing_speech_impaired', 'other')),

    -- UDID (Unique Disability ID) or Medical Certificate storage URL
    udid_document_url TEXT,

    -- Vehicle & Licensing details
    vehicle_type VARCHAR(50) NOT NULL DEFAULT 'petrol_two_wheeler'
        CHECK (vehicle_type IN ('bicycle_ecycle', 'petrol_two_wheeler', 'electric_two_wheeler', 'car')),
    vehicle_number VARCHAR(30),
    driving_license VARCHAR(50),
    operating_city VARCHAR(100),

    -- Bank & Settlement
    bank_account_holder VARCHAR(100),
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    upi_id VARCHAR(50),

    -- Verification & Status
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    kyc_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Consistency check: if is_pwd is true, a category must be recorded
    CONSTRAINT check_pwd_category_consistency 
        CHECK (
            (is_pwd = FALSE) OR 
            (is_pwd = TRUE AND pwd_category IS NOT NULL)
        )
);

-- In case table already exists in Supabase, add columns safely:
ALTER TABLE public.delivery_partners 
    ADD COLUMN IF NOT EXISTS gender VARCHAR(30) DEFAULT 'male' 
        CHECK (gender IN ('male', 'female', 'other_prefer_not_to_say')),
    ADD COLUMN IF NOT EXISTS is_pwd BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS pwd_category VARCHAR(50) 
        CHECK (pwd_category IS NULL OR pwd_category IN ('locomotor_mobility', 'hearing_speech_impaired', 'other')),
    ADD COLUMN IF NOT EXISTS udid_document_url TEXT;

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_delivery_partners_phone ON public.delivery_partners(phone);
CREATE INDEX IF NOT EXISTS idx_delivery_partners_email ON public.delivery_partners(email);
CREATE INDEX IF NOT EXISTS idx_delivery_partners_pwd ON public.delivery_partners(is_pwd);

-- 3. Row-Level Security (RLS) Policies
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;

-- Policy A: Delivery Partner can view and update their own full record
CREATE POLICY "Partners can manage their own profile" 
    ON public.delivery_partners
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy B: Customers & Chefs can view non-sensitive assigned partner info during delivery
-- (Name, vehicle, and is_pwd flag for accessibility support; strictly NO gender or UDID url exposed)
CREATE OR REPLACE VIEW public.assigned_rider_public_view AS
SELECT 
    id,
    full_name,
    phone,
    vehicle_type,
    vehicle_number,
    is_pwd,
    pwd_category
FROM public.delivery_partners
WHERE is_active = TRUE;

-- 4. Supabase Storage Bucket Setup for UDID Documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'udid-certificates',
    'udid-certificates',
    false, -- Private bucket
    5242880, -- 5MB in bytes
    ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

-- Storage Security Policy: Partner can only read and upload their own documents
CREATE POLICY "Allow partner to upload UDID certificate"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'udid-certificates' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );

CREATE POLICY "Allow partner to view own UDID certificate"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'udid-certificates' AND 
        (storage.foldername(name))[1] = auth.uid()::text
    );
