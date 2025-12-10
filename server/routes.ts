import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage, seedCasaVidaFailureData } from "./storage";
import { initializeDatabase } from "./db";
import { 
  generateTextRequestSchema,
  generateImageRequestSchema,
  generateVoiceRequestSchema
} from "@shared/schema";
import { 
  generateMarketingCopy, 
  generateProductImage, 
  generateVoiceAudio,
  generateVoiceScript,
  isOpenAIConfigured,
  generateDashboardRecommendations
} from "./openai";
import { z } from "zod";

// Generate full 7190 customer dataset with realistic distribution
function generateFullCustomerDataset(isAfterStrategy: boolean) {
  const customers: any[] = [];
  const regions = ["Dubai", "Mumbai", "Delhi", "Abu Dhabi", "Bangalore"];
  
  // Segment sizes: 4200 FH + 890 HE + 2100 OB = 7190
  const segments = [
    { 
      prefix: "FH", 
      name: "Functional Homemakers", 
      count: 4200,
      before: { churnRiskMean: 0.38, churnRiskStd: 0.08, clvMean: 680, clvStd: 120, healthMean: 28, healthStd: 8 },
      after: { churnRiskMean: 0.15, churnRiskStd: 0.05, clvMean: 820, clvStd: 100, healthMean: 72, healthStd: 10 }
    },
    { 
      prefix: "HE", 
      name: "Home Enhancers", 
      count: 890,
      before: { churnRiskMean: 0.22, churnRiskStd: 0.06, clvMean: 1850, clvStd: 250, healthMean: 42, healthStd: 10 },
      after: { churnRiskMean: 0.18, churnRiskStd: 0.04, clvMean: 1920, clvStd: 200, healthMean: 55, healthStd: 8 }
    },
    { 
      prefix: "OB", 
      name: "Occasional Browsers", 
      count: 2100,
      before: { churnRiskMean: 0.55, churnRiskStd: 0.12, clvMean: 180, clvStd: 50, healthMean: 18, healthStd: 6 },
      after: { churnRiskMean: 0.42, churnRiskStd: 0.10, clvMean: 210, clvStd: 45, healthMean: 28, healthStd: 7 }
    }
  ];

  let id = 1;
  
  // Simple pseudo-random with seed for reproducibility
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  for (const seg of segments) {
    const params = isAfterStrategy ? seg.after : seg.before;
    
    for (let i = 0; i < seg.count; i++) {
      const seed = id * 1000 + i;
      const rand1 = seededRandom(seed);
      const rand2 = seededRandom(seed + 1);
      const rand3 = seededRandom(seed + 2);
      const rand4 = seededRandom(seed + 3);
      const rand5 = seededRandom(seed + 4);
      
      // Box-Muller transform for normal distribution
      const u1 = Math.max(0.0001, rand1);
      const u2 = rand2;
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      
      const churnRisk = Math.max(0.05, Math.min(0.85, params.churnRiskMean + z * params.churnRiskStd));
      const actualChurn = Math.max(0.03, churnRisk - 0.02 + rand3 * 0.04);
      const clv = Math.max(50, Math.round(params.clvMean + (rand4 - 0.5) * params.clvStd * 2));
      const healthScore = Math.max(5, Math.min(95, Math.round(params.healthMean + (rand5 - 0.5) * params.healthStd * 2)));
      
      const purchaseFreq = isAfterStrategy 
        ? Math.round((2 + rand1 * 3) * 10) / 10 
        : Math.round((1 + rand1 * 2) * 10) / 10;
      const avgOrderValue = Math.round(clv / (3 + rand2 * 4));
      const daysInactive = isAfterStrategy 
        ? Math.round(5 + rand3 * 30) 
        : Math.round(20 + rand3 * 80);
      const totalOrders = Math.round(3 + rand4 * 20);
      const tenure = Math.round(6 + rand5 * 48);
      
      const baseDate = isAfterStrategy ? new Date('2024-08-01') : new Date('2024-02-01');
      baseDate.setDate(baseDate.getDate() - Math.round(daysInactive));
      const lastPurchase = baseDate.toISOString().split('T')[0];
      
      customers.push({
        id,
        customerId: `${seg.prefix}-${String(i + 1).padStart(4, '0')}`,
        segment: seg.name,
        predictedChurnRisk: Math.round(churnRisk * 100) / 100,
        actualChurn: Math.round(actualChurn * 100) / 100,
        clv,
        healthScore,
        purchaseFreq,
        avgOrderValue,
        daysInactive,
        totalOrders,
        tenure,
        lastPurchase,
        region: regions[Math.floor(rand1 * regions.length)]
      });
      
      id++;
    }
  }
  
  return customers;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ============ STATUS API ============
  app.get("/api/status/openai", (_req: Request, res: Response) => {
    res.json({ 
      configured: isOpenAIConfigured(),
      hasGemini: !!process.env.GEMINI_API_KEY,
      hasHuggingFace: !!process.env.HUGGINGFACE_API_KEY,
      hasElevenLabs: !!process.env.ELEVEN_LABS_API_KEY,
    });
  });

  // ============ DATABASE INITIALIZATION API ============
  app.post("/api/db/init", async (_req: Request, res: Response) => {
    try {
      const result = await initializeDatabase();
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ SEED DATA API ============
  app.post("/api/seed", async (_req: Request, res: Response) => {
    try {
      // Initialize database first if tables don't exist
      await initializeDatabase();
      // Then seed the data
      const result = await seedCasaVidaFailureData();
      res.json({ success: true, seeded: result });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ SEGMENTS API (Read-only + Download) ============
  app.get("/api/segments", async (_req: Request, res: Response) => {
    try {
      const segments = await storage.getSegments();
      res.json(segments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ COMPETITORS API (Read-only + Download) ============
  app.get("/api/competitors", async (_req: Request, res: Response) => {
    try {
      const competitors = await storage.getCompetitors();
      res.json(competitors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ INITIATIVES API ============
  app.get("/api/initiatives", async (_req: Request, res: Response) => {
    try {
      const initiatives = await storage.getInitiatives();
      res.json(initiatives);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ DASHBOARD SUMMARY API ============
  app.get("/api/dashboard/summary", async (_req: Request, res: Response) => {
    try {
      const segments = await storage.getSegments();
      const competitors = await storage.getCompetitors();
      const initiatives = await storage.getInitiatives();

      const coreSegment = segments.find(s => s.isCore);
      const newSegment = segments.find(s => !s.isCore && s.name.includes("Enhancer"));
      
      const totalCustomers = segments.reduce((acc, s) => acc + s.size, 0);
      const avgChurnRisk = segments.length > 0 
        ? segments.reduce((acc, s) => acc + s.churnRisk * s.size, 0) / totalCustomers 
        : 0;
      const totalClv = segments.reduce((acc, s) => acc + s.avgClv * s.size, 0);
      
      const competitorThreat = competitors.filter(c => c.threat === "high").length;
      const totalCompetitorShare = competitors.reduce((acc, c) => acc + c.marketShare, 0);
      const casaVidaShare = Math.max(0, 100 - totalCompetitorShare);

      const focusInitiatives = initiatives.filter(i => i.priority === "focus");
      const pauseInitiatives = initiatives.filter(i => i.priority === "pause");

      const summary = {
        segments: {
          total: segments.length,
          totalCustomers,
          core: coreSegment ? {
            name: coreSegment.name,
            size: coreSegment.size,
            healthScore: coreSegment.healthScore,
            churnRisk: coreSegment.churnRisk,
            clvTrend: coreSegment.clvTrend,
          } : null,
          new: newSegment ? {
            name: newSegment.name,
            size: newSegment.size,
            healthScore: newSegment.healthScore,
            acquisitionCost: newSegment.acquisitionCost,
            growthRate: newSegment.growthRate,
          } : null,
        },
        kpis: {
          avgChurnRisk: Math.round(avgChurnRisk * 100),
          totalClv: Math.round(totalClv),
          marketShare: Math.round(casaVidaShare),
          competitorThreat,
        },
        initiatives: {
          total: initiatives.length,
          focus: focusInitiatives.length,
          pause: pauseInitiatives.length,
          focusList: focusInitiatives.map(i => ({ name: i.name, impact: i.impact, effort: i.effort })),
          pauseList: pauseInitiatives.map(i => ({ name: i.name, recommendation: i.recommendation })),
        },
        alerts: [
          ...(coreSegment && coreSegment.churnRisk > 0.3 ? [{
            type: "critical",
            message: `${coreSegment.name} segment at ${Math.round(coreSegment.churnRisk * 100)}% churn risk`,
            action: "Activate retention campaign immediately",
          }] : []),
          ...(coreSegment && coreSegment.clvTrend && coreSegment.clvTrend < -0.1 ? [{
            type: "warning",
            message: `CLV declining ${Math.round(Math.abs(coreSegment.clvTrend) * 100)}% in core segment`,
            action: "Review pricing and value proposition",
          }] : []),
          ...(newSegment && newSegment.acquisitionCost && newSegment.acquisitionCost > 200 ? [{
            type: "warning",
            message: `${newSegment.name} acquisition cost is $${newSegment.acquisitionCost}`,
            action: "Evaluate ROI of premium acquisition spend",
          }] : []),
        ],
      };

      res.json(summary);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ AI RECOMMENDATIONS API ============
  app.get("/api/dashboard/recommendations", async (_req: Request, res: Response) => {
    try {
      const segments = await storage.getSegments();
      const competitors = await storage.getCompetitors();
      const initiatives = await storage.getInitiatives();

      const recommendations = await generateDashboardRecommendations({
        segments,
        competitors,
        initiatives,
      });

      res.json(recommendations);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ CREATIVE STUDIO API (OpenAI) ============
  app.post("/api/creative/text", async (req: Request, res: Response) => {
    try {
      const parsed = generateTextRequestSchema.parse(req.body);
      const copyVariations = await generateMarketingCopy(parsed);
      
      const campaign = await storage.createCampaign({
        productName: parsed.productName,
        targetSegment: parsed.targetSegment,
        platform: parsed.platform,
        tone: parsed.tone,
        copyVariations: copyVariations,
      });
      
      res.json({ copyVariations, campaignId: campaign.id });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Text generation error:", error);
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.post("/api/creative/image", async (req: Request, res: Response) => {
    try {
      const parsed = generateImageRequestSchema.parse(req.body);
      const imageUrl = await generateProductImage(parsed);
      
      res.json({ imageUrl });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Image generation error:", error);
        res.status(500).json({ 
          error: error.message || "Failed to generate image. Please ensure OPENAI_API_KEY is configured and has sufficient credits." 
        });
      }
    }
  });

  app.post("/api/creative/voice", async (req: Request, res: Response) => {
    try {
      const parsed = generateVoiceRequestSchema.parse(req.body);
      const audioBuffer = await generateVoiceAudio(parsed);
      
      // Eleven Labs returns MP3
      res.set({
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="casavida_voice_${Date.now()}.mp3"`,
        "Content-Length": audioBuffer.length,
      });
      res.send(audioBuffer);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Voice generation error:", error);
        res.status(500).json({ 
          error: error.message || "Failed to generate voice audio. Please ensure ELEVEN_LABS_API_KEY is configured." 
        });
      }
    }
  });

  app.post("/api/creative/voice-script", async (req: Request, res: Response) => {
    try {
      const { productName } = req.body;
      if (!productName) {
        return res.status(400).json({ error: "productName is required" });
      }
      const script = await generateVoiceScript(productName);
      res.json({ script });
    } catch (error: any) {
      console.error("Voice script generation error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // ============ FULL CUSTOMER DATASET API ============
  app.get("/api/dataset/customers", (_req: Request, res: Response) => {
    try {
      const period = _req.query.period as string || 'before';
      const customers = generateFullCustomerDataset(period === 'after');
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ CAMPAIGNS API ============
  app.get("/api/campaigns", async (_req: Request, res: Response) => {
    try {
      const campaigns = await storage.getCampaigns();
      res.json(campaigns);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/campaigns/:id", async (req: Request, res: Response) => {
    try {
      const campaign = await storage.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: "Campaign not found" });
      }
      res.json(campaign);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
