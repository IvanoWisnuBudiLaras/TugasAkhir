-- Postgres migration: analytics tables, triggers, and views

-- Create analytics tables
CREATE TABLE IF NOT EXISTS "user_analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalSpent" NUMERIC NOT NULL DEFAULT 0,
    "lastOrderDate" TIMESTAMP,
    "firstOrderDate" TIMESTAMP,
    "averageOrderValue" NUMERIC NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT "user_analytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "product_analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL UNIQUE,
    "totalSold" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" NUMERIC NOT NULL DEFAULT 0,
    "averageRating" NUMERIC,
    "lastSoldDate" TIMESTAMP,
    "stockAlerts" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT "product_analytics_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "daily_order_summary" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATE NOT NULL UNIQUE,
    "totalOrders" INTEGER NOT NULL DEFAULT 0,
    "totalRevenue" NUMERIC NOT NULL DEFAULT 0,
    "totalCustomers" INTEGER NOT NULL DEFAULT 0,
    "avgOrderValue" NUMERIC NOT NULL DEFAULT 0,
    "takeawayOrders" INTEGER NOT NULL DEFAULT 0,
    "dineInOrders" INTEGER NOT NULL DEFAULT 0,
    "deliveryOrders" INTEGER NOT NULL DEFAULT 0,
    "cancelledOrders" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS "user_analytics_userId_idx" ON "user_analytics"("userId");
CREATE INDEX IF NOT EXISTS "product_analytics_totalSold_idx" ON "product_analytics"("totalSold");
CREATE INDEX IF NOT EXISTS "product_analytics_stockAlerts_idx" ON "product_analytics"("stockAlerts");
CREATE INDEX IF NOT EXISTS "daily_order_summary_date_idx" ON "daily_order_summary"("date");

-- Trigger functions (PL/pgSQL)

-- Update user analytics on new order
CREATE OR REPLACE FUNCTION update_user_analytics_on_order()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_analytics ("userId", "totalOrders", "totalSpent", "lastOrderDate", "firstOrderDate", "averageOrderValue", "updatedAt")
  VALUES (
      NEW."userId",
      1,
      NEW.total,
      NEW."createdAt",
      NEW."createdAt",
      NEW.total,
      NOW()
  )
  ON CONFLICT ("userId") DO UPDATE SET
      "totalOrders" = user_analytics."totalOrders" + 1,
      "totalSpent" = user_analytics."totalSpent" + NEW.total,
      "lastOrderDate" = NEW."createdAt",
      "averageOrderValue" = (user_analytics."totalSpent" + NEW.total) / (user_analytics."totalOrders" + 1),
      "updatedAt" = NOW();

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_user_analytics_on_order ON orders;
CREATE TRIGGER trg_update_user_analytics_on_order
AFTER INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION update_user_analytics_on_order();

-- Update product analytics on new order item
CREATE OR REPLACE FUNCTION update_product_analytics_on_order_item()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO product_analytics ("productId", "totalSold", "totalRevenue", "lastSoldDate", "updatedAt")
  VALUES (
      NEW."productId",
      NEW.quantity,
      NEW.quantity * NEW.price,
      NOW(),
      NOW()
  )
  ON CONFLICT ("productId") DO UPDATE SET
      "totalSold" = product_analytics."totalSold" + EXCLUDED."totalSold",
      "totalRevenue" = product_analytics."totalRevenue" + EXCLUDED."totalRevenue",
      "lastSoldDate" = NOW(),
      "updatedAt" = NOW();

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_product_analytics_on_order_item ON order_items;
CREATE TRIGGER trg_update_product_analytics_on_order_item
AFTER INSERT ON order_items
FOR EACH ROW EXECUTE FUNCTION update_product_analytics_on_order_item();

-- Update daily summary on new order
CREATE OR REPLACE FUNCTION update_daily_summary_on_order()
RETURNS TRIGGER AS $$
DECLARE
  order_date DATE := NEW."createdAt"::date;
