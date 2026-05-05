
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeftRight, 
  Search, 
  BookOpen, 
  User as UserIcon, 
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { MOCK_TRANSACTIONS, MOCK_BOOKS, MOCK_MEMBERS } from '@/lib/firebase-mock';
import { Badge } from '@/components/ui/badge';

export default function TransactionsManagement() {
  const [activeTab, setActiveTab] = useState('issue');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-headline font-bold">Circulation Desk</h1>
        <p className="text-muted-foreground">Manage book lending, returns, and track overdue transactions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction Forms */}
        <div className="lg:col-span-1">
          <Card className="border-none shadow-lg h-fit sticky top-24">
            <CardHeader className="bg-primary text-primary-foreground rounded-t-xl">
              <CardTitle className="font-headline flex items-center gap-2">
                <ArrowLeftRight size={20} /> Quick Action
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="issue" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="issue">Issue Book</TabsTrigger>
                  <TabsTrigger value="return">Return Book</TabsTrigger>
                </TabsList>
                
                <TabsContent value="issue" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-id">Member ID</Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="member-id" placeholder="LIB-XXX" className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="book-isbn">Book ISBN / Accession No.</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="book-isbn" placeholder="ISBN13..." className="pl-9" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="due-date" type="date" className="pl-9" defaultValue={new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0]} />
                    </div>
                  </div>
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90">Confirm Issue</Button>
                </TabsContent>

                <TabsContent value="return" className="space-y-4">
                   <div className="space-y-2">
                    <Label htmlFor="return-isbn">Book ISBN / Accession No.</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="return-isbn" placeholder="Scan or Enter ID" className="pl-9" />
                    </div>
                  </div>
                  <div className="p-4 bg-secondary/30 rounded-lg text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Borrowed By:</span>
                      <span className="font-bold">John Doe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Due Date:</span>
                      <span className="font-bold">Oct 15, 2023</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t mt-2">
                      <span className="text-destructive font-bold">Late Fine:</span>
                      <span className="text-destructive font-black text-lg">$2.00</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4 variant-accent">Process Return</Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Transaction History / Recent */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="border-none shadow-sm">
             <CardHeader className="flex flex-row items-center justify-between">
               <div>
                 <CardTitle className="font-headline font-bold">Live Activity</CardTitle>
                 <CardDescription>Recently issued or returned books</CardDescription>
               </div>
               <div className="flex gap-2">
                  <Button variant="outline" size="sm">Export Report</Button>
               </div>
             </CardHeader>
             <CardContent className="p-0">
               <div className="divide-y">
                 {MOCK_TRANSACTIONS.map(tx => {
                    const book = MOCK_BOOKS.find(b => b.id === tx.book_id);
                    const member = MOCK_MEMBERS.find(m => m.id === tx.member_id);
                    return (
                      <div key={tx.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/5 transition-colors">
                        <div className="flex gap-4">
                           <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${tx.status === 'issued' ? 'bg-orange-500/10 text-orange-500' : 'bg-accent/10 text-accent'}`}>
                              {tx.status === 'issued' ? <Clock size={24} /> : <CheckCircle2 size={24} />}
                           </div>
                           <div>
                              <p className="font-bold text-sm leading-none mb-1">{book?.title}</p>
                              <p className="text-xs text-muted-foreground">Issued to <span className="font-medium text-primary">{member?.name}</span> ({member?.member_id})</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Due: {tx.due_date}</span>
                                {tx.fine_amount > 0 && <Badge variant="destructive" className="h-5 px-1.5 text-[9px]">Fine: ${tx.fine_amount.toFixed(2)}</Badge>}
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-center">
                           <Badge variant={tx.status === 'issued' ? 'secondary' : 'outline'} className="capitalize">{tx.status}</Badge>
                           <Button variant="ghost" size="sm">Details</Button>
                        </div>
                      </div>
                    );
                 })}
               </div>
             </CardContent>
           </Card>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <Card className="border-none shadow-sm bg-destructive/5">
                <CardContent className="pt-6">
                   <div className="flex items-center gap-2 text-destructive font-bold mb-4">
                      <AlertCircle size={20} />
                      <span>Overdue Summary</span>
                   </div>
                   <div className="text-4xl font-black text-destructive">14</div>
                   <p className="text-sm text-muted-foreground mt-2">Books currently past their due dates.</p>
                </CardContent>
             </Card>
             <Card className="border-none shadow-sm bg-accent/5">
                <CardContent className="pt-6">
                   <div className="flex items-center gap-2 text-accent-foreground font-bold mb-4">
                      <CheckCircle2 size={20} className="text-accent" />
                      <span>Returns Today</span>
                   </div>
                   <div className="text-4xl font-black text-accent-foreground">8</div>
                   <p className="text-sm text-muted-foreground mt-2">Successful book returns processed since 8 AM.</p>
                </CardContent>
             </Card>
           </div>
        </div>
      </div>
    </div>
  );
}
