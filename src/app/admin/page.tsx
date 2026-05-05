
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Users, ArrowLeftRight, AlertCircle, TrendingUp, Calendar } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const data = [
  { name: 'Mon', issued: 12, returned: 10 },
  { name: 'Tue', issued: 18, returned: 14 },
  { name: 'Wed', issued: 15, returned: 22 },
  { name: 'Thu', issued: 25, returned: 18 },
  { name: 'Fri', issued: 20, returned: 25 },
  { name: 'Sat', issued: 30, returned: 15 },
];

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Books', value: '1,284', icon: Book, color: 'text-primary', bg: 'bg-primary/10', trend: '+12 this week' },
    { title: 'Active Members', value: '450', icon: Users, color: 'text-accent', bg: 'bg-accent/10', trend: '+5 new' },
    { title: 'Issued Today', value: '28', icon: ArrowLeftRight, color: 'text-orange-500', bg: 'bg-orange-500/10', trend: 'Peak hour 2pm' },
    { title: 'Overdue Fines', value: '$124.50', icon: AlertCircle, color: 'text-destructive', bg: 'bg-destructive/10', trend: '3 unresolved' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold mb-2">Dashboard Overview</h1>
        <p className="text-muted-foreground">Welcome back, Admin. Here's what's happening in LibVerse today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t">
                  <TrendingUp size={12} className="text-accent" />
                  {stat.trend}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-headline font-bold">Activity Trends</CardTitle>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 bg-primary rounded-full"></div> Issued
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="h-2 w-2 bg-accent rounded-full"></div> Returned
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f5f5f5'}} 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                  />
                  <Bar dataKey="issued" fill="#297BA3" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returned" fill="#52E0C8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Events / Reminders */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="font-headline font-bold">Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { time: '09:00 AM', event: 'Stock Audit - Section B', color: 'bg-blue-500' },
              { time: '11:30 AM', event: 'New Book Cataloging (24)', color: 'bg-green-500' },
              { time: '02:00 PM', event: 'Member Registration Drive', color: 'bg-purple-500' },
              { time: '04:30 PM', event: 'End of Day Report', color: 'bg-orange-500' },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="text-xs font-bold text-muted-foreground w-16 pt-1">{item.time}</div>
                <div className="flex-1 flex gap-3">
                  <div className={`w-1 self-stretch rounded-full ${item.color}`}></div>
                  <div className="font-medium text-sm">{item.event}</div>
                </div>
              </div>
            ))}
            <div className="pt-4 mt-4 border-t">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Pending Tasks</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded border border-primary/20 bg-primary/5"></div>
                  <span className="text-sm">Approve 3 guest memberships</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded border border-primary/20 bg-primary/5"></div>
                  <span className="text-sm">Update fine rates for 2024</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
