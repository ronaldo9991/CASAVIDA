import { 
  type User, type InsertUser,
  type Segment, type InsertSegment,
  type Competitor, type InsertCompetitor,
  type Campaign, type InsertCampaign,
  type Initiative, type InsertInitiative,
  users, customerSegments, competitors, generatedCampaigns, businessInitiatives
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getSegments(): Promise<Segment[]>;
  getSegment(id: string): Promise<Segment | undefined>;
  createSegment(segment: InsertSegment): Promise<Segment>;
  createSegments(segments: InsertSegment[]): Promise<Segment[]>;
  deleteSegment(id: string): Promise<void>;
  deleteAllSegments(): Promise<void>;
  
  getCompetitors(): Promise<Competitor[]>;
  getCompetitor(id: string): Promise<Competitor | undefined>;
  createCompetitor(competitor: InsertCompetitor): Promise<Competitor>;
  createCompetitors(competitors: InsertCompetitor[]): Promise<Competitor[]>;
  deleteCompetitor(id: string): Promise<void>;
  deleteAllCompetitors(): Promise<void>;
  
  getInitiatives(): Promise<Initiative[]>;
  createInitiatives(initiatives: InsertInitiative[]): Promise<Initiative[]>;
  deleteAllInitiatives(): Promise<void>;
  
  getCampaigns(): Promise<Campaign[]>;
  getCampaign(id: string): Promise<Campaign | undefined>;
  createCampaign(campaign: InsertCampaign): Promise<Campaign>;
  updateCampaign(id: string, updates: Partial<InsertCampaign>): Promise<Campaign | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getSegments(): Promise<Segment[]> {
    return db.select().from(customerSegments);
  }

  async getSegment(id: string): Promise<Segment | undefined> {
    const [segment] = await db.select().from(customerSegments).where(eq(customerSegments.id, id));
    return segment || undefined;
  }

  async createSegment(segment: InsertSegment): Promise<Segment> {
    const [created] = await db.insert(customerSegments).values(segment).returning();
    return created;
  }

  async createSegments(segments: InsertSegment[]): Promise<Segment[]> {
    if (segments.length === 0) return [];
    return db.insert(customerSegments).values(segments).returning();
  }

  async deleteSegment(id: string): Promise<void> {
    await db.delete(customerSegments).where(eq(customerSegments.id, id));
  }

  async deleteAllSegments(): Promise<void> {
    await db.delete(customerSegments);
  }

  async getCompetitors(): Promise<Competitor[]> {
    return db.select().from(competitors);
  }

  async getCompetitor(id: string): Promise<Competitor | undefined> {
    const [competitor] = await db.select().from(competitors).where(eq(competitors.id, id));
    return competitor || undefined;
  }

  async createCompetitor(competitor: InsertCompetitor): Promise<Competitor> {
    const [created] = await db.insert(competitors).values(competitor).returning();
    return created;
  }

  async createCompetitors(competitorList: InsertCompetitor[]): Promise<Competitor[]> {
    if (competitorList.length === 0) return [];
    return db.insert(competitors).values(competitorList).returning();
  }

  async deleteCompetitor(id: string): Promise<void> {
    await db.delete(competitors).where(eq(competitors.id, id));
  }

  async deleteAllCompetitors(): Promise<void> {
    await db.delete(competitors);
  }

  async getInitiatives(): Promise<Initiative[]> {
    return db.select().from(businessInitiatives);
  }

  async createInitiatives(initiatives: InsertInitiative[]): Promise<Initiative[]> {
    if (initiatives.length === 0) return [];
    return db.insert(businessInitiatives).values(initiatives).returning();
  }

  async deleteAllInitiatives(): Promise<void> {
    await db.delete(businessInitiatives);
  }

  async getCampaigns(): Promise<Campaign[]> {
    return db.select().from(generatedCampaigns);
  }

  async getCampaign(id: string): Promise<Campaign | undefined> {
    const [campaign] = await db.select().from(generatedCampaigns).where(eq(generatedCampaigns.id, id));
    return campaign || undefined;
  }

  async createCampaign(campaign: InsertCampaign): Promise<Campaign> {
    const [created] = await db.insert(generatedCampaigns).values(campaign as any).returning();
    return created;
  }

  async updateCampaign(id: string, updates: Partial<InsertCampaign>): Promise<Campaign | undefined> {
    const [updated] = await db.update(generatedCampaigns)
      .set(updates as any)
      .where(eq(generatedCampaigns.id, id))
      .returning();
    return updated || undefined;
  }
}

export const storage = new DatabaseStorage();

