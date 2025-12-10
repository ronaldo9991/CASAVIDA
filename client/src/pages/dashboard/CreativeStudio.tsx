import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Image as ImageIcon, Mic, Share2, Download, Copy } from "lucide-react";

export default function CreativeStudio() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Creative Studio</h2>
          <p className="text-muted-foreground">AI-powered multi-modal campaign generation.</p>
        </div>
        <Button className="gap-2">
            <Sparkles className="w-4 h-4" />
            Generate Full Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-12rem)]">
        
        {/* ZONE 1: Inputs */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm">Campaign Context</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input placeholder="e.g. Kyoto Lounge Chair" />
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
                        <Textarea placeholder="e.g. Handcrafted comfort..." className="h-20" />
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* ZONE 2: Text Output */}
        <div className="lg:col-span-5 space-y-6 overflow-y-auto">
             <Card className="h-full flex flex-col">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                        <FileTextIcon className="w-5 h-5 text-primary" />
                        <CardTitle>Copy Variations</CardTitle>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="w-4 h-4" /></Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Option A: Storytelling</span>
                            <span className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">High Conversion</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            "True luxury isn't about excess. It's about the absence of noise. <br/><br/>
                            Meet the Kyoto Lounge Chair — where Japanese minimalism meets everyday comfort. Hand-carved from sustainable oak, it’s not just a chair, it’s your new sanctuary. <br/><br/>
                            Make space for what matters. #CasaVida #MinimalLiving"
                        </p>
                    </div>

                    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Option B: Benefit Focused</span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Upgrade your downtime. The Kyoto Lounge Chair features ergonomic support wrapped in premium linen. Designed for reading, resting, and recharging. <br/><br/>
                            Available now in our Dubai showroom. Link in bio.
                        </p>
                    </div>

                     <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Voice Script (30s)</span>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><Mic className="w-3 h-3" /></Button>
                        </div>
                        <p className="text-sm italic text-muted-foreground">
                            (Soft, warm ambient music) <br/>
                            Narrator: "Close your eyes. Imagine a space that feels like a deep breath. The Kyoto Collection is here to bring calm back to your home..."
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* ZONE 3: Image Output */}
        <div className="lg:col-span-4 space-y-6 overflow-y-auto">
             <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div className="flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <CardTitle>Visual Assets</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" className="h-8 gap-1"><Download className="w-3 h-3"/> All</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="aspect-square bg-muted rounded-md relative group overflow-hidden">
                        <div className="absolute inset-0 bg-stone-200 flex items-center justify-center">
                            <span className="text-muted-foreground text-xs">Generated Image 1</span>
                        </div>
                        {/* Placeholder for generated image */}
                         <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button size="icon" variant="secondary"><Download className="w-4 h-4"/></Button>
                            <Button size="icon" variant="secondary"><Share2 className="w-4 h-4"/></Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="aspect-square bg-muted rounded-md relative group overflow-hidden">
                             <div className="absolute inset-0 bg-stone-200 flex items-center justify-center">
                                <span className="text-muted-foreground text-xs">Variation 2</span>
                            </div>
                        </div>
                         <div className="aspect-square bg-muted rounded-md relative group overflow-hidden">
                             <div className="absolute inset-0 bg-stone-200 flex items-center justify-center">
                                <span className="text-muted-foreground text-xs">Variation 3</span>
                            </div>
                        </div>
                    </div>
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
