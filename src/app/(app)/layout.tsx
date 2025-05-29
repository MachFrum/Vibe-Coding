"use client";

import * as React from "react";
import { siteConfig } from "@/config/site";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Header } from "@/components/layout/header";
import { UserNav } from "@/components/layout/user-nav";
import { Mountain } from "lucide-react";
import Link from "next/link";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"; // Ensure this path is correct

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar collapsible="icon" variant="sidebar" side="left">
        <SidebarHeader className="p-4">
          <div className="flex items-center justify-between">
             <Link href="/dashboard" className="flex items-center gap-2 group-data-[[data-collapsible=icon]]:hidden">
                <Mountain className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold text-foreground">{siteConfig.name}</span>
              </Link>
              <Link href="/dashboard" className="hidden items-center gap-2 group-data-[[data-collapsible=icon]]:flex">
                 <Mountain className="h-7 w-7 text-primary" />
              </Link>
            <div className="group-data-[[data-collapsible=icon]]:hidden">
              <SidebarTrigger />
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2 pr-0">
          <SidebarNav items={siteConfig.sidebarNav} />
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border group-data-[[data-collapsible=icon]]:hidden">
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}