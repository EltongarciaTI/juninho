-- =============================================
-- JUNINHO MULTI MARCAS — SCHEMA SUPABASE
-- =============================================

-- CATEGORIAS
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- MARCAS
CREATE TABLE brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PRODUTOS
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand_id UUID REFERENCES brands(id),
  category_id UUID REFERENCES categories(id),
  price NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  description TEXT,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_promotion BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PEDIDOS
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL, -- 'whatsapp', 'pix', 'credit_card'
  payment_status TEXT DEFAULT 'pending', -- pending, approved, rejected
  order_status TEXT DEFAULT 'new', -- new, confirmed, shipped, delivered, cancelled
  mp_payment_id TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- VENDAS (registro manual balcão)
CREATE TABLE sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  category TEXT,
  quantity INTEGER DEFAULT 1,
  unit_price NUMERIC(10,2) NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL, -- dinheiro, pix, credito, debito
  customer_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROMOÇÕES BANNER
CREATE TABLE banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  image_url TEXT,
  link TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DADOS INICIAIS — CATEGORIAS
INSERT INTO categories (name, slug, icon) VALUES
  ('Roupas', 'roupas', '👕'),
  ('Óculos', 'oculos', '🕶️'),
  ('Calçados', 'calcados', '👟'),
  ('Bonés', 'bones', '🧢'),
  ('Sandálias', 'sandalias', '🩴'),
  ('Shorts de Praia', 'shorts-praia', '🩱'),
  ('Shorts Jeans', 'shorts-jeans', '👖');

-- DADOS INICIAIS — MARCAS
INSERT INTO brands (name) VALUES
  ('Nike'), ('Lacoste'), ('Zara'), ('Boss'), ('Hopers');

-- RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Leitura pública para produtos, categorias, marcas e banners
CREATE POLICY "public_read_products" ON products FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_read_categories" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "public_read_brands" ON brands FOR SELECT USING (TRUE);
CREATE POLICY "public_read_banners" ON banners FOR SELECT USING (is_active = TRUE);
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (TRUE);

-- Admin tem acesso total (via service_role)
CREATE POLICY "admin_all_products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_orders" ON orders FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_sales" ON sales FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_banners" ON banners FOR ALL USING (auth.role() = 'authenticated');