BEGIN
  INSERT INTO daily_order_summary (
      "date", "totalOrders", "totalRevenue", "totalCustomers",
      "avgOrderValue", "takeawayOrders", "dineInOrders", "deliveryOrders",
      "cancelledOrders", "updatedAt"
  )
  VALUES (
      order_date,
      1,
      NEW.total,
      1,
      NEW.total,
      CASE WHEN NEW."orderType" = 'TAKEAWAY' THEN 1 ELSE 0 END,
      CASE WHEN NEW."orderType" = 'DINE_IN' THEN 1 ELSE 0 END,
      CASE WHEN NEW."orderType" = 'DELIVERY' THEN 1 ELSE 0 END,
      CASE WHEN NEW."status" = 'CANCELLED' THEN 1 ELSE 0 END,
      NOW()
  )
  ON CONFLICT ("date") DO UPDATE SET
      "totalOrders" = daily_order_summary."totalOrders" + 1,
      "totalRevenue" = daily_order_summary."totalRevenue" + NEW.total,
      "avgOrderValue" = (daily_order_summary."totalRevenue" + NEW.total) / (daily_order_summary."totalOrders" + 1),
      "takeawayOrders" = daily_order_summary."takeawayOrders" + CASE WHEN NEW."orderType" = 'TAKEAWAY' THEN 1 ELSE 0 END,
      "dineInOrders" = daily_order_summary."dineInOrders" + CASE WHEN NEW."orderType" = 'DINE_IN' THEN 1 ELSE 0 END,
      "deliveryOrders" = daily_order_summary."deliveryOrders" + CASE WHEN NEW."orderType" = 'DELIVERY' THEN 1 ELSE 0 END,
      "cancelledOrders" = daily_order_summary."cancelledOrders" + CASE WHEN NEW."status" = 'CANCELLED' THEN 1 ELSE 0 END,
      "updatedAt" = NOW();

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_daily_summary_on_order ON orders;
CREATE TRIGGER trg_update_daily_summary_on_order
AFTER INSERT ON orders
FOR EACH ROW EXECUTE FUNCTION update_daily_summary_on_order();

-- Views
DROP VIEW IF EXISTS popular_products;
CREATE VIEW popular_products AS
SELECT 
    p.id,
    p.name,
    COALESCE(pa."totalSold", 0) AS total_sold,
    COALESCE(pa."totalRevenue", 0) AS total_revenue,
    p.stock,
    CASE 
        WHEN p.stock > 0 AND COALESCE(pa."totalSold", 0) > 0 
        THEN ROUND(COALESCE(pa."totalSold", 0)::numeric / (p.stock + COALESCE(pa."totalSold", 0)) * 100, 2)
        ELSE 0 
    END AS sell_through_rate
FROM products p
LEFT JOIN product_analytics pa ON p.id = pa."productId"
ORDER BY COALESCE(pa."totalSold", 0) DESC;

DROP VIEW IF EXISTS customer_analytics;
CREATE VIEW customer_analytics AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.role,
    COALESCE(ua."totalOrders", 0) AS total_orders,
    COALESCE(ua."totalSpent", 0) AS total_spent,
    COALESCE(ua."averageOrderValue", 0) AS avg_order_value,
    ua."lastOrderDate" AS last_order_date,
    CASE 
        WHEN ua."lastOrderDate" IS NULL THEN 'NEW'
        WHEN NOW() - ua."lastOrderDate" <= INTERVAL '30 days' THEN 'ACTIVE'
        WHEN NOW() - ua."lastOrderDate" <= INTERVAL '90 days' THEN 'REGULAR'
        ELSE 'INACTIVE'
    END AS customer_status
FROM users u
LEFT JOIN user_analytics ua ON u.id = ua."userId"
ORDER BY COALESCE(ua."totalSpent", 0) DESC;

DROP VIEW IF EXISTS inventory_alerts;
CREATE VIEW inventory_alerts AS
SELECT 
    p.id,
    p.name,
    p.stock,
    c.name AS category_name,
    CASE 
        WHEN p.stock = 0 THEN 'OUT_OF_STOCK'
        WHEN p.stock <= 5 THEN 'LOW_STOCK'
        WHEN p.stock <= 10 THEN 'MEDIUM_STOCK'
        ELSE 'GOOD_STOCK'
    END AS stock_status,
    COALESCE(pa."totalSold", 0) AS total_sold,
    NULL::numeric AS days_of_stock_remaining
FROM products p
JOIN categories c ON p."categoryId" = c.id
LEFT JOIN product_analytics pa ON p.id = pa."productId"
WHERE p.stock <= 10
ORDER BY p.stock ASC, COALESCE(pa."totalSold", 0) DESC;