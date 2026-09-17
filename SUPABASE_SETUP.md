# 🚀 CargoMatch — Supabase Database & Backend Setup Guide

This guide walks you through connecting your **CargoMatch** frontend to a live **Supabase PostgreSQL database** with real-time updates and authentication.

---

## 📋 Table of Contents
1. [Create Supabase Project](#1-create-supabase-project)
2. [Execute Database Schema](#2-execute-database-schema)
3. [Execute Seed Data (Optional)](#3-execute-seed-data-optional)
4. [Configure Environment Variables](#4-configure-environment-variables)
5. [Verify Live Connection](#5-verify-live-connection)
6. [Database Schema Overview](#6-database-schema-overview)

---

## 1. Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and sign in or create a free account.
2. Click **"New Project"**.
3. Choose an organization, enter a name (e.g., `cargomatch-db`), select a database password, and pick the closest region.
4. Wait 1–2 minutes for the database to provision.

---

## 2. Execute Database Schema
1. In your Supabase Dashboard, click the **SQL Editor** tab (icon on the left sidebar).
2. Click **"New query"**.
3. Open [`supabase/schema.sql`](./supabase/schema.sql) in this repository and copy its entire content.
4. Paste the SQL into the Supabase query editor and click **"Run"** (or `Ctrl+Enter`).
5. This creates the following tables with Row Level Security (RLS) and real-time publications:
   - `profiles`
   - `vehicles`
   - `trips`
   - `delivery_requests`
   - `bookings`
   - `ratings`
   - `notifications`

---

## 3. Execute Seed Data (Optional)
To immediately populate realistic test trips, vehicles, drivers, and cargo requests:
1. In the Supabase **SQL Editor**, click **"New query"**.
2. Copy the contents of [`supabase/seed.sql`](./supabase/seed.sql).
3. Paste and click **"Run"**.

The seeded accounts can then sign in with their listed email address and the
shared demo password: `CargoMatchDemo123!`. Re-running the seed is safe and
also repairs older seed accounts that contain invalid placeholder passwords.

---

## 4. Configure Environment Variables
1. In your Supabase Dashboard, go to **Project Settings** (gear icon) -> **API**.
2. Copy your **Project URL** and **`anon` `public` key**.
3. In your local CargoMatch project root, create a file named `.env`:
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. Restart your development server:
   ```powershell
   npm run dev
   ```

---

## 5. Verify Live Connection
1. Open CargoMatch in your browser (`http://localhost:5173`).
2. Look at the top navigation bar badge:
   - ⚡ **Supabase PostgreSQL** (Green): Successfully connected and syncing in real time!
   - 🧪 **Demo Mode** (Amber): Running in local demo mode with instant state persistence.
3. Click the badge anytime to test latency and run live connection diagnostics.

---

## 6. Realtime Architecture & Capabilities
* **Realtime Matching**: When a driver posts a new trip, connected customer portals automatically receive the updated vehicle capacity in real time.
* **Live OTP Verification**: When a driver inputs the customer's OTP, the delivery status instantly flips to `DELIVERED` across all open dashboards without needing a page refresh.
* **Graceful Fallback**: If Supabase credentials are not present, CargoMatch automatically falls back to local storage and mock data so development is never blocked.
