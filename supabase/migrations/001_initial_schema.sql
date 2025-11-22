-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT CHECK (role IN ('volunteer', 'admin')) DEFAULT 'volunteer',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  center_name TEXT NOT NULL,
  location TEXT NOT NULL,
  scheduled_date TIMESTAMPTZ NOT NULL,
  duration_hours DECIMAL,
  activity_type TEXT,
  created_by UUID REFERENCES profiles(id) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create visit_reports table
CREATE TABLE visit_reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID REFERENCES events(id),
  volunteer_id UUID REFERENCES profiles(id) NOT NULL,
  email TEXT NOT NULL,
  visit_date DATE NOT NULL,
  duration_hours DECIMAL NOT NULL,
  center_name TEXT NOT NULL,
  location TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  children_count INTEGER NOT NULL,
  children_names TEXT NOT NULL,
  activity_description TEXT NOT NULL,
  testimonials TEXT,
  child_observations TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) NOT NULL,
  recipient_id UUID REFERENCES profiles(id),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  is_broadcast BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_events_scheduled_date ON events(scheduled_date);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_visit_reports_volunteer_id ON visit_reports(volunteer_id);
CREATE INDEX idx_visit_reports_visit_date ON visit_reports(visit_date);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE visit_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Events policies
CREATE POLICY "Events are viewable by authenticated users" 
  ON events FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can create events" 
  ON events FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own events" 
  ON events FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can delete events" 
  ON events FOR DELETE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Visit reports policies
CREATE POLICY "Visit reports are viewable by authenticated users" 
  ON visit_reports FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Authenticated users can create visit reports" 
  ON visit_reports FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = volunteer_id);

CREATE POLICY "Users can update own visit reports" 
  ON visit_reports FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = volunteer_id);

-- Messages policies
CREATE POLICY "Users can view their own messages" 
  ON messages FOR SELECT 
  TO authenticated 
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = recipient_id OR 
    is_broadcast = true
  );

CREATE POLICY "Authenticated users can send messages" 
  ON messages FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Admins can send broadcast messages" 
  ON messages FOR INSERT 
  TO authenticated 
  WITH CHECK (
    is_broadcast = false OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Users can update their received messages" 
  ON messages FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = recipient_id);

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_events
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at_visit_reports
  BEFORE UPDATE ON visit_reports
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
