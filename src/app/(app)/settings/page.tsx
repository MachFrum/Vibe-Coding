
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Palette, Gift, Users, ExternalLink, type LucideIcon, ShieldCheck, Sparkles } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { useTheme, type ColorValues } from '@/contexts/ThemeContext';
import { hexToHsl, hslStringToHex } from '@/lib/colorUtils';

interface ColorPickerProps {
  label: string;
  colorVarName: keyof ColorValues;
  Icon: LucideIcon;
}

const ColorPickerInput: React.FC<ColorPickerProps> = ({ label, colorVarName, Icon }) => {
  const { updateCustomColor, getEffectiveColor } = useTheme();
  const [colorValue, setColorValue] = useState(() => hslStringToHex(getEffectiveColor(colorVarName)));

  // Update picker if theme changes externally (e.g. theme switcher button)
  useEffect(() => {
    setColorValue(hslStringToHex(getEffectiveColor(colorVarName)));
  }, [getEffectiveColor, colorVarName]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newHexColor = event.target.value;
    setColorValue(newHexColor);
    const newHslColor = hexToHsl(newHexColor);
    if (newHslColor) {
      updateCustomColor(colorVarName, newHslColor);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={colorVarName} className="flex items-center text-sm font-medium">
        <Icon className="mr-2 h-4 w-4 text-muted-foreground" />
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          type="color"
          id={colorVarName}
          value={colorValue}
          onChange={handleColorChange}
          className="h-10 w-14 p-1 rounded-md border"
        />
        <Input
          type="text"
          value={colorValue.toUpperCase()}
          onChange={(e) => {
             const newHex = e.target.value;
             setColorValue(newHex);
             if (/^#[0-9A-F]{6}$/i.test(newHex)) {
                const newHsl = hexToHsl(newHex);
                if (newHsl) updateCustomColor(colorVarName, newHsl);
             }
          }}
          className="h-10 flex-1 rounded-md border px-3 text-sm tabular-nums"
        />
      </div>
    </div>
  );
};


export default function SettingsPage() {
  const { toast } = useToast();

  // Mock state for settings
  const [currentPlan, setCurrentPlan] = useState("MaliTrack Pro");
  const [autoRenew, setAutoRenew] = useState(true);

  const handlePaymentUpdate = () => {
    toast({ title: "Payment Settings", description: "Redirecting to update payment methods (simulated)." });
  };

  const handleCancelSubscription = () => {
    toast({ 
      title: "Subscription Cancellation", 
      description: "Your request to cancel has been received (simulated).",
      variant: "destructive" 
    });
    setCurrentPlan("Free Tier (Cancelled)");
  };

  const handleApplyPromo = () => {
    toast({ title: "Promo Code Applied", description: "Discount ABCXYZ has been applied (simulated)!" });
  };

  const handleInvite = () => {
    toast({ title: "Invite Sent", description: "Your invitation has been sent (simulated)." });
  };
  
  const handleGenerateAffiliateLink = () => {
    toast({ title: "Affiliate Link Generated", description: "Your link: https://malitrack.com/join?ref=USER123 (simulated)." });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      {/* Website Customization Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><Palette className="mr-2 h-6 w-6 text-primary" /> Website Customization</CardTitle>
          <CardDescription>
            Override colors for the currently selected theme. Changes are saved locally and applied in real-time.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ColorPickerInput label="Page Background" colorVarName="--background" Icon={Palette} />
          <ColorPickerInput label="Main Text" colorVarName="--foreground" Icon={Palette} />
          <ColorPickerInput label="Buttons & Primary Elements" colorVarName="--primary" Icon={Palette} />
          <ColorPickerInput label="UI Accents (Secondary)" colorVarName="--secondary" Icon={Palette} />
          <ColorPickerInput label="Highlights & Active Elements" colorVarName="--accent" Icon={Palette} />
        </CardContent>
      </Card>

      {/* Payment Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><CreditCard className="mr-2 h-6 w-6 text-primary" /> Payment Information</CardTitle>
          <CardDescription>Manage your payment methods and billing details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="current-card">Current Payment Method</Label>
            <Input id="current-card" readOnly value="Visa ending in **** 1234 (Simulated)" className="mt-1 bg-muted/50" />
          </div>
          <Button onClick={handlePaymentUpdate}>
            Update Payment Method <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Subscription Management Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><ShieldCheck className="mr-2 h-6 w-6 text-primary" /> Subscription Management</CardTitle>
          <CardDescription>Oversee your MaliTrack subscription plan.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Current Plan:</p>
            <p className="text-lg font-semibold text-primary">{currentPlan}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="auto-renew" checked={autoRenew} onCheckedChange={setAutoRenew} aria-label="Toggle auto-renewal"/>
            <Label htmlFor="auto-renew">Auto-renew subscription</Label>
          </div>
          <Separator />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline">Upgrade Plan (Simulated)</Button>
            {currentPlan !== "Free Tier (Cancelled)" && (
              <Button variant="destructive" onClick={handleCancelSubscription}>
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Marketing Tools Section */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><Sparkles className="mr-2 h-6 w-6 text-primary" /> Marketing & Growth Tools</CardTitle>
          <CardDescription>Expand your reach and reward your network.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="promo-code">Enter Promo Code</Label>
            <div className="flex gap-2">
              <Input id="promo-code" placeholder="E.g., SAVE20" />
              <Button onClick={handleApplyPromo}><Gift className="mr-2 h-4 w-4" /> Apply</Button>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <Label>Invite People</Label>
            <p className="text-sm text-muted-foreground">Share MaliTrack and earn rewards.</p>
            <Button variant="outline" onClick={handleInvite}><Users className="mr-2 h-4 w-4" /> Send Invites</Button>
          </div>
          <Separator />
           <div className="space-y-2">
            <Label>Your Affiliate Link</Label>
             <Input readOnly value="https://malitrack.com/join?ref=USER123 (Simulated)" className="bg-muted/50" />
            <Button variant="secondary" onClick={handleGenerateAffiliateLink}>Generate New Link</Button>
            <p className="text-xs text-muted-foreground">Track rewards: $0.00 earned (Simulated)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
