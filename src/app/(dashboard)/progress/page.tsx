"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, Calculator, BookOpen, Code2, Lightbulb } from 'lucide-react'

const weeklyData = [
  { name: 'Week 1', hours: 14 },
  { name: 'Week 2', hours: 16 },
  { name: 'Week 3', hours: 18 },
  { name: 'Week 4', hours: 15 },
  { name: 'Week 5', hours: 20 },
]

export default function ProgressPage() {
  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Your Progress</h1>
        <p className="text-muted-foreground text-lg">Track your consistency and mastery over 90 days.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Overall Completion</CardDescription>
            <CardTitle className="text-4xl">42%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={42} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">38 out of 90 days</p>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Longest Streak</CardDescription>
            <CardTitle className="text-4xl text-orange-500">24 <span className="text-2xl">Days</span></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="text-green-500 font-medium mr-1">+7 days</span> from last month
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Problems Solved</CardDescription>
            <CardTitle className="text-4xl text-[var(--color-dsa)]">142</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="font-medium mr-1 text-foreground">Top 15%</span> of peers
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card">
          <CardHeader className="pb-2">
            <CardDescription>Study Time</CardDescription>
            <CardTitle className="text-4xl">84h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              Avg 2.2 hours/day
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 bg-card">
          <CardHeader>
            <CardTitle>Weekly Study Hours</CardTitle>
            <CardDescription>Your time invested over the last 5 weeks</CardDescription>
          </CardHeader>
          <CardContent className="pl-0 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}h`} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))' }}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                />
                <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 bg-card">
          <CardHeader>
            <CardTitle>Subject Progress</CardTitle>
            <CardDescription>Completion rate per skill</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-[var(--color-lr)]" />
                  <span className="text-sm font-medium">Logical Reasoning</span>
                </div>
                <span className="text-sm font-bold">62%</span>
              </div>
              <Progress value={62} className="h-2 bg-[var(--color-lr)]/20" indicatorClassName="bg-[var(--color-lr)]" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[var(--color-aptitude)]" />
                  <span className="text-sm font-medium">Quant Aptitude</span>
                </div>
                <span className="text-sm font-bold">48%</span>
              </div>
              <Progress value={48} className="h-2 bg-[var(--color-aptitude)]/20" indicatorClassName="bg-[var(--color-aptitude)]" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--color-verbal)]" />
                  <span className="text-sm font-medium">Verbal Ability</span>
                </div>
                <span className="text-sm font-bold">39%</span>
              </div>
              <Progress value={39} className="h-2 bg-[var(--color-verbal)]/20" indicatorClassName="bg-[var(--color-verbal)]" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-[var(--color-dsa)]" />
                  <span className="text-sm font-medium">Data Structures</span>
                </div>
                <span className="text-sm font-bold">71%</span>
              </div>
              <Progress value={71} className="h-2 bg-[var(--color-dsa)]/20" indicatorClassName="bg-[var(--color-dsa)]" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
