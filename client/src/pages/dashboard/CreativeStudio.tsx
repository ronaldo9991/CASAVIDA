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
  const [voiceModel, setVoiceModel] = useState("rachel");
  const [voiceSpeed, setVoiceSpeed] = useState("1.0");
  const [voiceScriptInput, setVoiceScriptInput] = useState("");
  const [generatedAudioUrl, setGeneratedAudioUrl] = useState<string | null>(null);
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

  const handleGenerateAudioPreview = async () => {
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
      setGeneratedAudioUrl(url);
      
      // Auto-play the generated audio
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setIsPlaying(true);
      }
      
      toast({
        title: "Audio Generated",
        description: "Your AI voice is ready. Use the player to preview, then download.",
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

  const handleDownloadAudio = () => {
    if (!generatedAudioUrl) {
      toast({
        title: "No Audio",
        description: "Please generate audio first before downloading.",
        variant: "destructive"
      });
      return;
    }
    
    const link = document.createElement('a');
    link.href = generatedAudioUrl;
    link.download = `casavida_voice_${Date.now()}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Audio Downloaded",
      description: "Your AI voice generation has been downloaded.",
    });
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
          <p className="text-muted-foreground">AI-powered campaign generation using Gemini for text and images (supports all furniture types), with Murf AI for voice.</p>
        </div>
      </div>

      <Alert className="mb-6 border-blue-500/50 bg-blue-500/5">
        <Info className="h-4 w-4 text-blue-500" />
        <AlertDescription className="text-sm">
          <strong>Creative Studio</strong> uses Gemini AI to generate marketing content. Enter any furniture product name (chairs, gaming chairs, sofas, tables, space furniture, outdoor furniture, etc.) and target segment, then generate marketing copy (text), product images (visual), and voice scripts (audio) for campaigns. The AI intelligently adapts to any furniture type and creates multiple variations optimized for different platforms.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaign">Full Campaign</TabsTrigger>
          <TabsTrigger value="voice">AI Voice Studio</TabsTrigger>
        </TabsList>

        <TabsContent value="campaign" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            {/* ZONE 1: Inputs - Redesigned Clean UI */}
            <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
              <Card className="border-2">
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Product Name</Label>
                    <Input 
                      placeholder="e.g. Steel Chair, Gaming Chair, Modern Sofa..." 
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      data-testid="input-product-name"
                      className="h-10"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter any furniture type: chairs, gaming chairs, sofas, tables, space furniture, outdoor furniture, etc.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Target Segment</Label>
                    <Select value={targetSegment} onValueChange={setTargetSegment}>
                      <SelectTrigger data-testid="select-segment" className="h-10">
                        <SelectValue placeholder="Select segment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="luxury">Luxury Minimalist</SelectItem>
                        <SelectItem value="young">Young Professionals</SelectItem>
                        <SelectItem value="family">Modern Families</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Platform</Label>
                    <div className="flex gap-2">
                      {["instagram", "email", "tiktok"].map((p) => (
                        <Button 
                          key={p}
                          variant={platform === p ? "default" : "outline"} 
                          size="default" 
                          className="flex-1 font-medium"
                          onClick={() => setPlatform(p)}
                        >
                          {p === "instagram" ? "Insta" : p === "tiktok" ? "TikTok" : p}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full gap-2 h-12 text-base font-semibold shadow-lg" 
                    onClick={handleGenerateAll} 
                    disabled={isGeneratingText || isGeneratingImage || isGeneratingVoice}
                    data-testid="button-generate-all"
                    size="lg"
                  >
                    {(isGeneratingText || isGeneratingImage || isGeneratingVoice) ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate All
                      </>
                    )}
                  </Button>
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
                    <div className="aspect-square bg-muted rounded-md flex items-center justify-center flex-col gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                      <p className="text-sm text-muted-foreground">Generating image with Gemini AI...</p>
                      <p className="text-xs text-muted-foreground">This may take 10-30 seconds</p>
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
                    <div className="aspect-square bg-muted rounded-md flex items-center justify-center text-muted-foreground flex-col gap-2 opacity-50 border-2 border-dashed">
                      <ImageIcon className="w-8 h-8" />
                      <p className="text-sm text-center px-4">Generated product image will appear here</p>
                      <p className="text-xs text-center px-4">Works with all furniture types: chairs, gaming chairs, sofas, tables, space furniture, and more</p>
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
                AI Voice Generator (Murf AI)
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
                          <SelectItem value="rachel">Rachel (Neutral, Professional)</SelectItem>
                          <SelectItem value="adam">Adam (Deep, Authoritative)</SelectItem>
                          <SelectItem value="antoni">Antoni (Warm, Friendly)</SelectItem>
                          <SelectItem value="arnold">Arnold (Strong, Confident)</SelectItem>
                          <SelectItem value="bella">Bella (Soft, Gentle)</SelectItem>
                          <SelectItem value="domi">Domi (Energetic, Vibrant)</SelectItem>
                          <SelectItem value="elli">Elli (Calm, Soothing)</SelectItem>
                          <SelectItem value="josh">Josh (Casual, Conversational)</SelectItem>
                          <SelectItem value="sam">Sam (Balanced, Versatile)</SelectItem>
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
                      onClick={handleGenerateAudioPreview}
                      disabled={isGeneratingVoice || !voiceScriptInput}
                      data-testid="button-generate-audio"
                    >
                      {isGeneratingVoice ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4"/>}
                      Generate & Play
                    </Button>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-8 flex flex-col items-center justify-center border border-dashed border-border">
                  <div className="w-full max-w-sm space-y-6 text-center">
                    {generatedAudioUrl ? (
                      <>
                        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="w-20 h-20 rounded-full hover:bg-green-500/20"
                            onClick={togglePlayPause}
                          >
                            {isPlaying ? <Pause className="w-10 h-10 text-green-600" /> : <Play className="w-10 h-10 text-green-600" />}
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium text-green-600">Audio Ready!</h3>
                          <p className="text-xs text-muted-foreground">
                            Click play to preview, then download when satisfied
                          </p>
                        </div>
                        <audio 
                          ref={audioRef} 
                          onEnded={() => setIsPlaying(false)}
                          className="hidden"
                        />
                        <Button 
                          className="gap-2" 
                          onClick={handleDownloadAudio}
                          data-testid="button-download-audio"
                        >
                          <Download className="w-4 h-4"/>
                          Download MP3
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                          <Music className="w-10 h-10 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">AI Voice Generation</h3>
                          <p className="text-xs text-muted-foreground">
                            {voiceScriptInput ? "Click 'Generate & Play' to create audio" : "Enter a script to get started"}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Uses OpenAI TTS-1-HD for high-quality voice synthesis
                        </p>
                      </>
                    )}
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
