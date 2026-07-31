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
  Clock,
  Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, updateDoc, doc, limit, orderBy } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export default function TransactionsManagement() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('issue');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states for Issuing
  const [memberId, setMemberId] = useState('');
  const [bookIsbn, setBookIsbn] = useState('');
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Form states for Returning
  const [returnIsbn, setReturnIsbn] = useState('');

  // Fetch recent transactions
  const transactionsQuery = useMemoFirebase(() => 
    query(collection(firestore, 'transactions'), orderBy('issue_date', 'desc'), limit(10)),
    [firestore]
  );
  const { data: transactions, loading: txLoading } = useCollection(transactionsQuery);

  const handleIssueBook = async () => {
    if (!memberId || !bookIsbn) {
      toast({ variant: "destructive", title: "Validation Error", description: "Please enter both Member ID and ISBN." });
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Verify Member exists
      const memberQuery = query(collection(firestore, 'members'), where('member_id', '==', memberId), limit(1));
      const memberSnap = await getDocs(memberQuery);
      if (memberSnap.empty) {
        throw new Error(`Member with ID ${memberId} not found.`);
      }
      const memberData = memberSnap.docs[0].data();
      const memberRefId = memberSnap.docs[0].id;

      // 2. Verify Book exists and has copies
      const bookQuery = query(collection(firestore, 'books'), where('isbn', '==', bookIsbn), limit(1));
      const bookSnap = await getDocs(bookQuery);
      if (bookSnap.empty) {
        throw new Error(`Book with ISBN ${bookIsbn} not found.`);
      }
      const bookData = bookSnap.docs[0].data();
      const bookRefId = bookSnap.docs[0].id;

      if (bookData.available_copies <= 0) {
        throw new Error("No available copies of this book currently.");
      }

      // 3. Create Transaction
      const txData = {
        book_id: bookRefId,
        book_title: bookData.title,
        member_id: memberRefId,
        member_name: memberData.name,
        issue_date: serverTimestamp(),
        due_date: dueDate,
        status: 'issued',
        fine_amount: 0
      };

      addDoc(collection(firestore, 'transactions'), txData).catch(err => {
         const permissionError = new FirestorePermissionError({
          path: 'transactions',
          operation: 'create',
          requestResourceData: txData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      // 4. Update Book stock
      const bookDocRef = doc(firestore, 'books', bookRefId);
      updateDoc(bookDocRef, {
        available_copies: bookData.available_copies - 1
      }).catch(err => {
        const permissionError = new FirestorePermissionError({
          path: bookDocRef.path,
          operation: 'update',
          requestResourceData: { available_copies: bookData.available_copies - 1 },
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      toast({ title: "Success", description: `Book "${bookData.title}" issued to ${memberData.name}.` });
      setMemberId('');
      setBookIsbn('');
    } catch (err: any) {
      toast({ variant: "destructive", title: "Transaction Failed", description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReturnBook = async () => {
    if (!returnIsbn) {
      toast({ variant: "destructive", title: "Validation Error", description: "Please enter a book ISBN to return." });
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Find the book
      const bookQuery = query(collection(firestore, 'books'), where('isbn', '==', returnIsbn), limit(1));
      const bookSnap = await getDocs(bookQuery);
      if (bookSnap.empty) throw new Error("Book not found.");
      const bookData = bookSnap.docs[0].data();
      const bookId = bookSnap.docs[0].id;

      // 2. Find the active "issued" transaction for this book
      const txQuery = query(
        collection(firestore, 'transactions'), 
        where('book_id', '==', bookId), 
        where('status', '==', 'issued'),
        limit(1)
      );
      const txSnap = await getDocs(txQuery);
      if (txSnap.empty) throw new Error("No active issue record found for this book.");
      
      const txId = txSnap.docs[0].id;
      const txDocRef = doc(firestore, 'transactions', txId);

      // 3. Mark transaction as returned
      updateDoc(txDocRef, {
        status: 'returned',
        return_date: serverTimestamp()
      }).catch(err => {
        const permissionError = new FirestorePermissionError({
          path: txDocRef.path,
          operation: 'update',
          requestResourceData: { status: 'returned' },
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      // 4. Increment book availability
      const bookDocRef = doc(firestore, 'books', bookId);
      updateDoc(bookDocRef, {
        available_copies: bookData.available_copies + 1
      }).catch(err => {
        const permissionError = new FirestorePermissionError({
          path: bookDocRef.path,
          operation: 'update',
          requestResourceData: { available_copies: bookData.available_copies + 1 },
        });
        errorEmitter.emit('permission-error', permissionError);
      });

      toast({ title: "Success", description: "Book return processed successfully." });
      setReturnIsbn('');
    } catch (err: any) {
      toast({ variant: "destructive", title: "Return Failed", description: err.message });
    } finally {
      setIsProcessing(false);
    }
  };
  
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
                      <Input 
                        id="member-id" 
                        placeholder="LIB-XXX" 
                        className="pl-9" 
                        value={memberId}
                        onChange={(e) => setMemberId(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="book-isbn">Book ISBN / Accession No.</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="book-isbn" 
                        placeholder="ISBN13..." 
                        className="pl-9" 
                        value={bookIsbn}
                        onChange={(e) => setBookIsbn(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="due-date">Due Date</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="due-date" 
                        type="date" 
                        className="pl-9" 
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-primary hover:bg-primary/90"
                    disabled={isProcessing}
                    onClick={handleIssueBook}
                  >
                    {isProcessing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    Confirm Issue
                  </Button>
                </TabsContent>

                <TabsContent value="return" className="space-y-4">
                   <div className="space-y-2">
                    <Label htmlFor="return-isbn">Book ISBN / Accession No.</Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="return-isbn" 
                        placeholder="Scan or Enter ISBN" 
                        className="pl-9" 
                        value={returnIsbn}
                        onChange={(e) => setReturnIsbn(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4 bg-accent hover:bg-accent/90 text-accent-foreground"
                    disabled={isProcessing}
                    onClick={handleReturnBook}
                  >
                    {isProcessing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                    Process Return
                  </Button>
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
                 {txLoading ? (
                   <div className="p-8 text-center text-muted-foreground flex items-center justify-center">
                     <Loader2 className="animate-spin mr-2" /> Loading activity...
                   </div>
                 ) : transactions.length === 0 ? (
                   <div className="p-8 text-center text-muted-foreground">No recent activity.</div>
                 ) : (
                   transactions.map(tx => (
                      <div key={tx.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-secondary/5 transition-colors">
                        <div className="flex gap-4">
                           <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${tx.status === 'issued' ? 'bg-orange-500/10 text-orange-500' : 'bg-accent/10 text-accent'}`}>
                              {tx.status === 'issued' ? <Clock size={24} /> : <CheckCircle2 size={24} />}
                           </div>
                           <div>
                              <p className="font-bold text-sm leading-none mb-1">{tx.book_title}</p>
                              <p className="text-xs text-muted-foreground">Issued to <span className="font-medium text-primary">{tx.member_name}</span></p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Due: {tx.due_date}</span>
                                {tx.fine_amount > 0 && <Badge variant="destructive" className="h-5 px-1.5 text-[9px]">Fine: ₹{tx.fine_amount.toFixed(2)}</Badge>}
                              </div>
                           </div>
                        </div>
                        <div className="flex items-center gap-3 self-end sm:self-center">
                           <Badge variant={tx.status === 'issued' ? 'secondary' : 'outline'} className="capitalize">{tx.status}</Badge>
                        </div>
                      </div>
                    ))
                 )}
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
                   <div className="text-4xl font-black text-destructive">0</div>
                   <p className="text-sm text-muted-foreground mt-2">Books currently past their due dates.</p>
                </CardContent>
             </Card>
             <Card className="border-none shadow-sm bg-accent/5">
                <CardContent className="pt-6">
                   <div className="flex items-center gap-2 text-accent-foreground font-bold mb-4">
                      <CheckCircle2 size={20} className="text-accent" />
                      <span>Returns Today</span>
                   </div>
                   <div className="text-4xl font-black text-accent-foreground">0</div>
                   <p className="text-sm text-muted-foreground mt-2">Successful book returns processed recently.</p>
                </CardContent>
             </Card>
           </div>
        </div>
      </div>
    </div>
  );
}