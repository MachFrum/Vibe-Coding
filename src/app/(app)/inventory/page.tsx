
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import type { InventoryItem } from "@/types";
import { InventoryTable } from "@/components/features/inventory/inventory-table";
import { inventoryColumns } from "@/components/features/inventory/inventory-columns";

// Mock data for inventory items
const mockInventory: InventoryItem[] = [
  { id: "1", name: "Organic Apples", quantity: 50, unitPrice: 0.75, lowStockThreshold: 20, supplier: "FarmFresh Co." },
  { id: "2", name: "Whole Wheat Bread", quantity: 30, unitPrice: 3.50, lowStockThreshold: 10, supplier: "Bakery Delights" },
  { id: "3", name: "Artisan Coffee Beans", quantity: 15, unitPrice: 15.00, lowStockThreshold: 5, supplier: "Roast Masters" },
  { id: "4", name: "Handmade Soap", quantity: 100, unitPrice: 5.00, lowStockThreshold: 25, supplier: "Natural Scents" },
  { id: "5", name: "Local Honey Jar", quantity: 25, unitPrice: 8.00, lowStockThreshold: 10 },
];

export default function InventoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Log</h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Item
        </Button>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Current Stock</CardTitle>
          <CardDescription>Manage your product inventory, track stock levels, and set low stock alerts.</CardDescription>
        </CardHeader>
        <CardContent>
          <InventoryTable columns={inventoryColumns} data={mockInventory} />
        </CardContent>
      </Card>
    </div>
  );
}
