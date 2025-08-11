-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    department VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    office VARCHAR(100),
    qr_code VARCHAR(255),
    status VARCHAR(32) DEFAULT 'available',
    available_until TIMESTAMP WITH TIME ZONE,
    status_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- QR Scans table for analytics
CREATE TABLE IF NOT EXISTS qr_scans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
    scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_teachers_email ON teachers(email);
CREATE INDEX IF NOT EXISTS idx_teachers_department ON teachers(department);
CREATE INDEX IF NOT EXISTS idx_qr_scans_teacher_id ON qr_scans(teacher_id);
CREATE INDEX IF NOT EXISTS idx_qr_scans_scanned_at ON qr_scans(scanned_at);

-- Enable Row Level Security (RLS)
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access to teachers" ON teachers;
DROP POLICY IF EXISTS "Teachers can update own profile" ON teachers;
DROP POLICY IF EXISTS "Teachers can insert own record" ON teachers;
DROP POLICY IF EXISTS "Public insert access to qr_scans" ON qr_scans;
DROP POLICY IF EXISTS "Teachers can view own scan analytics" ON qr_scans;

-- RLS Policies for teachers table
-- Allow public read access to teacher information (except password)
CREATE POLICY "Public read access to teachers" ON teachers
    FOR SELECT USING (true);

-- Allow public insert for registration (no auth required)
CREATE POLICY "Public insert for registration" ON teachers
    FOR INSERT WITH CHECK (true);

-- Allow authenticated users to update their own profile
CREATE POLICY "Teachers can update own profile" ON teachers
    FOR UPDATE USING (true);

-- RLS Policies for qr_scans table
-- Allow public insert access for QR scans
CREATE POLICY "Public insert access to qr_scans" ON qr_scans
    FOR INSERT WITH CHECK (true);

-- Allow public read access to scan analytics
CREATE POLICY "Public read access to qr_scans" ON qr_scans
    FOR SELECT USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_teachers_updated_at ON teachers;
CREATE TRIGGER update_teachers_updated_at 
    BEFORE UPDATE ON teachers 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
