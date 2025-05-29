import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Package, AlertTriangle, TrendingUp, TrendingDown, Users, ShoppingCart } from "lucide-react";
import type { KeyMetric } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { month: "Jan", revenue: 1860, expenses: 800 },
  { month: "Feb", revenue: 3050, expenses: 1200 },
  { month: "Mar", revenue: 2370, expenses: 950 },
  { month: "Apr", revenue: 730, expenses: 1500 },
  { month: "May", revenue: 2090, expenses: 1000 },
  { month: "Jun", revenue: 2140, expenses: 1100 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
  expenses: { label: "Expenses", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;


export default function DashboardPage() {
  const metrics: KeyMetric[] = [
    { title: "Cash Balance", value: "$12,345.67", icon: DollarSign, trend: "up", trendValue: "+5.2%" },
    { title: "Inventory Items", value: 1205, icon: Package, trend: "neutral" },
    { title: "Low Stock Alerts", value: 15, icon: AlertTriangle, trend: "down", trendValue: "-3" },
    { title: "Total Sales (Month)", value: "$5,800", icon: ShoppingCart, trend: "up", trendValue: "+12%" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {metric.icon && <metric.icon className="h-5 w-5 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              {metric.trend && (
                <p className={`text-xs flex items-center ${metric.trend === "up" ? "text-green-600" : metric.trend === "down" ? "text-red-600" : "text-muted-foreground"}`}>
                  {metric.trend === "up" && <TrendingUp className="mr-1 h-4 w-4" />}
                  {metric.trend === "down" && <TrendingDown className="mr-1 h-4 w-4" />}
                  {metric.trendValue} this month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Revenue vs Expenses</CardTitle>
            <CardDescription>Monthly financial overview for the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={chartData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltipContent />
                <Legend />
                <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
                <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
             <CardDescription>Quick overview of recent transactions and inventory changes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { type: "New Sale", item: "Product A", amount: "$50.00", time: "2m ago" },
              { type: "Stock Update", item: "Product B quantity to 20", amount: "", time: "1h ago" },
              { type: "New Expense", item: "Office Supplies", amount: "$120.00", time: "3h ago" },
              { type: "New Supplier Added", item: "Fresh Produce Inc.", amount: "", time: "1d ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                <div>
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-muted-foreground">{activity.item}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{activity.amount}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
