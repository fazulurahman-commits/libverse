"use client";

import { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Edit2, Trash2, MoreVertical, Filter, BookOpen, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export default function BooksManagement() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const booksQuery = useMemoFirebase(() => collection(firestore, 'books'), [firestore]);
  const { data: books, loading } = useCollection(booksQuery);

  const [search, setSearch] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // New Book Form State
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    total_copies: 1,
    location: ''
  });

  const filteredBooks = books.filter(b => 
    b.title?.toLowerCase().includes(search.toLowerCase()) || 
    b.author?.toLowerCase().includes(search.toLowerCase()) ||
    b.isbn?.includes(search)
  );

  const handleAddBook = () => {
    if (!newBook.title || !newBook.author || !newBook.isbn) {
      toast({ variant: "destructive", title: "Error", description: "Title, Author and ISBN are required." });
      return;
    }

    const booksRef = collection(firestore, 'books');
    const bookData = {
      ...newBook,
      available_copies: Number(newBook.total_copies),
      total_copies: Number(newBook.total_copies),
      createdAt: serverTimestamp(),
    };

    addDoc(booksRef, bookData)
      .then(() => {
        setIsAddDialogOpen(false);
        setNewBook({ title: '', author: '', isbn: '', category: '', total_copies: 1, location: '' });
        toast({ title: "Success", description: "Book added to inventory." });
      })
      .catch(async (err) => {
        const permissionError = new FirestorePermissionError({
          path: 'books',
          operation: 'create',
          requestResourceData: bookData,
        });
        errorEmitter.emit('permission-error', permissionError);
      });
  };

  const handleDeleteBook = (id: string) => {
    const bookRef = doc(firestore, 'books', id);
    deleteDoc(bookRef).catch(async (err) => {
      const permissionError = new FirestorePermissionError({
        path: bookRef.path,
        operation: 'delete',
      });
      errorEmitter.emit('permission-error', permissionError);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold">Book Inventory</h1>
          <p className="text-muted-foreground">Manage library collection and monitor stock levels.</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={18} /> Add New Book
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Book</DialogTitle>
              <DialogDescription>
                Enter the details of the book to add it to the library catalog.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={newBook.title} 
                  onChange={e => setNewBook({...newBook, title: e.target.value})}
                  placeholder="The Great Gatsby" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">Author</Label>
                <Input 
                  id="author" 
                  value={newBook.author} 
                  onChange={e => setNewBook({...newBook, author: e.target.value})}
                  placeholder="F. Scott Fitzgerald" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input 
                  id="isbn" 
                  value={newBook.isbn} 
                  onChange={e => setNewBook({...newBook, isbn: e.target.value})}
                  placeholder="9780743273565" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input 
                  id="category" 
                  value={newBook.category} 
                  onChange={e => setNewBook({...newBook, category: e.target.value})}
                  placeholder="Fiction" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="total_copies">Total Copies</Label>
                <Input 
                  id="total_copies" 
                  type="number"
                  value={newBook.total_copies} 
                  onChange={e => setNewBook({...newBook, total_copies: parseInt(e.target.value) || 1})}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="location">Location (Shelf)</Label>
                <Input 
                  id="location" 
                  value={newBook.location} 
                  onChange={e => setNewBook({...newBook, location: e.target.value})}
                  placeholder="Shelf A1" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddBook}>Add to Collection</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search by title, author or ISBN..." 
              className="pl-9 h-10" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter size={18} /> Filters
          </Button>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="w-[300px]">Book Details</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                  </TableCell>
                </TableRow>
              ) : filteredBooks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No books found.
                  </TableCell>
                </TableRow>
              ) : filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-8 bg-primary/10 rounded flex items-center justify-center text-primary shrink-0">
                        <BookOpen size={16} />
                      </div>
                      <div>
                        <p className="font-bold text-sm leading-tight">{book.title}</p>
                        <p className="text-xs text-muted-foreground">{book.author} • {book.isbn}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal">{book.category || 'Uncategorized'}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={book.available_copies > 0 ? "secondary" : "destructive"}>
                      {book.available_copies > 0 ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">
                      {book.available_copies} <span className="text-muted-foreground text-xs font-normal">of {book.total_copies}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{book.location}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2">
                          <Edit2 size={14} /> Edit Book
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="gap-2 text-destructive"
                          onClick={() => handleDeleteBook(book.id)}
                        >
                          <Trash2 size={14} /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}