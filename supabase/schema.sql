-- supabase/schema.sql

-- Rooms Table
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  store_name TEXT,
  description TEXT,
  deadline_at TIMESTAMPTZ,
  status TEXT DEFAULT 'open',
  owner_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Menu Items Table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  brand_name TEXT,
  name TEXT NOT NULL,
  category TEXT,
  price INTEGER,
  kcal INTEGER,
  is_available BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  memo TEXT,
  status TEXT DEFAULT 'received',
  order_token TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  brand_name TEXT,
  item_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  price INTEGER,
  kcal INTEGER,
  option_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_rooms_slug ON rooms(slug);
CREATE INDEX idx_menu_items_room_id ON menu_items(room_id);
CREATE INDEX idx_orders_room_id ON orders(room_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
