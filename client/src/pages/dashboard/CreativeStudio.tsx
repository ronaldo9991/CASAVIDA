import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Image as ImageIcon, Mic, Share2, Download, Copy, Loader2, Play, Pause, Music, Wand2, FileText, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";

export default function CreativeStudio() {
  const { toast } = useToast();
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [copyVariations, setCopyVariations] = useState<string[]>([]);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [voiceScript, setVoiceScript] = useState("");
  const [productName, setProductName] = useState("");
  const [targetSegment, setTargetSegment] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("");
  const [visualStyle, setVisualStyle] = useState("");
  const [keyBenefit, setKeyBenefit] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTab, setActiveTab] = useState("campaign");
  const [voiceModel, setVoiceModel] = useState("alloy");
  const [voiceSpeed, setVoiceSpeed] = useState("1.0");
  const [voiceScriptInput, setVoiceScriptInput] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleGenerateText = async () => {
    if (!productName) {
      toast({
        title: "Missing Information",
        description: "Please enter a product name to generate marketing copy.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingText(true);
    try {
      const response = await apiRequest("POST", "/api/creative/text", {
        productName,
        targetSegment: targetSegment || undefined,
        platform: platform || undefined,
        tone: tone || undefined,
        keyBenefit: keyBenefit || undefined,
      });
      const data = await response.json();
      setCopyVariations(data.copyVariations || []);
      toast({
        title: "Copy Generated",
        description: "AI has created marketing copy variations for your product.",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate marketing copy.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingText(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!productName) {
      toast({
        title: "Missing Information",
        description: "Please enter a product name to generate an image.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingImage(true);
    try {
      const response = await apiRequest("POST", "/api/creative/image", {
        productName,
        visualStyle: visualStyle || undefined,
        additionalContext: keyBenefit || undefined,
      });
      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);
      toast({
        title: "Image Generated",
        description: "AI has created a product image for your campaign.",
      });
    } catch (error: any) {
      toast({
        title: "Image Generation Failed",
        description: error.message || "Failed to generate image.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleGenerateVoiceScript = async () => {
    if (!productName) {
      toast({
        title: "Missing Information",
        description: "Please enter a product name to generate a voice script.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingVoice(true);
    try {
      const response = await apiRequest("POST", "/api/creative/voice-script", {
        productName,
      });
      const data = await response.json();
      setVoiceScript(data.script);
      setVoiceScriptInput(data.script);
      toast({
        title: "Voice Script Generated",
        description: "AI has created a voice-over script for your product.",
      });
    } catch (error: any) {
      toast({
        title: "Script Generation Failed",
        description: error.message || "Failed to generate voice script.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const handleDownloadAudio = async () => {
    const scriptToUse = voiceScriptInput || voiceScript;
    if (!scriptToUse) {
      toast({
        title: "No Script",
        description: "Please generate or enter a voice script first.",
        variant: "destructive"
      });
      return;
    }

    setIsGeneratingVoice(true);
    try {
      const response = await fetch("/api/creative/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          script: scriptToUse,
          voice: voiceModel,
          speed: parseFloat(voiceSpeed),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Voice generation failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `casavida_voice_${Date.now()}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Audio Downloaded",
        description: "Your AI voice generation has been downloaded.",
      });
    } catch (error: any) {
      toast({
        title: "Voice Generation Failed",
        description: error.message || "Failed to generate voice audio.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingVoice(false);
    }
  };

  const handleGenerateAll = async () => {
    await Promise.all([
      handleGenerateText(),
      handleGenerateImage(),
      handleGenerateVoiceScript(),
    ]);
  };

  const hasContent = copyVariations.length > 0 || generatedImageUrl || voiceScript;

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Creative Studio 
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full uppercase tracking-wider font-bold">Live</span>
          </h2>
          <p className="text-muted-foreground">AI-powered campaign generation using GPT-5, DALL-E 3, and TTS-1-HD.</p>
        </div>
      </div>

      <Alert className="mb-6 border-blue-500/50 bg-blue-500/5">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm">
          <strong>Creative Studio</strong> uses AI to generate marketing content. Enter a product name and target segment, then generate marketing copy (text), product images (visual), and voice scripts (audio) for campaigns. The AI creates multiple variations optimized for different platforms like Instagram, Email, or Website banners.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaign">Full Campaign</TabsTrigger>
          <TabsTrigger value="voice">AI Voice Studio</TabsTrigger>
        </TabsList>

        <TabsContent value="campaign" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            {/* ZONE 1: Inputs */}
            <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Campaign Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input 
                      placeholder="e.g. Kyoto Lounge Chair" 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      data-testid="input-product-name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Target Segment</Label>
                    <Select value={targetSegment} onValueChange={setTargetSegment}>
                      <SelectTrigger data-testid="select-segment"><SelectValue placeholder="Select segment" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="luxury">Luxury Minimalists</SelectItem>
                        <SelectItem value="young">Young Professionals</SelectItem>
                        <SelectItem value="family">Modern Families</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Platform</Label>
                    <div className="flex gap-2">
                      {["instagram", "email", "tiktok"].map((p) => (
                        <Button 
                          key={p}
                          variant={platform === p ? "default" : "outline"} 
                          size="sm" 
                          className="flex-1 text-xs capitalize"
                          onClick={() => setPlatform(p)}
                        >
                          {p === "instagram" ? "Insta" : p}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <Button 
                    className="w-full gap-2 mt-4" 
                    onClick={handleGenerateAll} 
                    disabled={isGeneratingText || isGeneratingImage || isGeneratingVoice}
                    data-testid="button-generate-all"
                  >
                    {(isGeneratingText || isGeneratingImage || isGeneratingVoice) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {(isGeneratingText || isGeneratingImage || isGeneratingVoice) ? "Generating..." : "Generate All"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Creative Direction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tone</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger><SelectValue placeholder="Select tone" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="premium">Premium & Elegant</SelectItem>
                        <SelectItem value="warm">Warm & Friendly</SelectItem>
                        <SelectItem value="genz">Bold & GenZ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Visual Style</Label>
                    <Select value={visualStyle} onValueChange={setVisualStyle}>
                      <SelectTrigger><SelectValue placeholder="Select style" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scandi">Scandinavian Minimal</SelectItem>
                        <SelectItem value="dark">Dark Luxury</SelectItem>
                        <SelectItem value="natural">Natural Light</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Key Benefit</Label>
                    <Textarea 
                      placeholder="e.g. Handcrafted comfort..." 
                      className="h-24 resize-none"
                      value={keyBenefit}
                      onChange={(e) => setKeyBenefit(e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ZONE 2: Text Output */}
            <div className="lg:col-span-5 space-y-6 overflow-y-auto">
              <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <CardTitle>AI Copy Variations</CardTitle>
                  </div>
                  {copyVariations.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => {
                        navigator.clipboard.writeText(copyVariations.join("\n\n---\n\n"));
                        toast({ title: "Copied to clipboard" });
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  {isGeneratingText ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : copyVariations.length > 0 ? (
                    <>
                      {copyVariations.map((copy, index) => (
                        <div key={index} className="p-4 bg-muted/30 rounded-lg border border-border/50 animate-in fade-in slide-in-from-bottom-2">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              Option {String.fromCharCode(65 + index)}
                            </span>
                            {index === 0 && (
                              <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">AI Generated</span>
                            )}
                          </div>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{copy}</p>
                        </div>
                      ))}

                      {voiceScript && (
                        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-bottom-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">AI Voice Script (30s)</span>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={handleDownloadAudio}
                              disabled={isGeneratingVoice}
                            >
                              {isGeneratingVoice ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                            </Button>
                          </div>
                          <p className="text-xs italic text-muted-foreground">{voiceScript}</p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-2 opacity-50">
                      <Sparkles className="w-8 h-8" />
                      <p className="text-sm">Enter details and click Generate to create copy.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ZONE 3: Image Output */}
            <div className="lg:col-span-4 space-y-6 overflow-y-auto">
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    <CardTitle>Visual Asset</CardTitle>
                  </div>
                  {generatedImageUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-1"
                      onClick={() => window.open(generatedImageUrl, '_blank')}
                    >
                      <Download className="w-3 h-3"/> Download
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {isGeneratingImage ? (
                    <div className="aspect-square bg-muted rounded-md flex items-center justify-center">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : generatedImageUrl ? (
                    <div className="aspect-square bg-muted rounded-md relative group overflow-hidden animate-in zoom-in-95 duration-500">
                      <img src={generatedImageUrl} alt="Generated Product" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="icon" variant="secondary" onClick={() => window.open(generatedImageUrl, '_blank')}>
                          <Download className="w-4 h-4"/>
                        </Button>
                        <Button size="icon" variant="secondary">
                          <Share2 className="w-4 h-4"/>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground flex-col gap-2 opacity-50">
                      <ImageIcon className="w-8 h-8" />
                      <p className="text-sm">Image will appear here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="voice">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-primary"/>
                AI Voice Generator (TTS-1-HD)
              </CardTitle>
              <CardDescription>Convert marketing copy into human-like audio for ads and social media.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Script Text</Label>
                    <Textarea 
                      className="h-40 font-mono text-sm" 
                      placeholder="Enter text to speak or generate a script..." 
                      value={voiceScriptInput}
                      onChange={(e) => setVoiceScriptInput(e.target.value)}
                      data-testid="textarea-voice-script"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Voice Model</Label>
                      <Select value={voiceModel} onValueChange={setVoiceModel}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                          <SelectItem value="echo">Echo (Warm)</SelectItem>
                          <SelectItem value="fable">Fable (British)</SelectItem>
                          <SelectItem value="onyx">Onyx (Deep)</SelectItem>
                          <SelectItem value="nova">Nova (Feminine)</SelectItem>
                          <SelectItem value="shimmer">Shimmer (Clear)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Speed</Label>
                      <Select value={voiceSpeed} onValueChange={setVoiceSpeed}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.75">0.75x (Slow)</SelectItem>
                          <SelectItem value="1.0">1.0x (Normal)</SelectItem>
                          <SelectItem value="1.25">1.25x (Fast)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1 gap-2" 
                      onClick={handleGenerateVoiceScript}
                      disabled={isGeneratingVoice || !productName}
                    >
                      {isGeneratingVoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4"/>}
                      Generate Script
                    </Button>
                    <Button 
                      className="flex-1 gap-2" 
                      onClick={handleDownloadAudio}
                      disabled={isGeneratingVoice || !voiceScriptInput}
                      data-testid="button-generate-audio"
                    >
                      {isGeneratingVoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4"/>}
                      Download MP3
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-8 flex flex-col items-center justify-center border border-dashed border-border">
                  <div className="w-full max-w-sm space-y-6 text-center">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                      <Music className="w-10 h-10 text-primary" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">AI Voice Generation</h3>
                      <p className="text-xs text-muted-foreground">
                        {voiceScriptInput ? "Ready to generate audio" : "Enter a script to get started"}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Uses OpenAI TTS-1-HD for high-quality voice synthesis
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
