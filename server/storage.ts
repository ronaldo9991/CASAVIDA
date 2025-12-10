import { 
  type User, type InsertUser,
  type Segment, type InsertSegment,
  type Competitor, type InsertCompetitor,
  type Campaign, type InsertCampaign,
  users, customerSegments, competitors, generatedCampaigns
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
