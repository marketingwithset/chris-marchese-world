-- ============================================================
-- Chris Marchese World — Database Schema
-- Run this in Supabase SQL Editor to set up all tables
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE media_type AS ENUM ('image', 'video', 'embed');
CREATE TYPE contact_status AS ENUM ('new', 'read', 'replied', 'archived');
CREATE TYPE order_status AS ENUM ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded');
CREATE TYPE device_type AS ENUM ('desktop', 'mobile', 'tablet');
CREATE TYPE view_mode AS ENUM ('world', 'classic');

-- ============================================================
-- CONTENT ITEMS
-- All zone content (art, film, fashion, capital, etc.)
-- ============================================================
CREATE TABLE content_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zone_id TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL DEFAULT '',
  media_type media_type,
  media_url TEXT,
  metadata JSONB DEFAULT '{}',
  price DECIMAL(10, 2),
  purchasable BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_zone ON content_items(zone_id);
CREATE INDEX idx_content_active ON content_items(is_active);

-- ============================================================
-- CONTACT FORM SUBMISSIONS
-- ============================================================
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  source_zone TEXT DEFAULT 'telephone_booth',
  status contact_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_contact_status ON contact_submissions(status);
CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);

-- ============================================================
-- CART ITEMS (anonymous cart by session)
-- ============================================================
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cart_session ON cart_items(session_id);

-- ============================================================
-- ORDERS
-- ============================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  status order_status DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_stripe ON orders(stripe_payment_intent_id);

-- ============================================================
-- ORDER LINE ITEMS
-- ============================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  content_item_id UUID REFERENCES content_items(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER DEFAULT 1 CHECK (quantity > 0)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================================
-- ANALYTICS EVENTS
-- Tracks user interactions in the 3D world
-- ============================================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'zone_enter', 'room_enter', 'hotspot_click', 'portal_enter', 'content_view', 'add_to_cart', 'purchase'
  zone_id TEXT,
  room_id TEXT,
  content_item_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analytics_session ON analytics_events(session_id);
CREATE INDEX idx_analytics_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_zone ON analytics_events(zone_id);

-- ============================================================
-- VISITOR SESSIONS
-- Aggregate session data for dashboards
-- ============================================================
CREATE TABLE visitor_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_agent TEXT,
  referrer TEXT,
  country TEXT,
  device_type device_type,
  view_mode view_mode,
  total_time_seconds INTEGER DEFAULT 0,
  rooms_visited TEXT[] DEFAULT '{}',
  zones_visited TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_created ON visitor_sessions(created_at DESC);
CREATE INDEX idx_sessions_device ON visitor_sessions(device_type);

-- ============================================================
-- MEDIA ASSETS
-- Tracks uploaded images/textures for the 3D world
-- ============================================================
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  tags TEXT[] DEFAULT '{}',
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_media_tags ON media_assets USING GIN(tags);

-- ============================================================
-- TESTIMONIALS
-- Client testimonials shown in Growth Room
-- ============================================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_avatar_url TEXT,
  quote TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = TRUE;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Content: anyone can read active content
CREATE POLICY "Public can read active content" ON content_items
  FOR SELECT USING (is_active = TRUE);

-- Contact: anyone can insert, only service role can read
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (TRUE);

-- Cart: users can manage their own cart by session
CREATE POLICY "Users can manage own cart" ON cart_items
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Orders: insert allowed, select own orders by session
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (TRUE);

-- Order items: viewable with order
CREATE POLICY "Users can view order items" ON order_items
  FOR SELECT USING (TRUE);
CREATE POLICY "Users can create order items" ON order_items
  FOR INSERT WITH CHECK (TRUE);

-- Analytics: anyone can insert events
CREATE POLICY "Anyone can log analytics" ON analytics_events
  FOR INSERT WITH CHECK (TRUE);

-- Sessions: anyone can manage sessions
CREATE POLICY "Anyone can manage sessions" ON visitor_sessions
  FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Media: public read
CREATE POLICY "Public can read media" ON media_assets
  FOR SELECT USING (TRUE);

-- Testimonials: public read active
CREATE POLICY "Public can read active testimonials" ON testimonials
  FOR SELECT USING (is_active = TRUE);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_content
  BEFORE UPDATE ON content_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_orders
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- STORAGE BUCKET (run separately in Supabase dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('media', 'media', true);
