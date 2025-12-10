import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  
  return openai;
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY;
}

export async function generateMarketingCopy(params: {
  productName: string;
  targetSegment?: string;
  platform?: string;
  tone?: string;
  keyBenefit?: string;
}): Promise<string[]> {
  const client = getOpenAIClient();
  const { productName, targetSegment, platform, tone, keyBenefit } = params;
  
  if (!client) {
    return generateMockCopy(productName, targetSegment, tone);
  }

  try {
    const prompt = `You are an expert luxury furniture and home decor marketing copywriter for CasaVida, a premium brand.

Generate 2 compelling marketing copy variations for the following product:
- Product: ${productName}
- Target Segment: ${targetSegment || "Luxury consumers"}
- Platform: ${platform || "Instagram"}
- Tone: ${tone || "Premium & Elegant"}
- Key Benefit: ${keyBenefit || "Exceptional craftsmanship"}

Requirements:
1. Option A should use storytelling approach with emotional appeal
2. Option B should be benefit-focused and direct
3. Include relevant hashtags for social media
4. Keep each variation under 280 characters for social media compatibility

Respond in JSON format with the following structure:
{
  "variations": [
    { "label": "Option A: Storytelling", "copy": "..." },
    { "label": "Option B: Benefit Focused", "copy": "..." }
  ]
}`;

    const response = await client.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.variations?.map((v: { copy: string }) => v.copy) || [];
  } catch (error) {
    console.error("OpenAI text generation error, falling back to mock:", error);
    return generateMockCopy(productName, targetSegment, tone);
  }
}

function generateMockCopy(productName: string, targetSegment?: string, tone?: string): string[] {
  const segment = targetSegment?.toLowerCase() || "luxury";
  const toneStyle = tone?.toLowerCase() || "premium";
  
  // Varied copy templates based on product and segment
  const templates = [
    {
      storytelling: `True luxury isn't about excess. It's about the absence of noise. Meet the ${productName} — where timeless design meets everyday comfort. Hand-crafted from sustainable materials, it's not just furniture, it's your new sanctuary. #CasaVida #MinimalLiving`,
      benefit: `Upgrade your space with the ${productName}. Premium craftsmanship meets ergonomic design. Available now. #CasaVida #LuxuryLiving`
    },
    {
      storytelling: `In a world of noise, the ${productName} whispers elegance. Every curve tells a story of master artisans. Every material speaks of sustainability. Welcome home to quiet luxury. #CasaVida #QuietLuxury`,
      benefit: `The ${productName}: Where comfort meets sophistication. Sustainably crafted, beautifully designed, built to last generations. Discover yours today. #CasaVida #HomeSanctuary`
    },
    {
      storytelling: `Some pieces furnish a room. The ${productName} transforms it. Born from our obsession with detail and devotion to craft. This is furniture that lives as beautifully as you do. #CasaVida #DesignLegacy`,
      benefit: `Introducing the ${productName}. Exceptional materials, timeless design, uncompromising quality. For those who know the difference. #CasaVida #PremiumLiving`
    },
    {
      storytelling: `The ${productName} wasn't designed. It was discovered — in the quiet spaces between form and function. Where beauty meets purpose. Where your home meets its soul. #CasaVida #SoulfulDesign`,
      benefit: `Experience the ${productName}: Handcrafted excellence meets modern living. Premium quality, sustainable materials, lifetime craftsmanship. #CasaVida #CraftedForLife`
    }
  ];
  
  // Select template based on product name hash for variety
  const hash = productName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const templateIndex = hash % templates.length;
  const template = templates[templateIndex];
  
  // Customize based on segment
  let storytelling = template.storytelling;
  let benefit = template.benefit;
  
  if (segment.includes("functional") || segment.includes("homemaker")) {
    storytelling = storytelling.replace("luxury", "value").replace("quiet luxury", "smart living");
    benefit = benefit + " Perfect for everyday families.";
  } else if (segment.includes("enhancer") || segment.includes("premium")) {
    storytelling = storytelling.replace("sustainable", "rare and sustainable");
    benefit = benefit + " Exclusively for design connoisseurs.";
  }
  
  return [storytelling, benefit];
}

