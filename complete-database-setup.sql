-- =====================================================
-- COMPLETE DATABASE SETUP FOR INSTAMEMBERS WEBSITE
-- =====================================================
-- Run this SQL in your Supabase SQL Editor to set up the complete database

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS contacts CASCADE;
DROP TABLE IF EXISTS colonies CASCADE;

-- Create colonies table
CREATE TABLE colonies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(10) NOT NULL,
  latitude DECIMAL(10, 6),
  longitude DECIMAL(10, 6),
  coordinates VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  colony_id UUID REFERENCES colonies(id) ON DELETE CASCADE,
  contact_type VARCHAR(50) NOT NULL, -- 'switchboard', 'manager', 'minister', 'postal', 'school'
  name VARCHAR(255),
  phone VARCHAR(50),
  fax VARCHAR(50),
  email VARCHAR(255),
  street VARCHAR(255),
  city VARCHAR(100),
  zip_code VARCHAR(20),
  extensions VARCHAR(100),
  tollfree VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_colonies_name ON colonies(name);
CREATE INDEX idx_colonies_location ON colonies(location);
CREATE INDEX idx_contacts_colony_id ON contacts(colony_id);
CREATE INDEX idx_contacts_type ON contacts(contact_type);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_colonies_updated_at BEFORE UPDATE ON colonies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE colonies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access on colonies" ON colonies
    FOR SELECT USING (true);

CREATE POLICY "Allow public read access on contacts" ON contacts
    FOR SELECT USING (true);

-- Create policies for service role access (for data import)
CREATE POLICY "Allow service role full access on colonies" ON colonies
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on contacts" ON contacts
    FOR ALL USING (auth.role() = 'service_role');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these after the setup to verify everything is working

-- Check if tables exist
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('colonies', 'contacts');

-- Check if indexes exist
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('colonies', 'contacts');

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('colonies', 'contacts');

-- Check if policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('colonies', 'contacts');

-- =====================================================
-- SAMPLE DATA (OPTIONAL - FOR TESTING)
-- =====================================================
-- Uncomment these lines to add sample data for testing

/*
-- Insert a sample colony
INSERT INTO colonies (name, location, latitude, longitude, coordinates) 
VALUES ('Test Colony', 'SK', 50.6939, -108.7883, '50.6939° N 108.7883° W');

-- Get the colony ID
SELECT id FROM colonies WHERE name = 'Test Colony';

-- Insert sample contacts (replace the colony_id with the actual ID from above)
INSERT INTO contacts (colony_id, contact_type, name, phone, extensions) 
VALUES (
  (SELECT id FROM colonies WHERE name = 'Test Colony'),
  'switchboard',
  'Main Switchboard',
  '(306) 689-2231',
  '28 extensions'
);

INSERT INTO contacts (colony_id, contact_type, name, phone, fax) 
VALUES (
  (SELECT id FROM colonies WHERE name = 'Test Colony'),
  'manager',
  'John Doe',
  '(306) 689-2265',
  '(306) 689-2601'
);

-- Verify the data
SELECT c.name, c.location, co.contact_type, co.name as contact_name, co.phone
FROM colonies c
LEFT JOIN contacts co ON c.id = co.colony_id
WHERE c.name = 'Test Colony';
*/
