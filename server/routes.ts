import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage, seedCasaVidaFailureData } from "./storage";
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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ============ STATUS API ============
  app.get("/api/status/openai", (_req: Request, res: Response) => {
    res.json({ configured: isOpenAIConfigured() });
  });

  // ============ SEED DATA API ============
  app.post("/api/seed", async (_req: Request, res: Response) => {
    try {
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
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.post("/api/creative/voice", async (req: Request, res: Response) => {
    try {
      const parsed = generateVoiceRequestSchema.parse(req.body);
      const audioBuffer = await generateVoiceAudio(parsed);
      
      const isMock = !isOpenAIConfigured();
      const contentType = isMock ? "audio/wav" : "audio/mpeg";
      const extension = isMock ? "wav" : "mp3";
      
      res.set({
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="casavida_voice_${Date.now()}.${extension}"`,
        "Content-Length": audioBuffer.length,
      });
      res.send(audioBuffer);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        console.error("Voice generation error:", error);
        res.status(500).json({ error: error.message });
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
