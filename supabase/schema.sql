-- Create colonies table
CREATE TABLE IF NOT EXISTS colonies (
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
CREATE TABLE IF NOT EXISTS contacts (
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
CREATE INDEX IF NOT EXISTS idx_colonies_name ON colonies(name);
CREATE INDEX IF NOT EXISTS idx_colonies_location ON colonies(location);
CREATE INDEX IF NOT EXISTS idx_contacts_colony_id ON contacts(colony_id);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(contact_type);

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
