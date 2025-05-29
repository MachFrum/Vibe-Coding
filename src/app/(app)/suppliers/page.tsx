"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, PlusCircle, Search, Filter } from "lucide-react";
import type { Supplier } from "@/types";
import Image from "next/image";
import { useState, useMemo } from "react";

// Mock data for suppliers
const mockSuppliers: Supplier[] = [
  { id: "1", name: "FarmFresh Co.", category: "Produce", address: "123 Green Valley Rd, Farmville", latitude: 34.0522, longitude: -118.2437, itemsSupplied: ["Organic Apples", "Vegetables"], contact: "info@farmfresh.com" },
  { id: "2", name: "Bakery Delights", category: "Baked Goods", address: "456 Flour St, Bakerton", latitude: 34.0522, longitude: -118.2437, itemsSupplied: ["Whole Wheat Bread", "Pastries"], contact: "orders@bakerydelights.com" },
  { id: "3", name: "Roast Masters", category: "Coffee & Tea", address: "789 Bean Ave, Brewtown", latitude: 34.0522, longitude: -118.2437, itemsSupplied: ["Artisan Coffee Beans", "Specialty Teas"], contact: "sales@roastmasters.co" },
  { id: "4", name: "Natural Scents", category: "Crafts & Goods", address: "101 Aroma Ln, Craftsville", latitude: 34.0522, longitude: -118.2437, itemsSupplied: ["Handmade Soap", "Candles"], contact: "support@naturalscents.com" },
];

const categories = ["All", ...new Set(mockSuppliers.map(s => s.category))];
const itemTypes = ["All", ...new Set(mockSuppliers.flatMap(s => s.itemsSupplied))];

export default function SuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [itemFilter, setItemFilter] = useState("All");

  const filteredSuppliers = useMemo(() => {
    return mockSuppliers.filter(supplier => {
      const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            supplier.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "All" || supplier.category === categoryFilter;
      const matchesItem = itemFilter === "All" || supplier.itemsSupplied.includes(itemFilter);
      return matchesSearch && matchesCategory && matchesItem;
    });
  }, [searchTerm, categoryFilter, itemFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Suppliers Directory</h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Supplier
        </Button>
      </div>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Find Suppliers</CardTitle>
          <CardDescription>Search and filter suppliers by location, category, or items supplied.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 border rounded-lg bg-muted/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search by name or address..." 
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
            <Select value={itemFilter} onValueChange={setItemFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by item type" />
              </SelectTrigger>
              <SelectContent>
                {itemTypes.map(item => <SelectItem key={item} value={item}>{item}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <Filter className="mr-2 h-4 w-4" /> Advanced Filters
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredSuppliers.length > 0 ? filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader>
                    <CardTitle className="text-xl">{supplier.name}</CardTitle>
                    <CardDescription>{supplier.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground flex items-center mb-1">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" /> {supplier.address}
                    </p>
                    <p className="text-sm mb-2"><strong>Supplies:</strong> {supplier.itemsSupplied.join(", ")}</p>
                    {supplier.contact && <p className="text-sm"><strong>Contact:</strong> {supplier.contact}</p>}
                    <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline">View Details</Button>
                        <Button size="sm">Contact Supplier</Button>
                    </div>
                  </CardContent>
                </Card>
              )) : (
                <p className="text-center text-muted-foreground py-10">No suppliers found matching your criteria.</p>
              )}
            </div>
            <div className="lg:col-span-1">
              <Card className="sticky top-20 shadow-md"> {/* Sticky map container */}
                <CardHeader>
                  <CardTitle>Supplier Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square w-full bg-muted rounded-md overflow-hidden">
                    <Image
                      src="https://placehold.co/600x600.png"
                      alt="Suppliers Map Placeholder"
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