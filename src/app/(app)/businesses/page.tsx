"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, PlusCircle, Search, Filter, Building } from "lucide-react";
import type { Business } from "@/types";
import Image from "next/image";
import { useState, useMemo } from "react";

// Mock data for businesses
const mockBusinesses: Business[] = [
  { id: "1", name: "The Cozy Corner Cafe", category: "Cafe", address: "12 Oak St, Townsville", latitude: 34.0522, longitude: -118.2437, description: "Friendly local cafe with great coffee and pastries." },
  { id: "2", name: "Main Street Books", category: "Bookstore", address: "34 Pine Ave, Townsville", latitude: 34.0522, longitude: -118.2437, description: "Independent bookstore with a wide selection." },
  { id: "3", name: "Artisan Blooms", category: "Florist", address: "56 Maple Dr, Townsville", latitude: 34.0522, longitude: -118.2437, description: "Beautiful flower arrangements for all occasions." },
  { id: "4", name: "Tech Repair Hub", category: "Services", address: "78 Elm Rd, Townsville", latitude: 34.0522, longitude: -118.2437, description: "Fast and reliable tech repair services." },
];

const categories = ["All", ...new Set(mockBusinesses.map(b => b.category))];

export default function BusinessesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredBusinesses = useMemo(() => {
    return mockBusinesses.filter(business => {
      const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            business.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (business.description && business.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === "All" || business.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Local Business Directory</h1>
        <Button> {/* This button might be for adding own business or a feature for admins */}
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Business
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Discover Local Businesses</CardTitle>
          <CardDescription>Find and connect with businesses in your area. Limited search implemented.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by name, address, or description..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
            {/* <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" /> More Filters
            </Button> */}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredBusinesses.length > 0 ? filteredBusinesses.map((business) => (
                <Card key={business.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                        <Building className="mr-3 h-6 w-6 text-primary" /> 
                        {business.name}
                    </CardTitle>
                    <CardDescription>{business.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground flex items-center mb-1">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" /> {business.address}
                    </p>
                    {business.description && <p className="text-sm mb-2">{business.description}</p>}
                     <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline">View Profile</Button>
                        {/* Placeholder for networking action */}
                        <Button size="sm">Connect</Button> 
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <p className="text-center text-muted-foreground py-10">No businesses found matching your criteria.</p>
              )}
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-20 shadow-md"> {/* Sticky map container */}
                <CardHeader>
                  <CardTitle>Business Locations Map</CardTitle>
                </CardHeader>
                <CardContent>
                   <div className="aspect-square w-full bg-muted rounded-md overflow-hidden">
                    <Image
                      src="https://placehold.co/600x600.png"
                      alt="Businesses Map Placeholder"
                      width={600}
                      height={600}
                      layout="responsive"
                      data-ai-hint="map location"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">Map functionality is simulated.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}