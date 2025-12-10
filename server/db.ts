import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";
import { sql } from "drizzle-orm";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?\n" +
    "On Railway: Add a PostgreSQL service and link it to your web service.\n" +
    "Railway will automatically set DATABASE_URL when the database is linked."
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

/**
 * Initialize database schema - creates all tables if they don't exist
 * This is called automatically on startup and can be called via API endpoint
 */
export async function initializeDatabase() {
  try {
    // Test database connection first
    await pool.query('SELECT 1');
    
    // Check if tables exist by querying information_schema
    const tablesCheck = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'customer_segments', 'competitors', 'business_initiatives', 'generated_campaigns')
    `);

    const existingTables = (tablesCheck.rows as any[]).map((row: any) => row.table_name);
    const requiredTables = ['users', 'customer_segments', 'competitors', 'business_initiatives', 'generated_campaigns'];
    const missingTables = requiredTables.filter(table => !existingTables.includes(table));

    if (missingTables.length === 0) {
      console.log("✓ Database tables already exist");
      return { initialized: false, message: "Tables already exist" };
    }

    console.log(`Creating missing tables: ${missingTables.join(', ')}`);

    // Create users table
    if (missingTables.includes('users')) {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS users (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL
        )
      `);
    }

    // Create customer_segments table
    if (missingTables.includes('customer_segments')) {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS customer_segments (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          size INTEGER NOT NULL DEFAULT 0,
          avg_clv REAL NOT NULL DEFAULT 0,
          churn_risk REAL NOT NULL DEFAULT 0,
          growth_rate REAL NOT NULL DEFAULT 0,
          description TEXT,
          color TEXT DEFAULT '#8B5CF6',
          health_score INTEGER DEFAULT 50,
          clv_trend REAL DEFAULT 0,
          is_core BOOLEAN DEFAULT false,
          acquisition_cost REAL DEFAULT 0,
          retention_rate REAL DEFAULT 0,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    }

    // Create competitors table
    if (missingTables.includes('competitors')) {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS competitors (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          market_share REAL NOT NULL DEFAULT 0,
          price_index REAL NOT NULL DEFAULT 100,
          sentiment REAL NOT NULL DEFAULT 0,
          ad_spend REAL NOT NULL DEFAULT 0,
          strengths TEXT[],
          weaknesses TEXT[],
          threat TEXT DEFAULT 'medium',
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    }

    // Create business_initiatives table
    if (missingTables.includes('business_initiatives')) {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS business_initiatives (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          impact INTEGER NOT NULL DEFAULT 0,
          effort INTEGER NOT NULL DEFAULT 0,
          status TEXT NOT NULL DEFAULT 'active',
          priority TEXT DEFAULT 'medium',
          description TEXT,
          recommendation TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    }

    // Create generated_campaigns table
    if (missingTables.includes('generated_campaigns')) {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS generated_campaigns (
          id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
          product_name TEXT NOT NULL,
          target_segment TEXT,
          platform TEXT,
          tone TEXT,
          visual_style TEXT,
          copy_variations JSONB,
          image_url TEXT,
          voice_script TEXT,
          voice_audio_url TEXT,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    }

    console.log("✓ Database tables created successfully");
    return { initialized: true, message: "Database initialized successfully", createdTables: missingTables };
  } catch (error: any) {
    console.error("✗ Database initialization failed:", error.message);
    throw error;
  }
}
