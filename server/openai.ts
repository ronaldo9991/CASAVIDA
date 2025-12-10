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
  const segment = targetSegment || "luxury";
  const toneStyle = tone || "premium";
  
  const storytelling = `True luxury isn't about excess. It's about the absence of noise. Meet the ${productName} — where timeless design meets everyday comfort. Hand-crafted from sustainable materials, it's not just furniture, it's your new sanctuary. Make space for what matters. #CasaVida #MinimalLiving`;
  
  const benefitFocused = `Upgrade your space with the ${productName}. Premium craftsmanship meets ergonomic design. Perfect for ${segment === "young" ? "modern living" : "discerning tastes"}. Available now in our showroom. #CasaVida #LuxuryLiving`;
  
  return [storytelling, benefitFocused];
}

export async function generateProductImage(params: {
  productName: string;
  visualStyle?: string;
  additionalContext?: string;
}): Promise<string> {
  const client = getOpenAIClient();
  const { productName, visualStyle, additionalContext } = params;
  
  if (!client) {
    return getMockImageUrl(visualStyle);
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

    return response.data?.[0]?.url || getMockImageUrl(visualStyle);
  } catch (error) {
    console.error("OpenAI image generation error, falling back to mock:", error);
    return getMockImageUrl(visualStyle);
  }
}

function getMockImageUrl(visualStyle?: string): string {
  const styleMap: Record<string, string> = {
    "scandi": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1024&h=1024&fit=crop",
    "dark": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=1024&h=1024&fit=crop",
    "natural": "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1024&h=1024&fit=crop",
  };
  return styleMap[visualStyle || "scandi"] || styleMap["scandi"];
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
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + script.length * 2, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(22050, 24);
  header.writeUInt32LE(44100, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write('data', 36);
  header.writeUInt32LE(script.length * 2, 40);
  
  const samples = Buffer.alloc(script.length * 2);
  for (let i = 0; i < script.length; i++) {
    const charCode = script.charCodeAt(i);
    samples.writeInt16LE(Math.sin(i * 0.1) * charCode * 10, i * 2);
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
