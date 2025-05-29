
"use client";

import React, { useState, type ChangeEvent, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBusiness } from "@/contexts/BusinessContext";
import { Mail, Building, Info, UploadCloud, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { uploadProfileImage, auth } from '@/lib/firebase'; // Using real function
import { updateProfile } from "firebase/auth"; 

const getInitials = (name?: string | null) => {
  if (!name) return "U";
  const names = name.split(" ");
  const initials = names.map((n) => n[0]).join("");
  return initials.toUpperCase() || "U";
};

// Keys for localStorage for portfolio items (as a fallback for this page)
const PORTFOLIO_DESC_KEY = 'malitrack-portfolio-description';
const PORTFOLIO_BANNER_KEY = 'malitrack-portfolio-banner-url';
const PORTFOLIO_LOGO_KEY = 'malitrack-portfolio-logo-url';


export default function ProfilePage() {
  const { businessName } = useBusiness();
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(currentUser?.photoURL || null);
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for portfolio (will load from localStorage if available)
  const [mockBusinessDescription, setMockBusinessDescription] = useState("This is a placeholder description for your business. Update it on the 'Your Portfolio' page.");
  const [mockBannerImageUrl, setMockBannerImageUrl] = useState<string | null>("https://placehold.co/800x200.png");
  const [mockProfileImageUrl, setMockProfileImageUrl] = useState<string | null>("https://placehold.co/200x200.png");


  useEffect(() => {
    if (currentUser?.photoURL) {
      setProfileImagePreview(currentUser.photoURL);
    }
    // Load portfolio data from localStorage for display on this page
    const storedDesc = localStorage.getItem(PORTFOLIO_DESC_KEY);
    if (storedDesc) setMockBusinessDescription(storedDesc);
    const storedBanner = localStorage.getItem(PORTFOLIO_BANNER_KEY);
    if (storedBanner) setMockBannerImageUrl(storedBanner);
    const storedLogo = localStorage.getItem(PORTFOLIO_LOGO_KEY);
    if (storedLogo) setMockProfileImageUrl(storedLogo);

  }, [currentUser]);


  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setProfileImageFile(null);
      setProfileImagePreview(currentUser?.photoURL || null); // Revert to current or null
    }
  };

  const handleProfileImageUpload = async () => {
    if (!profileImageFile || !currentUser) {
      toast({ title: "No image selected or not logged in.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    try {
      // The uploadProfileImage function already updates Firebase Auth user's photoURL
      const downloadURL = await uploadProfileImage(currentUser.uid, profileImageFile);
      
      // We also need to ensure the local state for preview reflects the new URL
      // and that AuthContext's currentUser might get updated if other components rely on it.
      // For now, setting local preview and showing toast.
      setProfileImagePreview(downloadURL);
      
      toast({ title: "Profile Image Uploaded", description: "Your new profile image is set." });
      // To reflect the change immediately in UserNav, AuthContext might need a way to refresh currentUser.
      // Or, we can update the photoURL on the currentUser object if the context allows it (it currently doesn't expose a setter).
      // For simplicity, user might need to refresh or re-login for UserNav to pick up the change directly from a fresh auth state.
      // However, the new image will be used on next load due to onAuthStateChanged.
      if (auth.currentUser) {
         // Manually update the current user object in the auth instance
         // This might not immediately propagate to all useAuth() consumers
         // unless AuthContext re-fetches or updates its internal state.
         // The most reliable way is that onAuthStateChanged will pick this up on next reload.
      }

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error("Profile image upload error:", error);
      }
      toast({ title: "Upload Failed", description: "Could not upload profile image. Check console for details.", variant: "destructive" });
      setProfileImagePreview(currentUser?.photoURL || null); // Revert preview on error
    } finally {
      setIsUploading(false);
      setProfileImageFile(null); // Clear the selected file
    }
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@malitrack.com?subject=Support Request";
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (!currentUser) {
    return <div className="text-center py-10">Please sign in to view your profile.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={profileImagePreview || "https://placehold.co/128x128.png"} alt={currentUser.displayName || currentUser.email || "User"} data-ai-hint="user avatar large" />
              <AvatarFallback>{getInitials(currentUser.displayName || currentUser.email)}</AvatarFallback>
            </Avatar>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="profile-picture" className="text-sm">Change Profile Picture</Label>
              <div className="flex items-center gap-2">
                <Input id="profile-picture" type="file" accept="image/*" onChange={handleProfileImageChange} className="text-xs"/>
              </div>
               {profileImageFile && ( 
                <Button onClick={handleProfileImageUpload} size="sm" className="mt-2 w-full" disabled={isUploading}>
                  {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <UploadCloud className="mr-2 h-4 w-4" />}
                   {isUploading ? "Uploading..." : "Upload New Picture"}
                </Button>
              )}
            </div>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-semibold">{currentUser.displayName || "User"}</h2>
            <p className="text-muted-foreground">{currentUser.email}</p>
            {/* Add a button to edit profile details if needed, e.g., display name */}
            {/* <Button variant="outline" size="sm" onClick={() => toast({ title: "Edit Profile", description: "Profile editing is simulated." })}>
              Edit Profile (Simulated)
            </Button> */}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center"><Building className="mr-2 h-5 w-5 text-primary" />Business Portfolio Summary</CardTitle>
          <CardDescription>Overview of your primary business. Edit details on the "Your Portfolio" page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{businessName || "Your Business Name"}</h3>
            <p className="text-sm text-muted-foreground mt-1">{mockBusinessDescription}</p>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-1">Banner Image (from Portfolio):</p>
              <Image
                src={mockBannerImageUrl || "https://placehold.co/800x200.png"}
                alt="Business Banner"
                width={600}
                height={150}
                className="rounded-md object-cover aspect-[4/1]"
                data-ai-hint="business banner preview"
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Profile/Logo Image (from Portfolio):</p>
              <Image
                src={mockProfileImageUrl || "https://placehold.co/200x200.png"}
                alt="Business Profile/Logo"
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