export async function generateProductImage(params: {
  productName: string;
  visualStyle?: string;
  additionalContext?: string;
}): Promise<string> {
  const client = getOpenAIClient();
  const { productName, visualStyle, additionalContext } = params;
  
  if (!client) {
    return getMockImageUrl(visualStyle, productName);
  }

  try {
    const styleMap: Record<string, string> = {
      "scandi": "Scandinavian minimal aesthetic, clean lines, neutral colors, natural light",
      "dark": "dark luxury photography, moody lighting, rich textures, sophisticated ambiance",
      "natural": "bright natural lighting, organic textures, warm earthy tones",
    };
    
    const styleDescription = styleMap[visualStyle || "scandi"] || styleMap["scandi"];
    
    const prompt = `Professional product photography of ${productName} for CasaVida luxury furniture brand. ${styleDescription}. High-end advertising campaign quality, studio lighting, premium materials visible, 4K resolution aesthetic. ${additionalContext || ""}`;

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    return response.data?.[0]?.url || getMockImageUrl(visualStyle, productName);
  } catch (error) {
    console.error("OpenAI image generation error, falling back to mock:", error);
    return getMockImageUrl(visualStyle, productName);
  }
}

function getMockImageUrl(visualStyle?: string, productName?: string): string {
  // Collection of varied furniture images from Unsplash
  const furnitureImages = [
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1024&h=1024&fit=crop", // Sofa
    "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1024&h=1024&fit=crop", // Dark room
    "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1024&h=1024&fit=crop", // Chair
    "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1024&h=1024&fit=crop", // Modern living
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1024&h=1024&fit=crop", // Armchair
    "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1024&h=1024&fit=crop", // Wooden table
    "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=1024&h=1024&fit=crop", // Bedroom
    "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1024&h=1024&fit=crop", // Dining
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1024&h=1024&fit=crop", // Living room
    "https://images.unsplash.com/photo-1618220179428-22790b461013?w=1024&h=1024&fit=crop", // Modern interior
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1024&h=1024&fit=crop", // Luxury lounge
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=1024&h=1024&fit=crop", // Cozy corner
  ];
  
  // Generate a consistent but unique index based on product name and timestamp
  const seed = productName ? productName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) : Date.now();
  const randomOffset = Math.floor(Date.now() / 1000) % furnitureImages.length;
  const index = (seed + randomOffset) % furnitureImages.length;
  
  return furnitureImages[index];
}

export async function generateVoiceAudio(params: {
  script: string;
  voice?: string;
  speed?: number;
}): Promise<Buffer> {
  const client = getOpenAIClient();
  const { script, voice = "alloy", speed = 1.0 } = params;
  
  if (!client) {
    return generateMockAudio(script);
  }

  try {
    const response = await client.audio.speech.create({
      model: "tts-1-hd",
      voice: voice as "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer",
      input: script,
      speed: speed,
    });

    const buffer = Buffer.from(await response.arrayBuffer());
    return buffer;
  } catch (error) {
    console.error("OpenAI voice generation error, falling back to mock:", error);
    return generateMockAudio(script);
  }
}

function generateMockAudio(script: string): Buffer {
  const sampleRate = 22050;
  const duration = Math.min(script.length / 10, 5);
  const numSamples = Math.floor(sampleRate * duration);
  
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + numSamples * 2, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(numSamples * 2, 40);
  
  const samples = Buffer.alloc(numSamples * 2);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const freq = 220 + Math.sin(t * 2) * 50;
    const value = Math.sin(2 * Math.PI * freq * t) * 8000;
    const clampedValue = Math.max(-32768, Math.min(32767, Math.round(value)));
    samples.writeInt16LE(clampedValue, i * 2);
  }
  
  return Buffer.concat([header, samples]);
}

export async function generateVoiceScript(productName: string): Promise<string> {
  const client = getOpenAIClient();
  
  if (!client) {
    return generateMockVoiceScript(productName);
  }

  try {
    const prompt = `You are a professional voice-over script writer for luxury brand commercials.

Write a 30-second voice-over script for a CasaVida commercial featuring: ${productName}

The script should:
- Start with ambient scene-setting
- Be calm, sophisticated, and evocative
- Appeal to luxury consumers seeking quality home furnishings
- End with a subtle call to action

Respond in JSON format:
{
  "script": "The complete voice-over script text"
}`;

    const response = await client.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_completion_tokens: 512,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result.script || generateMockVoiceScript(productName);
  } catch (error) {
    console.error("OpenAI voice script generation error, falling back to mock:", error);
    return generateMockVoiceScript(productName);
  }
}

