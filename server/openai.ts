import { GoogleGenerativeAI } from "@google/generative-ai";

// Gemini AI client singleton
let gemini: GoogleGenerativeAI | null = null;

function getGeminiClient(): GoogleGenerativeAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  
  if (!gemini) {
    gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  
  return gemini;
}

export function isOpenAIConfigured(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

export async function generateMarketingCopy(params: {
  productName: string;
  targetSegment?: string;
  platform?: string;
  tone?: string;
  keyBenefit?: string;
}): Promise<string[]> {
  const client = getGeminiClient();
  const { productName, targetSegment, platform, tone, keyBenefit } = params;
  
  if (!client) {
    return generateMockCopy(productName, targetSegment, tone);
  }

  try {
    const model = client.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 512,
        responseMimeType: "application/json",
      },
    });

    const prompt = `You are an expert luxury furniture and home decor marketing copywriter for CasaVida, a premium brand that blends Indian craftsmanship with Dubai elegance. Your writing is sophisticated, emotionally resonant, and conversion-focused.

Create 2 compelling marketing copy variations for CasaVida's ${productName}.

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const variations = parsed.variations?.map((v: { copy: string }) => v.copy.trim()) || [];
      if (variations.length >= 2) {
        return variations;
      }
    }
    
    // Fallback if parsing fails
    return generateMockCopy(productName, targetSegment, tone);
  } catch (error) {
    console.error("Gemini text generation error:", error);
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
  const client = getGeminiClient();
  const { productName, visualStyle, additionalContext } = params;
  
  if (!client) {
    throw new Error("Gemini API key not configured. Please set GEMINI_API_KEY environment variable.");
  }

  // Enhanced style mapping with more detail
    const styleMap: Record<string, string> = {
    "scandi": "Scandinavian minimal aesthetic with clean lines, neutral colors (beige, white, gray), natural light streaming through large windows, minimalist composition, modern furniture styling",
    "dark": "Dark luxury photography with moody lighting, rich textures (velvet, leather, wood), sophisticated ambiance, dramatic shadows, premium materials, editorial style",
    "natural": "Bright natural lighting, organic textures (wood grain, natural fibers, stone), warm earthy tones (browns, tans, greens), cozy atmosphere, sustainable materials visible",
    };
    
    const styleDescription = styleMap[visualStyle || "scandi"] || styleMap["scandi"];
    
  try {
    // Create a direct, precise prompt that focuses on the EXACT product name
    // No interpretation, no substitution - just the exact product the user specified
    const productNameUpper = productName.toUpperCase();
    
    // Build a precise, direct prompt that ensures exact product matching
    let optimizedPrompt = `Professional product photography of ${productName}, luxury furniture, CasaVida brand. `;
    
    // Add specific details based on product name keywords
    if (productNameUpper.includes('GAMING CHAIR') || productNameUpper.includes('GAMING')) {
      optimizedPrompt += `Modern ergonomic gaming chair with RGB lighting, racing-style design, adjustable armrests, high back support, premium materials, gaming aesthetic. `;
    } else if (productNameUpper.includes('CHAIR')) {
      optimizedPrompt += `Premium ${productName}, luxury chair design, high-quality materials, elegant craftsmanship. `;
    } else if (productNameUpper.includes('SOFA') || productNameUpper.includes('COUCH')) {
      optimizedPrompt += `Luxury ${productName}, premium sofa, comfortable seating, elegant design, high-end furniture. `;
    } else if (productNameUpper.includes('TABLE')) {
      optimizedPrompt += `Premium ${productName}, luxury table, elegant design, high-quality materials. `;
    } else {
      optimizedPrompt += `Premium ${productName}, luxury furniture, elegant design, high-quality materials. `;
    }
    
    // Add style description
    optimizedPrompt += `${styleDescription}. `;
    
    // Add photography details
    optimizedPrompt += `Professional studio photography, 4K quality, sharp focus, perfect lighting, clean minimal background, product is the clear focal point, high-end advertising campaign aesthetic, luxury brand styling. `;
    
    // Add any additional context
    if (additionalContext) {
      optimizedPrompt += `${additionalContext}. `;
    }
    
    // Final requirements
    optimizedPrompt += `No text, no watermarks, no logos, product photography only.`;
    
    console.log("Direct optimized prompt:", optimizedPrompt.substring(0, 200) + "...");

    // Use Pollinations.ai with multiple model attempts for reliability and efficiency
    // Try best quality models first, then fallback to faster models
    
    const models = [
      { name: 'flux-pro', desc: 'Flux Pro (highest quality)' },
      { name: 'flux.1-schnell', desc: 'Flux Schnell (fast, high quality)' },
      { name: 'flux', desc: 'Flux (standard quality)' },
    ];
    
    for (const model of models) {
      try {
        const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(optimizedPrompt)}?width=1024&height=1024&model=${model.name}&nologo=true&enhance=true&seed=${Date.now()}`;
        
        console.log(`Attempting image generation with ${model.desc}...`);
        
        const imageResponse = await fetch(imageUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'image/*',
            'Referer': 'https://pollinations.ai/',
          },
        });

        if (imageResponse.ok) {
          const imageBlob = await imageResponse.blob();
          if (imageBlob.size > 1000) { // Ensure we got a valid image (at least 1KB)
            const arrayBuffer = await imageBlob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString('base64');
            const mimeType = imageBlob.type || 'image/png';
            
            console.log(`✓ Image generated successfully using ${model.desc}`);
            return `data:${mimeType};base64,${base64}`;
          } else {
            console.warn(`Image from ${model.name} too small (${imageBlob.size} bytes), trying next model...`);
          }
        } else {
          console.warn(`${model.name} returned status ${imageResponse.status}, trying next model...`);
        }
      } catch (modelError: any) {
        console.warn(`${model.name} failed:`, modelError.message);
        // Continue to next model
      }
    }

    // If all models failed, throw error
    throw new Error(
      "Image generation failed after trying multiple models. " +
      "Please check your internet connection and try again. The prompt was optimized for: " + productName
    );
  } catch (error: any) {
    console.error("Image generation error:", error);
    
    // Provide helpful error messages
    if (error.message.includes("Gemini API key")) {
      throw new Error("Gemini API key not configured. Please set GEMINI_API_KEY in Railway environment variables.");
    }
    
    throw new Error(`Failed to generate image: ${error.message || "Unknown error. Please check your GEMINI_API_KEY is configured."}`);
  }
}

