import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Image as ImageIcon, Mic, Share2, Download, Copy, Settings, Loader2, Play, Pause } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

// Pre-generated assets imports
import chairImg from "@assets/generated_images/modern_minimalist_chair_marketing_shot.png";
import perfumeImg from "@assets/generated_images/luxury_perfume_bottle_marketing_shot.png";
import vaseImg from "@assets/generated_images/sustainable_ceramic_vase_marketing_shot.png";
import smartImg from "@assets/generated_images/smart_home_device_marketing_shot.png";

export default function CreativeStudio() {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [productName, setProductName] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  // Mock Generation Logic
  const handleGenerate = () => {
    if (!productName) {
        toast({
            title: "Missing Information",
            description: "Please enter a product name to generate a campaign.",
            variant: "destructive"
        });
        return;
    }

    setIsGenerating(true);
    
    // Simulate AI processing time
    setTimeout(() => {
        setIsGenerating(false);
        setGeneratedContent({
            text: true,
            images: [chairImg, perfumeImg, vaseImg, smartImg], // In a real app, these would be specific to the prompt
            voice: true
        });
        toast({
            title: "Campaign Generated",
            description: "AI has successfully created your multi-modal assets.",
        });
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            Creative Studio 
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full uppercase tracking-wider font-bold">Beta</span>
          </h2>
          <p className="text-muted-foreground">AI-powered multi-modal campaign generation (Text, Image, Voice).</p>
        </div>
        <div className="flex items-center gap-2">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Settings className="w-4 h-4" />
                        AI Settings
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>AI Model Configuration</DialogTitle>
                        <DialogDescription>
                            Configure your OpenAI API key to enable real-time generation.
                            Without a key, the studio runs in simulation mode.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>OpenAI API Key</Label>
                            <Input 
                                type="password" 
                                placeholder="sk-..." 
                                value={apiKey} 
                                onChange={(e) => setApiKey(e.target.value)} 
                            />
                            <p className="text-xs text-muted-foreground">
                                Your key is stored locally in your browser session for security.
                            </p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Switch id="dalle3" defaultChecked />
                            <Label htmlFor="dalle3">Enable DALL·E 3 (High Res)</Label>
                        </div>
                         <div className="flex items-center space-x-2">
                            <Switch id="tts" defaultChecked />
                            <Label htmlFor="tts">Enable TTS-1-HD (Voice)</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={() => toast({ title: "Settings Saved" })}>Save Configuration</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Button className="gap-2" onClick={handleGenerate} disabled={isGenerating}>
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? "Generating..." : "Generate Full Campaign"}
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)] min-h-[600px]">
        
        {/* ZONE 1: Inputs */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
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
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Target Segment</Label>
                        <Select>
                            <SelectTrigger><SelectValue placeholder="Select segment" /></SelectTrigger>
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
                            <Button variant="outline" size="sm" className="flex-1 text-xs">Insta</Button>
                            <Button variant="outline" size="sm" className="flex-1 text-xs">Email</Button>
                            <Button variant="outline" size="sm" className="flex-1 text-xs">TikTok</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Creative Direction</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label>Tone</Label>
                        <Select>
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
                        <Select>
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
                        <Textarea placeholder="e.g. Handcrafted comfort..." className="h-24 resize-none" />
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* ZONE 2: Text & Voice Output */}
        <div className="lg:col-span-5 space-y-6 overflow-y-auto custom-scrollbar">
             <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                        <FileTextIcon className="w-5 h-5 text-primary" />
                        <CardTitle>AI Copy & Voice</CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="w-4 h-4" /></Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                    {generatedContent ? (
                        <>
                            <div className="p-4 bg-muted/30 rounded-lg border border-border/50 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Option A: Storytelling</span>
                                    <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">High Conversion</span>
                                </div>
                                <p className="text-sm leading-relaxed">
                                    "True luxury isn't about excess. It's about the absence of noise. <br/><br/>
                                    Meet the {productName || "Kyoto Lounge Chair"} — where Japanese minimalism meets everyday comfort. Hand-carved from sustainable oak, it’s not just a chair, it’s your new sanctuary. <br/><br/>
                                    Make space for what matters. #CasaVida #MinimalLiving"
                                </p>
                            </div>

                            <div className="p-4 bg-muted/30 rounded-lg border border-border/50 animate-in fade-in slide-in-from-bottom-3 delay-100">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Option B: Benefit Focused</span>
                                </div>
                                <p className="text-sm leading-relaxed">
                                    Upgrade your downtime. The {productName || "Kyoto Lounge Chair"} features ergonomic support wrapped in premium linen. Designed for reading, resting, and recharging. <br/><br/>
                                    Available now in our Dubai showroom. Link in bio.
                                </p>
                            </div>

                            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-bottom-4 delay-200">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-primary">AI Voice Script (30s)</span>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                                        onClick={() => setIsPlaying(!isPlaying)}
                                    >
                                        {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 ml-0.5" />}
                                    </Button>
                                </div>
                                <div className="h-8 bg-background rounded-md mb-3 flex items-center px-2 gap-1 overflow-hidden">
                                     {/* Fake waveform */}
                                     {Array.from({length: 30}).map((_, i) => (
                                         <div key={i} className={`w-1 rounded-full bg-primary/40 ${isPlaying ? 'animate-pulse' : ''}`} style={{height: `${Math.random() * 100}%`}}></div>
                                     ))}
                                </div>
                                <p className="text-xs italic text-muted-foreground">
                                    (Soft, warm ambient music) <br/>
                                    Narrator: "Close your eyes. Imagine a space that feels like a deep breath. The {productName || "Kyoto Collection"} is here to bring calm back to your home..."
                                </p>
                                <div className="mt-2 flex justify-end">
                                     <Button variant="link" size="sm" className="h-auto p-0 text-xs gap-1"><Download className="w-3 h-3"/> Download MP3</Button>
                                </div>
                            </div>
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
        <div className="lg:col-span-4 space-y-6 overflow-y-auto custom-scrollbar">
             <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <CardTitle>Visual Assets</CardTitle>
                    </div>
                    {generatedContent && <Button variant="outline" size="sm" className="h-8 gap-1"><Download className="w-3 h-3"/> All</Button>}
                </CardHeader>
                <CardContent className="space-y-4">
                    {generatedContent ? (
                        <>
                            <div className="aspect-square bg-muted rounded-md relative group overflow-hidden animate-in zoom-in-95 duration-500">
                                <img src={generatedContent.images[0]} alt="Generated 1" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="secondary"><Download className="w-4 h-4"/></Button>
                                    <Button size="icon" variant="secondary"><Share2 className="w-4 h-4"/></Button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                {generatedContent.images.slice(1, 3).map((img: string, i: number) => (
                                    <div key={i} className="aspect-square bg-muted rounded-md relative group overflow-hidden animate-in zoom-in-95 duration-500 delay-100">
                                        <img src={img} alt={`Generated ${i+2}`} className="w-full h-full object-cover" />
                                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <Button size="icon" variant="secondary" className="h-6 w-6"><Download className="w-3 h-3"/></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground flex-col gap-2 opacity-50 min-h-[300px]">
                            <ImageIcon className="w-8 h-8" />
                            <p className="text-sm">Visuals will appear here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

function FileTextIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}
