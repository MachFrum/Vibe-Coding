
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBusiness } from "@/contexts/BusinessContext";
import { Mail, Building, Info } from "lucide-react";
import Image from "next/image";

// Mock user data (consistent with UserNav)
const user = {
  name: "Business Owner",
  email: "owner@malitrack.com",
  avatarUrl: "https://placehold.co/100x100.png",
};

const getInitials = (name: string) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return initials.toUpperCase();
};

export default function ProfilePage() {
  const { businessName } = useBusiness(); 
  // In a real app, portfolio description & images would come from a data store or context
  const mockBusinessDescription = "This is a placeholder description for the business. Update it in 'Your Portfolio' page.";
  const mockBannerImageUrl = "https://placehold.co/800x200.png";
  const mockProfileImageUrl = "https://placehold.co/200x200.png";


  const handleContactSupport = () => {
    window.location.href = "mailto:support@malitrack.com?subject=Support Request";
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="user avatar large" />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-semibold">{user.name}</h2>
            <p className="text-muted-foreground">{user.email}</p>
            <Button variant="outline" size="sm">Edit Profile (Simulated)</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><Building className="mr-2 h-5 w-5 text-primary" />Business Portfolio Summary</CardTitle>
          <CardDescription>Overview of your primary business linked to MaliTrack.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{businessName || "Your Business"}</h3>
            <p className="text-sm text-muted-foreground mt-1">{mockBusinessDescription}</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Banner Image (from Portfolio):</p>
              <Image 
                src={mockBannerImageUrl} 
                alt="Business Banner Placeholder" 
                width={600} 
                height={150} 
                className="rounded-md object-cover aspect-[4/1]" 
                data-ai-hint="business banner preview"
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Profile/Logo Image (from Portfolio):</p>
              <Image 
                src={mockProfileImageUrl} 
                alt="Business Profile Placeholder" 
                width={150} 
                height={150} 
                className="rounded-md object-cover aspect-square"
                data-ai-hint="business logo preview"
              />
            </div>
          </div>
           <p className="text-xs text-muted-foreground flex items-center mt-3">
            <Info className="h-3 w-3 mr-1.5" />
            To update these details, please visit the &quot;Your Portfolio&quot; page.
          </p>
        </CardContent>
      </Card>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Support</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={handleContactSupport}>
            <Mail className="mr-2 h-5 w-5" /> Contact MaliTrack Support
          </Button>
        </CardContent>
      </Card>

    </div>
  );
}