// Removed getMockImageUrl - no mock images, always use API

// Voice generation using Murf AI
// Mapping of friendly voice names to Murf AI voice IDs
// Murf AI offers 120+ voices across 20+ languages
// Using actual Murf AI voice IDs from their API
const MURF_VOICES: Record<string, string> = {
  "rachel": "en-US-Rachel", // Neutral, professional (female)
  "adam": "en-US-Adam", // Deep, authoritative (male)
  "antoni": "en-US-Antoni", // Warm, friendly (male)
  "bella": "en-US-Bella", // Soft, gentle (female)
  "josh": "en-US-Josh", // Casual, conversational (male)
  "sam": "en-US-Sam", // Balanced, versatile (male)
};

export async function generateVoiceAudio(params: {
  script: string;
  voice?: string;
  speed?: number;
}): Promise<Buffer> {
  const apiKey = process.env.MURF_API_KEY;
  const { script, voice: voiceName = "rachel", speed = 1.0 } = params;
  
  if (!apiKey) {
    throw new Error("Murf AI API key not configured. Please set MURF_API_KEY environment variable in Railway.");
  }

  // Validate API key format
  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new Error("Invalid Murf AI API key format. Please check your MURF_API_KEY environment variable.");
  }

  try {
    // Clean the script text - remove stage directions and extra whitespace
    const cleanScript = script
      .replace(/\([^)]*\)/g, '') // Remove text in parentheses (stage directions)
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    if (!cleanScript || cleanScript.length === 0) {
      throw new Error("Script text is empty after cleaning. Please provide valid text to convert to speech.");
    }

    // Murf AI Text to Speech API - Using correct endpoint
    // Based on Murf AI API documentation, the correct endpoint is /v1/speech/generate
    // Using api-key header (not Bearer token)
    
    // First, fetch available voices to get correct voice IDs
    let finalVoiceId: string | null = null;
    
    try {
      const voicesResponse = await fetch('https://api.murf.ai/v1/speech/voices', {
        method: 'GET',
        headers: {
          'api-key': apiKey.trim(), // Murf AI uses api-key header
        },
      });
      
      if (voicesResponse.ok) {
        const voicesData = await voicesResponse.json();
        // Murf AI returns voices in different formats - try to find matching voice
        if (voicesData.voices && Array.isArray(voicesData.voices)) {
          const matchingVoice = voicesData.voices.find((v: any) => 
            v.name?.toLowerCase().includes(voiceName.toLowerCase()) ||
            v.voiceId?.toLowerCase().includes(voiceName.toLowerCase()) ||
            v.displayName?.toLowerCase().includes(voiceName.toLowerCase())
          );
          if (matchingVoice?.voiceId) {
            finalVoiceId = matchingVoice.voiceId;
          } else if (voicesData.voices.length > 0) {
            // Use first available English voice as fallback
            finalVoiceId = voicesData.voices[0].voiceId;
          }
        } else if (voicesData.data && Array.isArray(voicesData.data)) {
          // Alternative response format
          const matchingVoice = voicesData.data.find((v: any) => 
            v.name?.toLowerCase().includes(voiceName.toLowerCase()) ||
            v.voiceId?.toLowerCase().includes(voiceName.toLowerCase())
          );
          if (matchingVoice?.voiceId) {
            finalVoiceId = matchingVoice.voiceId;
          }
        } else if (Array.isArray(voicesData)) {
          // Direct array format
          const matchingVoice = voicesData.find((v: any) => 
            v.name?.toLowerCase().includes(voiceName.toLowerCase()) ||
            v.voiceId?.toLowerCase().includes(voiceName.toLowerCase())
          );
          if (matchingVoice?.voiceId) {
            finalVoiceId = matchingVoice.voiceId;
          } else if (voicesData.length > 0) {
            finalVoiceId = voicesData[0].voiceId;
          }
        }
      }
    } catch (voiceFetchError: any) {
      console.warn("Could not fetch voices list:", voiceFetchError.message);
    }

    // If we couldn't fetch voices, we'll let the API error tell us what voices are available
    // Don't use fallback - let the API error guide us to correct voice IDs

    // Murf AI Text to Speech API endpoint - CORRECT ENDPOINT
    // Using /v1/speech/generate with api-key header
    const response = await fetch('https://api.murf.ai/v1/speech/generate', {
      method: 'POST',
      headers: {
        'api-key': apiKey.trim(), // Murf AI uses api-key header (confirmed)
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: cleanScript,
        voiceId: finalVoiceId || "en-US_Matthew", // Use voiceId parameter
        speed: speed,
        format: 'mp3',
        sampleRate: 44100,
      }),
    });

    if (!response.ok) {
      let errorMessage = `Murf AI API error: ${response.status} ${response.statusText}`;
      
      try {
        const errorData = await response.json();
        
        // Parse Murf AI error response
        if (errorData.message) {
          errorMessage = `Murf AI Error: ${errorData.message}`;
        } else if (errorData.error) {
          errorMessage = `Murf AI Error: ${errorData.error}`;
        } else {
          errorMessage = `Murf AI API Error: ${JSON.stringify(errorData)}`;
        }
      } catch (parseError) {
        // If JSON parsing fails, try to get text
        const errorText = await response.text().catch(() => 'Unknown error');
        errorMessage = `Murf AI API error: ${response.status} ${response.statusText} - ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    // Check response content type
    const contentType = response.headers.get('content-type') || '';
    
    // Murf AI returns JSON with audioFile URL, not direct audio
    if (contentType.includes('application/json') || contentType.includes('json')) {
      const data = await response.json();
      
      // Murf AI returns audioFile URL in JSON response
      if (data.audioFile) {
        console.log("Murf AI returned audioFile URL, fetching audio...");
        const audioUrl = data.audioFile;
        
        // Fetch the audio file from the URL
        const audioResponse = await fetch(audioUrl);
        if (audioResponse.ok) {
          const arrayBuffer = await audioResponse.arrayBuffer();
          if (arrayBuffer.byteLength > 0) {
            console.log(`✓ Audio fetched successfully (${arrayBuffer.byteLength} bytes)`);
            return Buffer.from(arrayBuffer);
          } else {
            throw new Error("Audio file from URL is empty");
          }
        } else {
          throw new Error(`Failed to fetch audio from URL: ${audioResponse.status} ${audioResponse.statusText}`);
        }
      } else if (data.audioUrl) {
        // Alternative field name
        const audioResponse = await fetch(data.audioUrl);
        if (audioResponse.ok) {
          const arrayBuffer = await audioResponse.arrayBuffer();
          if (arrayBuffer.byteLength > 0) {
            return Buffer.from(arrayBuffer);
          }
        }
      } else if (data.audioContent || data.audio) {
        // If Murf returns base64 audio
        const audioData = data.audioContent || data.audio;
        return Buffer.from(audioData, 'base64');
      } else {
        const errorText = JSON.stringify(data);
        throw new Error(`Murf AI response missing audioFile URL. Response: ${errorText.substring(0, 300)}`);
      }
    }
    
    // If response is direct audio (unlikely with Murf AI, but handle it)
    if (contentType.includes('audio') || contentType.includes('mp3')) {
      const arrayBuffer = await response.arrayBuffer();
      
      if (arrayBuffer.byteLength === 0) {
        throw new Error("Received empty audio response from Murf AI");
      }
      
      return Buffer.from(arrayBuffer);
    }
    
    // If we get here, response format is unexpected
    const responseText = await response.text();
    throw new Error(`Unexpected response format from Murf AI. Content-Type: ${contentType}, Response: ${responseText.substring(0, 300)}`);
  } catch (error: any) {
    console.error("Murf AI voice generation error:", error);
    
    // Provide user-friendly error messages
    if (error.message.includes("401") || error.message.includes("Unauthorized")) {
      throw new Error(
        "Murf AI authentication failed. Please check your MURF_API_KEY in Railway environment variables. " +
        "Get your API key from https://murf.ai/api"
      );
    }
    
    if (error.message.includes("429") || error.message.includes("quota") || error.message.includes("limit")) {
      throw new Error(
        "Murf AI free tier limit reached (10 minutes/month). " +
        "Please upgrade your Murf AI plan or wait for the next billing cycle. " +
        "Visit https://murf.ai/pricing for more information."
      );
    }
    
    throw new Error(`Failed to generate voice audio: ${error.message || "Unknown error"}`);
  }
}

// Voice generation uses free TTS service (Google Cloud TTS or free alternative)

export async function generateVoiceScript(productName: string): Promise<string> {
  const client = getGeminiClient();
  
  if (!client) {
    return generateMockVoiceScript(productName);
  }

  try {
    const model = client.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 300,
        responseMimeType: "application/json",
      },
    });

    const prompt = `You are a professional voice-over script writer specializing in luxury brand commercials. Your scripts are sophisticated, evocative, and designed to create emotional connections with affluent consumers.

Write a 30-second voice-over script for a CasaVida luxury furniture commercial featuring: ${productName}

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed.script?.trim() || generateMockVoiceScript(productName);
    }
    
    return generateMockVoiceScript(productName);
  } catch (error) {
    console.error("Gemini voice script generation error:", error);
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
  const client = getGeminiClient();
  
  if (!client) {
    return generateMockRecommendations(data);
  }

  try {
    const model = client.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.3, // Lower temperature for more analytical, consistent output
        maxOutputTokens: 1500,
        responseMimeType: "application/json",
      },
    });

    const prompt = `You are a senior marketing strategy consultant with 20+ years of experience analyzing retail businesses in crisis. You specialize in identifying strategic misalignments and providing actionable, data-driven recommendations. Your analysis is always specific, measurable, and prioritized.

Analyze CasaVida, a home & living retailer experiencing a strategic crisis.

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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed as DashboardRecommendations;
    }
    
    return generateMockRecommendations(data);
  } catch (error) {
    console.error("Gemini recommendations error:", error);
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