function generateMockVoiceScript(productName: string): string {
  return `(Soft ambient music plays)

Close your eyes. Imagine a space that feels like a deep breath.

The ${productName} isn't just furniture — it's a statement of intention. Crafted from the finest materials, designed for those who understand that true luxury lies in simplicity.

Every curve, every texture, tells a story of master craftsmanship passed down through generations.

This is CasaVida. This is home, reimagined.

Visit our showroom today.`;
}

export interface DashboardData {
  segments: any[];
  competitors: any[];
  initiatives: any[];
}

export interface DashboardRecommendations {
  executiveSummary: string;
  topRisks: { risk: string; severity: string; action: string }[];
  strategicMoves: { move: string; priority: string; impact: string }[];
  segmentStrategy: { segment: string; recommendation: string }[];
}

export async function generateDashboardRecommendations(data: DashboardData): Promise<DashboardRecommendations> {
  const client = getOpenAIClient();
  
  if (!client) {
    return generateMockRecommendations(data);
  }

  try {
    const prompt = `You are a senior marketing strategy consultant analyzing CasaVida, a home & living retailer in crisis.

Current Data:
- Segments: ${JSON.stringify(data.segments.map(s => ({ name: s.name, size: s.size, churnRisk: s.churnRisk, healthScore: s.healthScore, isCore: s.isCore })))}
- Competitors: ${JSON.stringify(data.competitors.map(c => ({ name: c.name, marketShare: c.marketShare, threat: c.threat })))}
- Initiatives: ${JSON.stringify(data.initiatives.map(i => ({ name: i.name, priority: i.priority, impact: i.impact, effort: i.effort })))}

The company is making the classic mistake of chasing a premium "Home Enhancer" segment while neglecting their core "Functional Homemaker" customers, similar to the Bunnings/Homebase failure.

Provide strategic recommendations in JSON format:
{
  "executiveSummary": "2-3 sentence executive summary of the situation and key recommendation",
  "topRisks": [
    { "risk": "description", "severity": "critical|high|medium", "action": "immediate action" }
  ],
  "strategicMoves": [
    { "move": "strategic action", "priority": "immediate|short-term|long-term", "impact": "expected outcome" }
  ],
  "segmentStrategy": [
    { "segment": "segment name", "recommendation": "specific recommendation" }
  ]
}`;

    const response = await client.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_completion_tokens: 1024,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result as DashboardRecommendations;
  } catch (error) {
    console.error("OpenAI recommendations error, falling back to mock:", error);
    return generateMockRecommendations(data);
  }
}

function generateMockRecommendations(data: DashboardData): DashboardRecommendations {
  const coreSegment = data.segments.find(s => s.isCore);
  const churnRisk = coreSegment ? Math.round(coreSegment.churnRisk * 100) : 35;
  
  return {
    executiveSummary: `CasaVida is experiencing a strategic misalignment crisis. The company is over-investing in premium "Home Enhancer" acquisition while core "Functional Homemaker" customers are churning at ${churnRisk}%. Immediate priority should be core segment retention before further premium expansion.`,
    topRisks: [
      { risk: "Core segment churn accelerating", severity: "critical", action: "Launch targeted retention campaign within 2 weeks" },
      { risk: "Premium acquisition costs unsustainable", severity: "high", action: "Freeze new showroom expansion and influencer spend" },
      { risk: "Competitor HomeStyle Direct gaining share", severity: "high", action: "Match competitive pricing on core product lines" },
    ],
    strategicMoves: [
      { move: "Deploy Churn Prediction Model", priority: "immediate", impact: "Identify at-risk customers before they leave, enabling proactive retention" },
      { move: "Launch Value Bundle Promotions", priority: "immediate", impact: "Increase basket size and loyalty in core segment" },
      { move: "Pause Premium Influencer Campaign", priority: "immediate", impact: "Redirect $200K+ budget to core retention efforts" },
      { move: "Revamp Loyalty Program", priority: "short-term", impact: "Increase retention rate by 15-20% in core segment" },
    ],
    segmentStrategy: [
      { segment: "Functional Homemakers", recommendation: "PROTECT: This is your profit engine. Launch retention offers, improve value perception, and address competitive pricing pressure." },
      { segment: "Home Enhancers", recommendation: "PAUSE GROWTH: Do not abandon, but freeze acquisition spend until core is stabilized. Focus on organic growth and referrals." },
      { segment: "Occasional Browsers", recommendation: "CONVERT OR RELEASE: Implement quick-win conversion tactics; accept natural churn for low-value visitors." },
    ],
  };
}
