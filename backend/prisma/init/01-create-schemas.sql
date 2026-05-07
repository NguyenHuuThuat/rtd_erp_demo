-- Tạo các schema bounded context trước khi Prisma migrate.
-- File này được Postgres tự chạy khi khởi tạo container lần đầu (qua /docker-entrypoint-initdb.d).

CREATE SCHEMA IF NOT EXISTS master_data;
CREATE SCHEMA IF NOT EXISTS financial;
CREATE SCHEMA IF NOT EXISTS inventory;
CREATE SCHEMA IF NOT EXISTS manufacturing;
CREATE SCHEMA IF NOT EXISTS farm;
CREATE SCHEMA IF NOT EXISTS sales;
CREATE SCHEMA IF NOT EXISTS procurement;
CREATE SCHEMA IF NOT EXISTS events;

-- Quyền cho user app
GRANT ALL ON SCHEMA master_data, financial, inventory, manufacturing,
                  farm, sales, procurement, events
      TO CURRENT_USER;

-- Extension cần thiết
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- full text search nhẹ
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- index hỗn hợp cho audit log JSONB
