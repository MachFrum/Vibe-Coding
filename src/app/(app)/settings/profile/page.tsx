
"use client";

import React, { useState, type ChangeEvent } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBusiness } from "@/contexts/BusinessContext";
import { Mail, Building, Info, UploadCloud, Loader2 } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { mockUploadProfileImage } from '@/lib/firebase'; // Using mock function

const getInitials = (name?: string | null) => {
  if (!name) return "U"; // User
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return initials.toUpperCase();
};

export default function ProfilePage() {
  const { businessName } = useBusiness(); 
  const { currentUser, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // In a real app, portfolio description & images would come from a data store or context
  const mockBusinessDescription = "This is a placeholder description for the business. Update it in 'Your Portfolio' page.";
  const mockBannerImageUrl = "https://placehold.co/800x200.png";
  const mockProfileImageUrl = "https://placehold.co/200x200.png"; // Placeholder for business logo

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
      setProfileImagePreview(null);
    }
  };

  const handleProfileImageUpload = async () => {
    if (!profileImageFile || !currentUser) {
      toast({ title: "No image selected or not logged in.", variant: "destructive" });
      return;
    }
    setIsUploading(true);
    try {
      // Replace with actual Firebase storage upload and user profile update
      const downloadURL = await mockUploadProfileImage(currentUser.uid, profileImageFile);
      // In a real app, you'd update the user's photoURL in Firebase Auth & Firestore
      // For now, we can update the local state or context if you want immediate reflection.
      // For simplicity, we'll just show a success toast.
      // If you want to update currentUser in AuthContext, you'd need a function there.
      // currentUser.photoURL = downloadURL; // This won't trigger re-render without context update
      setProfileImagePreview(downloadURL); // Update preview with "uploaded" URL
      toast({ title: "Profile Image Uploaded", description: "Your new profile image is set (mock)." });
    } catch (error) {
      toast({ title: "Upload Failed", description: "Could not upload profile image.", variant: "destructive" });
      console.error("Profile image upload error:", error);
    } finally {
      setIsUploading(false);
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
              <AvatarImage src={profileImagePreview || currentUser.photoURL || "https://placehold.co/100x100.png"} alt={currentUser.displayName || "User"} data-ai-hint="user avatar large" />
              <AvatarFallback>{getInitials(currentUser.displayName)}</AvatarFallback>
            </Avatar>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="profile-picture" className="text-sm">Change Profile Picture</Label>
              <div className="flex items-center gap-2">
                <Input id="profile-picture" type="file" accept="image/*" onChange={handleProfileImageChange} className="text-xs"/>
              </div>
               {profileImagePreview && !isUploading && (
                <Button onClick={handleProfileImageUpload} size="sm" className="mt-2 w-full" disabled={isUploading}>
                  <UploadCloud className="mr-2 h-4 w-4" /> Upload New Picture
                </Button>
              )}
              {isUploading && <Button size="sm" className="mt-2 w-full" disabled><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Uploading...</Button>}
            </div>
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-semibold">{currentUser.displayName || "User"}</h2>
            <p className="text-muted-foreground">{currentUser.email}</p>
            <Button variant="outline" size="sm" onClick={() => toast({ title: "Edit Profile", description: "Profile editing is simulated." })}>
              Edit Profile (Simulated)
            </Button>
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
