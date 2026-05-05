
"use client";

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Book, User as UserIcon, Tag, MapPin, Hash } from 'lucide-react';
import { MOCK_BOOKS } from '@/lib/firebase-mock';

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredBooks = MOCK_BOOKS.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.isbn.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <header className="mb-12 text-center md:text-left">
          <h1 className="text-4xl font-headline font-bold mb-4">Book Catalog</h1>
          <p className="text-muted-foreground max-w-2xl">Explore thousands of titles across multiple categories. Real-time availability tracking for every copy.</p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search by title, author, category or ISBN..." 
              className="pl-10 h-12 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="h-12 gap-2">
            <Filter size={18} /> Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow border-primary/10 flex flex-col">
                <CardHeader className="bg-primary/5 pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant={book.available_copies > 0 ? "secondary" : "destructive"}>
                      {book.available_copies > 0 ? "Available" : "Checked Out"}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Hash size={12} /> {book.isbn}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-headline font-bold leading-snug line-clamp-1">{book.title}</CardTitle>
                  <p className="text-sm text-primary font-medium flex items-center gap-1 mt-1">
                    <UserIcon size={14} /> {book.author}
                  </p>
                </CardHeader>
                <CardContent className="pt-6 flex-1">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Tag size={16} /> Category:
                      </span>
                      <span className="font-medium">{book.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <MapPin size={16} /> Location:
                      </span>
                      <span className="font-medium">{book.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Book size={16} /> Available Copies:
                      </span>
                      <span className="font-bold text-primary">{book.available_copies} / {book.total_copies}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t bg-secondary/10">
                  <Button className="w-full" variant={book.available_copies > 0 ? "default" : "outline"} disabled={book.available_copies === 0}>
                    {book.available_copies > 0 ? "Details" : "Notify Me"}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-secondary rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4">
                <Search size={40} className="text-muted-foreground" />
              </div>
              <h3 className="text-xl font-headline font-bold mb-2">No books found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria or browse our featured collections.</p>
              <Button variant="link" className="mt-4" onClick={() => setSearchQuery('')}>Clear all filters</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
