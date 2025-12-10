import OpenAI from "openai";

// OpenAI client singleton with optimized configuration
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI | null {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }
  
  if (!openai) {
    openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      maxRetries: 3,
      timeout: 30000,
    });
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
    const systemPrompt = `You are an expert luxury furniture and home decor marketing copywriter for CasaVida, a premium brand that blends Indian craftsmanship with Dubai elegance. Your writing is sophisticated, emotionally resonant, and conversion-focused.`;

    const userPrompt = `Create 2 compelling marketing copy variations for CasaVida's ${productName}.

CONTEXT:
- Target Audience: ${targetSegment || "Luxury consumers seeking premium home furnishings"}
- Platform: ${platform || "Instagram"}
- Tone: ${tone || "Premium & Elegant"}
- Key Benefit: ${keyBenefit || "Exceptional craftsmanship and timeless design"}

REQUIREMENTS:
1. Variation A (Storytelling): Use narrative approach with emotional appeal. Tell a story about transformation, comfort, or lifestyle enhancement. Include sensory details.
2. Variation B (Benefit-Focused): Lead with clear value proposition. Highlight specific benefits, quality, and craftsmanship. Be direct and persuasive.

TECHNICAL:
- Each variation must be under 280 characters (including spaces)
- Include 2-3 relevant hashtags (e.g., #CasaVida, #LuxuryLiving, #HomeDesign)
- Avoid generic phrases - be specific to CasaVida's brand identity
- Use active voice and compelling verbs

Respond ONLY with valid JSON in this exact format:
{
  "variations": [
    { "label": "Option A: Storytelling", "copy": "..." },
    { "label": "Option B: Benefit Focused", "copy": "..." }
  ]
}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o for better reliability and results
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.8, // Higher creativity for marketing copy
      max_tokens: 512,
    } as any);

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("Empty response from OpenAI");
    }

    const result = JSON.parse(content);
    const variations = result.variations?.map((v: { copy: string }) => v.copy.trim()) || [];
    
    if (variations.length >= 2) {
      return variations;
    }
    
    // Fallback if parsing fails
    return generateMockCopy(productName, targetSegment, tone);
  } catch (error) {
    console.error("OpenAI text generation error:", error);
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
    throw new Error("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.");
  }

  // Enhanced style mapping with more detail
  const styleMap: Record<string, string> = {
    "scandi": "Scandinavian minimal aesthetic with clean lines, neutral colors (beige, white, gray), natural light streaming through large windows, minimalist composition, modern furniture styling",
    "dark": "Dark luxury photography with moody lighting, rich textures (velvet, leather, wood), sophisticated ambiance, dramatic shadows, premium materials, editorial style",
    "natural": "Bright natural lighting, organic textures (wood grain, natural fibers, stone), warm earthy tones (browns, tans, greens), cozy atmosphere, sustainable materials visible",
  };
  
  const styleDescription = styleMap[visualStyle || "scandi"] || styleMap["scandi"];
  
  // Enhanced prompt for DALL-E 3
  const prompt = `Professional product photography of ${productName} for CasaVida luxury furniture brand. 

STYLE: ${styleDescription}

QUALITY REQUIREMENTS:
- High-end advertising campaign quality
- Studio lighting setup with professional photography
- Premium materials clearly visible (wood grain, fabric texture, metal finishes)
- 4K resolution aesthetic, sharp focus, professional composition
- Clean background that complements the product
- Product should be the clear focal point

${additionalContext ? `ADDITIONAL CONTEXT: ${additionalContext}` : ''}

