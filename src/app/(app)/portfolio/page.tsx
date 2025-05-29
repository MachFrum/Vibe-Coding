
"use client";

import { useState, type ChangeEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Upload, Video, DollarSign, CreditCard, Palette, Tag, Sparkles, Save } from "lucide-react";
import type { InventoryItem } from "@/types";

// Mock inventory data for selection
const mockInventoryForPortfolio: InventoryItem[] = [
  { id: "item-1", name: "Handcrafted Mug", quantity: 25, unitPrice: 15.99, lowStockThreshold: 5, supplier: "Artisan Goods Co." },
  { id: "item-2", name: "Organic Coffee Blend", quantity: 50, unitPrice: 12.50, lowStockThreshold: 10, supplier: "Bean Masters" },
  { id: "item-3", name: "Leather Journal", quantity: 30, unitPrice: 25.00, lowStockThreshold: 8, supplier: "Fine Leathers Ltd." },
  { id: "item-4", name: "Scented Soy Candle", quantity: 60, unitPrice: 18.00, lowStockThreshold: 15, supplier: "Home Fragrances" },
];

const portfolioSchema = z.object({
  businessName: z.string().min(2, "Business name must be at least 2 characters."),
  businessDescription: z.string().min(10, "Description must be at least 10 characters.").max(500, "Description too long."),
  bannerImage: z.any().optional(),
  profileImage: z.any().optional(),
  videoUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  featuredItems: z.array(z.string()).optional(),
  bestSellingItems: z.array(z.string()).optional(),
  saleItems: z.array(z.string()).optional(),
  paymentStripeEnabled: z.boolean().optional(),
  paymentStripeKey: z.string().optional(),
  paymentPaypalEnabled: z.boolean().optional(),
  paymentPaypalEmail: z.string().email({ message: "Invalid PayPal email." }).optional().or(z.literal('')),
  paymentVisaEnabled: z.boolean().optional(),
  paymentMpesaEnabled: z.boolean().optional(),
  paymentMpesaNumber: z.string().optional(),
});

type PortfolioFormValues = z.infer<typeof portfolioSchema>;