export async function seedCasaVidaFailureData() {
  await storage.deleteAllSegments();
  await storage.deleteAllCompetitors();
  await storage.deleteAllInitiatives();

  const failingSegments = [
    {
      name: "Functional Homemakers",
      size: 4200,
      avgClv: 680,
      churnRisk: 0.38,
      growthRate: -0.12,
      description: "Core value-conscious customers being neglected. High churn risk due to lack of attention.",
      color: "#ef4444",
      healthScore: 28,
      clvTrend: -0.18,
      isCore: true,
      acquisitionCost: 45,
      retentionRate: 0.62,
    },
    {
      name: "Home Enhancers",
      size: 890,
      avgClv: 1850,
      churnRisk: 0.22,
      growthRate: 0.03,
      description: "Design-conscious premium segment. Expensive to acquire, weak sentiment, slow growth.",
      color: "#f59e0b",
      healthScore: 42,
      clvTrend: -0.05,
      isCore: false,
      acquisitionCost: 320,
      retentionRate: 0.78,
    },
    {
      name: "Occasional Browsers",
      size: 2100,
      avgClv: 180,
      churnRisk: 0.55,
      growthRate: -0.08,
      description: "Low-engagement visitors with minimal conversion. High churn, declining.",
      color: "#6b7280",
      healthScore: 18,
      clvTrend: -0.22,
      isCore: false,
      acquisitionCost: 25,
      retentionRate: 0.45,
    },
  ];

  const threateningCompetitors = [
    {
      name: "HomeStyle Direct",
      marketShare: 28,
      priceIndex: 92,
      sentiment: 0.82,
      adSpend: 650000,
      threat: "high",
      strengths: ["Lower prices", "Fast delivery", "Strong loyalty program"],
      weaknesses: ["Limited premium range", "Weak brand story"],
    },
    {
      name: "ModernNest",
      marketShare: 18,
      priceIndex: 115,
      sentiment: 0.78,
      adSpend: 420000,
      threat: "high",
      strengths: ["Design leadership", "Influencer partnerships", "Strong digital presence"],
      weaknesses: ["High prices", "Limited availability"],
    },
    {
      name: "ValueHome",
      marketShare: 22,
      priceIndex: 78,
      sentiment: 0.68,
      adSpend: 380000,
      threat: "medium",
      strengths: ["Aggressive pricing", "Wide distribution"],
      weaknesses: ["Poor quality perception", "Weak customer service"],
    },
  ];

  const overloadedInitiatives = [
    {
      name: "Premium Influencer Campaign",
      category: "Marketing",
      impact: 3,
      effort: 8,
      status: "active",
      priority: "pause",
      description: "High-cost influencer partnerships targeting Home Enhancers",
      recommendation: "PAUSE: High effort, low proven impact. Draining resources from core segment.",
    },
    {
      name: "Loyalty Program Revamp",
      category: "Retention",
      impact: 9,
      effort: 6,
      status: "delayed",
      priority: "focus",
      description: "Redesign loyalty program to reward Functional Homemakers",
      recommendation: "FOCUS: Critical for core segment retention. Prioritize immediately.",
    },
    {
      name: "AI Style Consultant",
      category: "Product",
      impact: 5,
      effort: 9,
      status: "planning",
      priority: "pause",
      description: "AI-powered styling recommendations for Home Enhancers",
      recommendation: "PAUSE: Expensive and targets wrong segment. Defer until core is stable.",
    },
    {
      name: "Churn Prediction Model",
      category: "Analytics",
      impact: 8,
      effort: 4,
      status: "active",
      priority: "focus",
      description: "ML model to identify at-risk Functional Homemakers before they leave",
      recommendation: "FOCUS: High impact, manageable effort. Key to stemming core churn.",
    },
    {
      name: "Showroom Expansion",
      category: "Operations",
      impact: 4,
      effort: 9,
      status: "active",
      priority: "pause",
      description: "Opening 3 new premium showrooms in urban centers",
      recommendation: "PAUSE: High capital, targets Home Enhancers. Freeze expansion until profitable.",
    },
    {
      name: "Value Bundle Promotions",
      category: "Pricing",
      impact: 7,
      effort: 3,
      status: "proposed",
      priority: "focus",
      description: "Bundled offers for Functional Homemakers to increase basket size",
      recommendation: "FOCUS: Quick win for core segment. High impact, low effort.",
    },
  ];

  await storage.createSegments(failingSegments);
  await storage.createCompetitors(threateningCompetitors);
  await storage.createInitiatives(overloadedInitiatives);

  return { segments: failingSegments.length, competitors: threateningCompetitors.length, initiatives: overloadedInitiatives.length };
}