The image should convey luxury, craftsmanship, and sophistication. Avoid text, watermarks, or logos in the image.`;

  try {
    const response = await client.images.generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard", // Change to "hd" for higher quality (costs more: $0.080 vs $0.040)
      response_format: "url",
    } as any); // DALL-E 3 is the default model

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned from DALL-E 3 API");
    }

    return imageUrl;
  } catch (error: any) {
    console.error("DALL-E 3 image generation error:", error);
    // NO MOCK FALLBACK - Always throw error if API fails
    throw new Error(`Failed to generate image: ${error.message || "Unknown error"}`);
  }
}

// Removed getMockImageUrl - no mock images, always use API

// Voice generation using Eleven Labs (replacing OpenAI TTS)
export async function generateVoiceAudio(params: {
  script: string;
  voice?: string;
  speed?: number;
}): Promise<Buffer> {
  const apiKey = process.env.ELEVEN_LABS_API_KEY;
  const { script, voice = "21m00Tcm4TlvDq8ikWAM", speed = 1.0 } = params;
  
  if (!apiKey) {
    throw new Error("Eleven Labs API key not configured. Please set ELEVEN_LABS_API_KEY environment variable.");
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}`,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: script,
          model_id: "eleven_multilingual_v2", // Best quality multilingual model
          voice_settings: {
            stability: 0.6, // Higher stability for professional voice
            similarity_boost: 0.8, // Higher similarity for consistent voice
            style: 0.3, // Moderate style for natural delivery
            use_speaker_boost: true, // Enhanced clarity
          },
          generation_config: {
            speed: speed,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Eleven Labs API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error: any) {
    console.error("Eleven Labs voice generation error:", error);
    throw new Error(`Failed to generate voice audio: ${error.message || "Unknown error"}`);
  }
}

// Removed generateMockAudio - no mock audio, always use Eleven Labs API

export async function generateVoiceScript(productName: string): Promise<string> {
  const client = getOpenAIClient();
  
  if (!client) {
    return generateMockVoiceScript(productName);
  }

  try {
    const prompt = `Write a 30-second voice-over script for a CasaVida luxury furniture commercial featuring: ${productName}

REQUIREMENTS:
- Start with ambient scene-setting (2-3 seconds of descriptive, sensory language)
- Be calm, sophisticated, and evocative throughout
- Appeal to luxury consumers seeking quality, craftsmanship, and timeless design
- Include specific details about the product that convey premium quality
- End with a subtle, elegant call to action
- Total script should be approximately 75-90 words (30 seconds at normal speaking pace)
- Use present tense and active voice
- Avoid clichés - be original and specific to CasaVida's brand

Respond ONLY with valid JSON:
{
  "script": "The complete voice-over script text (no stage directions, just the spoken words)"
}`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a professional voice-over script writer specializing in luxury brand commercials. Your scripts are sophisticated, evocative, and designed to create emotional connections with affluent consumers." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 300,
    } as any);

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
    const prompt = `Analyze CasaVida, a home & living retailer experiencing a strategic crisis.

CURRENT SITUATION:
The company is making the classic mistake of chasing a premium "Home Enhancer" segment while neglecting their core "Functional Homemaker" customers, similar to the Bunnings/Homebase failure.

DATA:
- Customer Segments: ${JSON.stringify(data.segments.map(s => ({ 
  name: s.name, 
  size: s.size, 
  churnRisk: s.churnRisk, 
  healthScore: s.healthScore, 
  isCore: s.isCore,
  avgClv: s.avgClv,
  growthRate: s.growthRate
})))}

- Competitors: ${JSON.stringify(data.competitors.map(c => ({ 
  name: c.name, 
  marketShare: c.marketShare, 
  threat: c.threat,
  priceIndex: c.priceIndex,
  sentiment: c.sentiment
})))}

- Business Initiatives: ${JSON.stringify(data.initiatives.map(i => ({ 
  name: i.name, 
  priority: i.priority, 
  impact: i.impact, 
  effort: i.effort,
  status: i.status,
  category: i.category
})))}

REQUIREMENTS:
Provide strategic recommendations in JSON format with:
1. executiveSummary: 2-3 sentence summary of the crisis and key recommendation
2. topRisks: Array of 3-5 risks with severity (critical/high/medium) and immediate action
3. strategicMoves: Array of 4-6 strategic actions with priority (immediate/short-term/long-term) and expected impact
4. segmentStrategy: Array with specific recommendation for each segment

Be specific, actionable, and data-driven. Prioritize based on impact and urgency.`;

    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a senior marketing strategy consultant with 20+ years of experience analyzing retail businesses in crisis. You specialize in identifying strategic misalignments and providing actionable, data-driven recommendations. Your analysis is always specific, measurable, and prioritized." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3, // Lower temperature for more analytical, consistent output
      max_tokens: 1500,
    } as any);

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
