
"use client";

import { Navbar } from '@/components/navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Book, Calendar, Clock, AlertCircle, History, User } from 'lucide-react';
import { MOCK_TRANSACTIONS, MOCK_BOOKS } from '@/lib/firebase-mock';

export default function UserProfile() {
  const activeLoans = MOCK_TRANSACTIONS.filter(t => t.status === 'issued');
  const pastLoans = MOCK_TRANSACTIONS.filter(t => t.status === 'returned');

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-md overflow-hidden">
              <div className="h-24 bg-primary relative">
                 <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 p-1 bg-white rounded-full">
                   <Avatar className="h-20 w-20 ring-4 ring-primary/20">
                    <AvatarImage src="https://picsum.photos/seed/user1/80" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                 </div>
              </div>
              <CardContent className="pt-14 pb-8 text-center">
                <h2 className="text-2xl font-headline font-bold">John Doe</h2>
                <p className="text-sm text-muted-foreground mb-4">Member ID: LIB001</p>
                <div className="flex justify-center gap-2">
                  <Badge variant="outline" className="text-xs bg-primary/5">Student</Badge>
                  <Badge variant="outline" className="text-xs bg-accent/5">Computer Science</Badge>
                </div>
                
                <div className="mt-8 pt-8 border-t space-y-4 text-left text-sm">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <User size={16} /> <span>Member since Oct 2022</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <AlertCircle size={16} /> <span className="text-destructive font-medium">$5.50 Pending Fines</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-primary text-primary-foreground">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <Book className="h-5 w-5 opacity-80" />
                  <span className="font-bold">Member Privileges</span>
                </div>
                <div className="space-y-3 text-sm opacity-90">
                  <div className="flex justify-between border-b border-white/20 pb-2">
                    <span>Borrow Limit</span>
                    <span>5 Books</span>
                  </div>
                  <div className="flex justify-between border-b border-white/20 pb-2">
                    <span>Duration</span>
                    <span>14 Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Loans</span>
                    <span>{activeLoans.length} Books</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Activity Area */}
          <div className="lg:col-span-3 space-y-8">
            
            {/* Active Loans */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="text-primary" size={20} />
                <h3 className="text-xl font-headline font-bold">Currently Borrowed</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeLoans.map(loan => {
                  const book = MOCK_BOOKS.find(b => b.id === loan.book_id);
                  return (
                    <Card key={loan.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <Badge className="bg-orange-500">Due Soon</Badge>
                          <span className="text-xs font-medium text-muted-foreground">Issued: {loan.issue_date}</span>
                        </div>
                        <CardTitle className="text-lg font-headline mt-2">{book?.title}</CardTitle>
                        <CardDescription>{book?.author}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm bg-secondary/50 p-3 rounded-lg text-primary font-bold">
                          <Calendar size={16} /> Due Date: {loan.due_date}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {activeLoans.length === 0 && (
                  <div className="col-span-full py-12 text-center bg-white rounded-xl border-2 border-dashed">
                    <Book className="mx-auto text-muted-foreground mb-2 opacity-50" size={40} />
                    <p className="text-muted-foreground">You don't have any active loans.</p>
                  </div>
                )}
              </div>
            </section>

            {/* History */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <History className="text-primary" size={20} />
                <h3 className="text-xl font-headline font-bold">Borrowing History</h3>
              </div>
              
              <Card className="border-none shadow-sm">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/20 text-muted-foreground text-left">
                        <tr>
                          <th className="px-6 py-4 font-bold">Book Title</th>
                          <th className="px-6 py-4 font-bold">Borrowed</th>
                          <th className="px-6 py-4 font-bold">Returned</th>
                          <th className="px-6 py-4 font-bold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {pastLoans.map(loan => {
                          const book = MOCK_BOOKS.find(b => b.id === loan.book_id);
                          return (
                            <tr key={loan.id} className="hover:bg-secondary/10 transition-colors">
                              <td className="px-6 py-4 font-medium">{book?.title}</td>
                              <td className="px-6 py-4 text-muted-foreground">{loan.issue_date}</td>
                              <td className="px-6 py-4 text-muted-foreground">{loan.return_date}</td>
                              <td className="px-6 py-4 text-right">
                                <Badge variant="secondary">Returned</Badge>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