export default function PortfolioPage() {
  const { toast } = useToast();
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      businessName: "My Awesome Business",
      businessDescription: "Selling the best widgets in town since 2023. High quality and great service guaranteed!",
      videoUrl: "",
      featuredItems: [mockInventoryForPortfolio[0].id, mockInventoryForPortfolio[2].id],
      bestSellingItems: [mockInventoryForPortfolio[1].id],
      saleItems: [mockInventoryForPortfolio[3].id],
      paymentStripeEnabled: true,
      paymentStripeKey: "pk_test_••••••••••••••••••••••••",
      paymentPaypalEnabled: false,
      paymentPaypalEmail: "",
      paymentVisaEnabled: true,
      paymentMpesaEnabled: false,
      paymentMpesaNumber: "",
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>, setImagePreview: React.Dispatch<React.SetStateAction<string | null>>, fieldName: "bannerImage" | "profileImage") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        form.setValue(fieldName, file);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      form.setValue(fieldName, null);
    }
  };

  function onSubmit(data: PortfolioFormValues) {
    console.log("Portfolio data submitted:", data);
    toast({
      title: "Portfolio Updated",
      description: "Your business portfolio has been saved successfully.",
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Your Business Portfolio</h1>
        <Button onClick={form.handleSubmit(onSubmit)}>
          <Save className="mr-2 h-5 w-5" /> Save Changes
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><Palette className="mr-2 h-6 w-6 text-primary" /> Business Profile & Branding</CardTitle>
              <CardDescription>Set your business name, description, banner, logo and promotional video.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Name</FormLabel>
                    <FormControl><Input placeholder="Your Company LLC" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="businessDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Description</FormLabel>
                    <FormControl><Textarea placeholder="Tell customers about your business..." {...field} className="min-h-[120px]" /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bannerImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Banner Image (e.g., for your shop front)</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setBannerPreview, "bannerImage")} />
                      </FormControl>
                      {bannerPreview && <Image src={bannerPreview} alt="Banner preview" width={300} height={150} className="mt-2 rounded-md object-cover aspect-[2/1]" data-ai-hint="store banner" />}
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile/Logo Image</FormLabel>
                      <FormControl>
                        <Input type="file" accept="image/*" onChange={(e) => handleImageChange(e, setProfilePreview, "profileImage")} />
                      </FormControl>
                      {profilePreview && <Image src={profilePreview} alt="Profile preview" width={100} height={100} className="mt-2 rounded-full object-cover aspect-square" data-ai-hint="business logo" />}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center"><Video className="mr-2 h-4 w-4"/> Promotional Video URL (Optional)</FormLabel>
                    <FormControl><Input placeholder="https://youtube.com/your-video" {...field} /></FormControl>
                    <FormDescription>Link to a YouTube, Vimeo, or other video hosting platform.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><Sparkles className="mr-2 h-6 w-6 text-primary" /> Featured Inventory & Promotions</CardTitle>
              <CardDescription>Choose items to highlight on your public profile. Customers will see these.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <FormLabel className="text-base font-semibold">Items to Feature Publicly</FormLabel>
                <FormDescription className="mb-3">Select products from your inventory to showcase.</FormDescription>
                <FormField
                  control={form.control}
                  name="featuredItems"
                  render={() => (
                    <FormItem className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mockInventoryForPortfolio.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="featuredItems"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">
                                  {item.name} <span className="text-xs text-muted-foreground">(${item.unitPrice.toFixed(2)})</span>
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </FormItem>
                  )}
                />
                 <FormMessage>{form.formState.errors.featuredItems?.message}</FormMessage>
              </div>

               <div>
                <FormLabel className="text-base font-semibold">Best Selling Items</FormLabel>
                <FormDescription className="mb-3">Highlight your top products.</FormDescription>
                <FormField
                  control={form.control}
                  name="bestSellingItems"
                  render={() => (
                    <FormItem className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mockInventoryForPortfolio.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="bestSellingItems"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">
                                  {item.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </FormItem>
                  )}
                />
                 <FormMessage>{form.formState.errors.bestSellingItems?.message}</FormMessage>
              </div>
              
              <div>
                <FormLabel className="text-base font-semibold"><Tag className="mr-2 h-5 w-5 inline-block text-primary"/> Items on Sale</FormLabel>
                <FormDescription className="mb-3">Mark items for special promotions or sales.</FormDescription>
                 <FormField
                  control={form.control}
                  name="saleItems"
                  render={() => (
                    <FormItem className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mockInventoryForPortfolio.map((item) => (
                        <FormField
                          key={item.id}
                          control={form.control}
                          name="saleItems"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item.id])
                                        : field.onChange(
                                            (field.value || []).filter(
                                              (value) => value !== item.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal text-sm">
                                  {item.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </FormItem>
                  )}
                />
                <FormMessage>{form.formState.errors.saleItems?.message}</FormMessage>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><CreditCard className="mr-2 h-6 w-6 text-primary" /> Payment Setup (Simulated)</CardTitle>
              <CardDescription>Configure how customers can pay you. Changes here are for display/simulation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="paymentStripeEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Stripe</FormLabel>
                      <FormDescription>Accept credit/debit cards via Stripe.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              {form.watch("paymentStripeEnabled") && (
                <FormField
                  control={form.control}
                  name="paymentStripeKey"
                  render={({ field }) => (
                    <FormItem className="pl-4">
                      <FormLabel>Stripe Publishable Key (Test)</FormLabel>
                      <FormControl><Input placeholder="pk_test_YOUR_STRIPE_KEY" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="paymentPaypalEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">PayPal</FormLabel>
                      <FormDescription>Accept payments via PayPal.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              {form.watch("paymentPaypalEnabled") && (
                <FormField
                  control={form.control}
                  name="paymentPaypalEmail"
                  render={({ field }) => (
                    <FormItem className="pl-4">
                      <FormLabel>PayPal Email</FormLabel>
                      <FormControl><Input type="email" placeholder="your.paypal@example.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="paymentVisaEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Visa/Mastercard (Direct)</FormLabel>
                      <FormDescription>Indicate direct card acceptance (if applicable).</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentMpesaEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">M-Pesa (Kenya)</FormLabel>
                      <FormDescription>Accept mobile money via M-Pesa.</FormDescription>
                    </div>
                    <FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                  </FormItem>
                )}
              />
              {form.watch("paymentMpesaEnabled") && (
                <FormField
                  control={form.control}
                  name="paymentMpesaNumber"
                  render={({ field }) => (
                    <FormItem className="pl-4">
                      <FormLabel>M-Pesa Paybill/Till Number</FormLabel>
                      <FormControl><Input placeholder="e.g., 123456" {...field} /></FormControl>
                       <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center"><DollarSign className="mr-2 h-6 w-6 text-primary" /> Sales & Payouts Summary (Simulated)</CardTitle>
              <CardDescription>A quick overview of your store's performance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between p-3 border rounded-md">
                <p>Total Items Sold (This Month):</p>
                <p className="font-semibold">157</p>
              </div>
              <div className="flex justify-between p-3 border rounded-md">
                <p>Total Revenue (This Month):</p>
                <p className="font-semibold text-green-600">$2,345.67</p>
              </div>
              <div className="flex justify-between p-3 border rounded-md">
                <p>Pending Payout:</p>
                <p className="font-semibold">$1,890.12</p>
              </div>
               <div className="flex justify-between p-3 border rounded-md">
                <p>Next Payout Date:</p>
                <p className="font-semibold">August 1, 2024</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg">
              <Save className="mr-2 h-5 w-5" /> Save All Portfolio Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

