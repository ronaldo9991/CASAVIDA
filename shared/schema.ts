import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const customerSegments = pgTable("customer_segments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  size: integer("size").notNull().default(0),
  avgClv: real("avg_clv").notNull().default(0),
  churnRisk: real("churn_risk").notNull().default(0),
  growthRate: real("growth_rate").notNull().default(0),
  description: text("description"),
  color: text("color").default("#8B5CF6"),
  healthScore: integer("health_score").default(50),
  clvTrend: real("clv_trend").default(0),
  isCore: boolean("is_core").default(false),
  acquisitionCost: real("acquisition_cost").default(0),
  retentionRate: real("retention_rate").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSegmentSchema = createInsertSchema(customerSegments).omit({
  id: true,
  createdAt: true,
});

export type InsertSegment = z.infer<typeof insertSegmentSchema>;
export type Segment = typeof customerSegments.$inferSelect;

export const competitors = pgTable("competitors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  marketShare: real("market_share").notNull().default(0),
  priceIndex: real("price_index").notNull().default(100),
  sentiment: real("sentiment").notNull().default(0),
  adSpend: real("ad_spend").notNull().default(0),
  strengths: text("strengths").array(),
  weaknesses: text("weaknesses").array(),
  threat: text("threat").default("medium"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCompetitorSchema = createInsertSchema(competitors).omit({
  id: true,
  createdAt: true,
});

export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Competitor = typeof competitors.$inferSelect;

export const businessInitiatives = pgTable("business_initiatives", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(),
  impact: integer("impact").notNull().default(0),
  effort: integer("effort").notNull().default(0),
  status: text("status").notNull().default("active"),
  priority: text("priority").default("medium"),
  description: text("description"),
  recommendation: text("recommendation"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertInitiativeSchema = createInsertSchema(businessInitiatives).omit({
  id: true,
  createdAt: true,
});

export type InsertInitiative = z.infer<typeof insertInitiativeSchema>;
export type Initiative = typeof businessInitiatives.$inferSelect;

export const generatedCampaigns = pgTable("generated_campaigns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  productName: text("product_name").notNull(),
  targetSegment: text("target_segment"),
  platform: text("platform"),
  tone: text("tone"),
  visualStyle: text("visual_style"),
  copyVariations: jsonb("copy_variations").$type<string[]>(),
  imageUrl: text("image_url"),
  voiceScript: text("voice_script"),
  voiceAudioUrl: text("voice_audio_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCampaignSchema = createInsertSchema(generatedCampaigns).omit({
  id: true,
  createdAt: true,
});

export type InsertCampaign = z.infer<typeof insertCampaignSchema>;
export type Campaign = typeof generatedCampaigns.$inferSelect;

export const generateTextRequestSchema = z.object({
  productName: z.string().min(1),
  targetSegment: z.string().optional(),
  platform: z.string().optional(),
  tone: z.string().optional(),
  keyBenefit: z.string().optional(),
});

export type GenerateTextRequest = z.infer<typeof generateTextRequestSchema>;

export const generateImageRequestSchema = z.object({
  productName: z.string().min(1),
  visualStyle: z.string().optional(),
  additionalContext: z.string().optional(),
});

export type GenerateImageRequest = z.infer<typeof generateImageRequestSchema>;

export const generateVoiceRequestSchema = z.object({
  script: z.string().min(1),
  voice: z.string().default("alloy"),
  speed: z.number().min(0.25).max(4.0).default(1.0),
});

export type GenerateVoiceRequest = z.infer<typeof generateVoiceRequestSchema>;
