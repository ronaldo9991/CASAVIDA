import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertSegmentSchema, 
  insertCompetitorSchema, 
  generateTextRequestSchema,
  generateImageRequestSchema,
  generateVoiceRequestSchema
} from "@shared/schema";
import { 
  generateMarketingCopy, 
  generateProductImage, 
  generateVoiceAudio,
  generateVoiceScript,
  isOpenAIConfigured 
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

  // ============ SEGMENTS API ============
  app.get("/api/segments", async (_req: Request, res: Response) => {
    try {
      const segments = await storage.getSegments();
      res.json(segments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/segments", async (req: Request, res: Response) => {
    try {
      const parsed = insertSegmentSchema.parse(req.body);
      const segment = await storage.createSegment(parsed);
      res.status(201).json(segment);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.post("/api/segments/bulk", async (req: Request, res: Response) => {
    try {
      const parsed = z.array(insertSegmentSchema).parse(req.body);
      const segments = await storage.createSegments(parsed);
      res.status(201).json(segments);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.delete("/api/segments/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteSegment(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/segments", async (_req: Request, res: Response) => {
    try {
      await storage.deleteAllSegments();
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============ COMPETITORS API ============
  app.get("/api/competitors", async (_req: Request, res: Response) => {
    try {
      const competitors = await storage.getCompetitors();
      res.json(competitors);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/competitors", async (req: Request, res: Response) => {
    try {
      const parsed = insertCompetitorSchema.parse(req.body);
      const competitor = await storage.createCompetitor(parsed);
      res.status(201).json(competitor);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.post("/api/competitors/bulk", async (req: Request, res: Response) => {
    try {
      const parsed = z.array(insertCompetitorSchema).parse(req.body);
      const competitors = await storage.createCompetitors(parsed);
      res.status(201).json(competitors);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.delete("/api/competitors/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteCompetitor(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete("/api/competitors", async (_req: Request, res: Response) => {
    try {
      await storage.deleteAllCompetitors();
      res.status(204).send();
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
