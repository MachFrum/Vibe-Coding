"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp, TrendingDown, DollarSign, Package, Users } from "lucide-react";

const salesData = [
  { month: 'Jan', sales: 4000, profit: 2400 },
  { month: 'Feb', sales: 3000, profit: 1398 },
  { month: 'Mar', sales: 2000, profit: 9800 },
  { month: 'Apr', sales: 2780, profit: 3908 },
  { month: 'May', sales: 1890, profit: 4800 },
  { month: 'Jun', sales: 2390, profit: 3800 },
];

const salesChartConfig = {
  sales: { label: "Sales", color: "hsl(var(--chart-1))" },
  profit: { label: "Profit", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const expenseData = [
  { name: 'Marketing', value: 400 },
  { name: 'Operations', value: 300 },
  { name: 'Rent', value: 500 },
  { name: 'Utilities', value: 150 },
  { name: 'Salaries', value: 1200 },
];
const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

const expenseChartConfig = Object.fromEntries(
  expenseData.map((entry, index) => [
    entry.name.toLowerCase(),
    { label: entry.name, color: COLORS[index % COLORS.length] },
  ])
) satisfies ChartConfig;


const inventoryTurnoverData = [
  { month: 'Jan', turnoverRate: 2.5 },
  { month: 'Feb', turnoverRate: 2.8 },
  { month: 'Mar', turnoverRate: 2.2 },
  { month: 'Apr', turnoverRate: 3.1 },
  { month: 'May', turnoverRate: 2.9 },
  { month: 'Jun', turnoverRate: 3.5 },
];

const inventoryChartConfig = {
  turnoverRate: { label: "Turnover Rate", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground flex items-center"><TrendingUp className="text-green-500 mr-1 h-3 w-3" /> +20.1% from last month</p>
          </CardContent>
        </Card>
         <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,876.50</div>
            <p className="text-xs text-muted-foreground flex items-center"><TrendingDown className="text-red-500 mr-1 h-3 w-3" /> -5.3% from last month</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">71.5%</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Monthly sales and profit trends.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={salesChartConfig} className="h-[300px] w-full">
              <BarChart data={salesData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
                <YAxis />
                <ChartTooltipContent />
                <Legend />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
                <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
            <CardDescription>Distribution of expenses by category.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
             <ChartContainer config={expenseChartConfig} className="h-[300px] w-full aspect-square">
                <PieChart accessibilityLayer>
                  <ChartTooltipContent nameKey="value" hideLabel />
                  <Pie data={expenseData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                   <Legend />
                </PieChart>
              </ChartContainer>
          </CardContent>
        </Card>
      </div>

       <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Inventory Turnover Rate</CardTitle>
            <CardDescription>How quickly inventory is sold and replenished.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={inventoryChartConfig} className="h-[300px] w-full">
              <LineChart data={inventoryTurnoverData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} accessibilityLayer>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltipContent />
                <Legend />
                <Line type="monotone" dataKey="turnoverRate" stroke="var(--color-turnoverRate)" strokeWidth={2} activeDot={{ r: 8 }} />
              