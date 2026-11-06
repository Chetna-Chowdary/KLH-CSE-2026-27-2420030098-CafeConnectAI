# Cafe Connect — MySQL 8.0+ Database Architecture & Scripts

This directory contains the production-ready MySQL 8.0+ schema, seed data, and analytical reporting queries for **Cafe Connect**, a premium college cafeteria ordering and queue management system.

## ⚠️ Important Execution Boundaries

- **These scripts are designed for manual review and scheduled execution by the database administrator.**
- **The frontend application runs completely standalone with mock state and reactive local storage simulation.**
- **No live database connections or migrations were executed automatically.**

---

## 📂 Script Inventory & Execution Sequence

Execute the SQL files strictly in the numbered order below:

| Sequence | File | Purpose | Idempotency |
| :--- | :--- | :--- | :--- |
| **01** | `01_create_database.sql` | Creates `cafe_connect_db` schema with `utf8mb4` character set and `utf8mb4_0900_ai_ci` collation. | Safe / Non-destructive (`IF NOT EXISTS`) |
| **02** | `02_create_tables.sql` | Creates all normalized relational tables, foreign key constraints, and default timestamps using InnoDB. | Safe (`IF NOT EXISTS`) |
| **03** | `03_seed_reference_data.sql` | Inserts system roles (`ROLE_STUDENT`, `ROLE_KITCHEN_STAFF`, `ROLE_ADMIN`), dietary tags, kitchen stations, and categories. | Safe (`ON DUPLICATE KEY UPDATE`) |
| **04** | `04_seed_demo_data.sql` | Populates sample menu catalog (Plain Dosa, Masala Dosa, Filter Coffee, Lays, etc.), suppliers, inventory items with SKUs, recipes, and active orders (`#CC2547` to `#CC2551`). | Safe (`ON DUPLICATE KEY UPDATE`) |
| **05** | `05_indexes_and_constraints.sql` | Installs high-concurrency composite indexes for real-time station queue filtering, inventory audits, and hourly trend analytics. | Safe (Procedure check) |
| **06** | `06_reporting_queries.sql` | Production SQL queries for executive KPIs, hourly order curves, category distribution, and stock reorder forecasts. | Read-Only (`SELECT` statements) |

---

## 🚀 Execution Instructions via MySQL CLI

```bash
# Connect to your MySQL 8.0+ instance
mysql -u root -p

# Execute in sequence
mysql -u root -p < database/sql/01_create_database.sql
mysql -u root -p < database/sql/02_create_tables.sql
mysql -u root -p < database/sql/03_seed_reference_data.sql
mysql -u root -p < database/sql/04_seed_demo_data.sql
mysql -u root -p < database/sql/05_indexes_and_constraints.sql
```

---

## 🔑 Demo Account Credentials (For Reference)

When setting up your backend authentication (Spring Security or JWT), reference these seeded profiles:

| Role | Username / Identifier | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@cafeconnect.edu` | `admin123` | Full governance, pricing, inventory reorder, staff assignments |
| **Kitchen Chef** | `kitchen@cafeconnect.edu` | `chef123` | Ticket management, station pause/resume, prep delay broadcasting |
| **Student Guest** | `chaitanya@student.campus.edu` / `CS23B104` | *(No password required)* | Guest ordering, cart persistence, real-time ticket tracking |

---

## 📚 Related Documentation

- [`ER_DIAGRAM.md`](./ER_DIAGRAM.md) — Comprehensive Mermaid visual entity relationship diagram.
- [`DATA_DICTIONARY.md`](./DATA_DICTIONARY.md) — Table-by-table column specification with constraints.
- [`BACKEND_INTEGRATION.md`](./BACKEND_INTEGRATION.md) — Spring Boot 3 DTO mapping, REST endpoints, and transaction locking patterns.
