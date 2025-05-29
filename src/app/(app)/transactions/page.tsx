
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon, ImagePlus, PlusCircle, Camera, Mic } from "lucide-react";
import type { Transaction } from "@/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useState } from "react";
import Image from "next/image";

const transactionSchema = z.object({
  date: z.date({ required_error: "Transaction date is required." }),
  description: z.string().min(1, "Description is required."),
  type: z.enum(["sale", "purchase"], { required_error: "Transaction type is required." }),
  amount: z.coerce.number().positive("Amount must be positive."),
  partyName: z.string().min(1, "Buyer/Seller name is required."),
  partyType: z.enum(["customer", "supplier"], { required_error: "Party type is required." }),
  relatedInvoice: z.string().optional(),
  image: z.any().optional(), // For file upload
});

const mockTransactions: Transaction[] = [
    { id: "txn1", date: "2024-07-15", description: "Sale of 10x Organic Apples", type: "sale", amount: 7.50, partyName: "John Doe", partyType: "customer" },
    { id: "txn2", date: "2024-07-14", description: "Purchase of 50x Handmade Soap bars", type: "purchase", amount: 250.00, partyName: "Natural Scents", partyType: "supplier" },
];


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: "",
      partyName: "",
      relatedInvoice: "",
    },
  });

  function onSubmit(values: z.infer<typeof transactionSchema>) {
    console.log(values);
    const newTransaction: Transaction = {
        id: `txn${transactions.length + 1}`,
        date: format(values.date, "yyyy-MM-dd"),
        description: values.description,
        type: values.type,
        amount: values.amount,
        partyName: values.partyName,
        partyType: values.partyType,
        relatedInvoice: values.relatedInvoice,
        imagePreviewUrl: imagePreview || undefined,
    };
    setTransactions(prev => [newTransaction, ...prev]);
    form.reset();
    setImagePreview(null);
    // Here you would typically send data to your backend
    alert("Transaction submitted! (See console for data)");
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("image", file);
    } else {
      setImagePreview(null);
      form.setValue("image", null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Log Transaction</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-md">
          <CardHeader>
            <CardTitle>New Transaction Details</CardTitle>
            <CardDescription>Record a new sale or purchase.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transaction type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sale">Sale</SelectItem>
                            <SelectItem value="purchase">Purchase</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Description</FormLabel>
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" aria-label="Use microphone for description">
                            <Mic className="h-5 w-5" />
                        </Button>
                      </div>
                      <FormControl>
                        <Textarea placeholder="E.g., Sale of 10kg tomatoes, Purchase of new equipment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount ($)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="relatedInvoice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Related Invoice/Ref # (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="INV-2024-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="partyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Buyer/Seller Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe / Supplier Inc." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="partyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Party Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select party type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="supplier">Supplier</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between">
                            <FormLabel>Upload Receipt/Image (Optional)</FormLabel>
                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" aria-label="Use camera to upload receipt">
                                <Camera className="h-5 w-5" />
                            </Button>
                          </div>
                          <FormControl>
                            <div className="flex items-center gap-4">
                            <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-input bg-background rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                                <ImagePlus className="mr-2 h-4 w-4"/> Choose File
                            </label>
                            <Input id="file-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                            {field.value && <span className="text-sm text-muted-foreground">{(field.value as File).name}</span>}
                            </div>
                        </FormControl>
                        {imagePreview && (
                            <div className="mt-2">
                                <Image src={imagePreview} alt="Receipt preview" width={200} height={200} className="rounded-md object-cover" data-ai-hint="receipt document" />
                            </div>
                        )}
                        <FormMessage />
                        </FormItem>
                    )}
                 />
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => {form.reset(); setImagePreview(null);}}>Clear Form</Button>
                    <Button type="submit">
                        <PlusCircle className="mr-2 h-5 w-5" /> Add Transaction
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1 shadow-md">
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto">
                {transactions.length === 0 ? (
                    <p className="text-muted-foreground">No transactions yet.</p>
                ) : (
                <ul className="space-y-3">
                    {transactions.map((txn) => (
                    <li key={txn.id} className="p-3 border rounded-md hover:bg-muted/50">
                        <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium">{txn.description}</p>
                            <p className="text-sm text-muted-foreground">{txn.partyName} ({txn.partyType})</p>
                        </div>
                        <p className={`font-semibold ${txn.type === 'sale' ? 'text-green-600' : 'text-red-600'}`}>
                            {txn.type === 'sale' ? '+' : '-'} ${txn.amount.toFixed(2)}
                        </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(txn.date).toLocaleDateString()}</p>
                        {txn.imagePreviewUrl && <Image src={txn.imagePreviewUrl} alt="Txn image" width={60} height={60} className="mt-2 rounded object-cover" data-ai-hint="transaction receipt" />}
                    </li>
                    ))}
                </ul>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
