
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User as UserIcon, LogIn, UserPlus } from "lucide-react"; // Added UserIcon, LogIn, UserPlus
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext"; // Import useAuth
import { mockSignOut } from "@/lib/firebase"; // Using mock
import { useRouter } from "next/navigation";

export function UserNav() {
  const { toast } = useToast();
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  // Default user for display purposes if currentUser is not yet loaded or null
  const displayUser = currentUser || {
    name: "Guest",
    email: "",
    avatarUrl: "", // Or a default guest avatar
  };

  const getInitials = (name: string) => {
    if (!name) return "G"; // Guest initial
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("");
    return initials.toUpperCase();
  };

  const handleLogout = async () => {
    try {
      await mockSignOut(); // Replace with actual Firebase signOut
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      // AuthContext will update currentUser to null, triggering redirect in AppLayout
      // Forcing a router push can sometimes be more reliable for immediate UI update.
      router.push('/auth/signin');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not log out. Please try again.",
      });
    }
  };

  if (loading) {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
        <Avatar className="h-10 w-10">
          <AvatarFallback>...</AvatarFallback>
        </Avatar>
      </Button>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center space-x-2">
        <Button variant="outline" asChild>
          <Link href="/auth/signin">
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Link>
        </Button>
        <Button asChild>
          <Link href="/auth/signup">
            <UserPlus className="mr-2 h-4 w-4" /> Sign Up
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={currentUser.photoURL || displayUser.avatarUrl} alt={currentUser.displayName || displayUser.name} data-ai-hint="user avatar" />
            <AvatarFallback>{getInitials(currentUser.displayName || displayUser.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{currentUser.displayName || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {currentUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/settings/profile">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>View Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
