import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import type { LedgerEntry } from "@/types";
import { LedgerTable } from "@/components/features/ledger/ledger-table";
import { ledgerColumns } from "@/components/features/ledger/ledger-columns";

// Mock data for ledger entries
const mockLedger: LedgerEntry[] = [
  { id: "1", date: "2024-07-01", description: "Sale of Product A", type: "income", category: "Sales", amount: 150.00 },
  { id: "2", date: "2024-07-01", description: "Office Rent", type: "expense", category: "Overheads", amount: 500.00 },
  { id: "3", date: "2024-07-02", description: "Consulting Services", type: "income", category: "Services", amount: 300.00 },
  { id: "4", date: "2024-07-03", description: "Supplier Payment - Raw Materials", type: "expense", category: "Cost of Goods Sold", amount: 250.00 },
  { id: "5", date: "2024-07-04", description: "Online Ad Campaign", type: "expense", category: "Marketing", amount: 75.00 },
];

export default function LedgerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Digital Ledger</h1>
        <Button>
          <PlusCircle className="mr-2 h-5 w-5" /> Add New Entry
        </Button>
      </div>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Financial Records</CardTitle>
          <CardDescription>Track your income and expenses to maintain an accurate financial overview.</CardDescription>
        </CardHeader>
        <CardContent>
          <LedgerTable columns={ledgerColumns} data={mockLedger} />
        </CardContent>
      </Card>
    </div>
  );
}