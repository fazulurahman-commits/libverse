
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Search, BookOpen, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-library');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <h1 className="text-5xl lg:text-7xl font-headline font-bold mb-6 text-foreground leading-tight">
                Your Digital Gateway to <span className="text-primary">Infinite Knowledge</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-10 max-w-2xl font-body">
                Search our extensive collection, manage your borrowings, and explore a world of information with LibVerse's intelligent management system.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input 
                    placeholder="Search by title, author, or ISBN..." 
                    className="pl-10 h-12 bg-white/80 backdrop-blur-sm shadow-lg border-primary/20"
                  />
                </div>
                <Button size="lg" className="h-12 px-8 shadow-lg">Search</Button>
              </div>
            </div>
          </div>
          
          <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block opacity-40">
             {heroImage && (
               <Image 
                src={heroImage.imageUrl} 
                alt={heroImage.description}
                fill
                className="object-cover rounded-l-[100px]"
                priority
                data-ai-hint="modern library"
               />
             )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4 text-center mb-16">
            <h2 className="text-4xl font-headline font-bold mb-4">Why Choose LibVerse?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Providing modern solutions for libraries and readers alike.</p>
          </div>
          
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-background">
              <CardContent className="pt-10 pb-8 text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                  <Search size={32} />
                </div>
                <h3 className="text-2xl font-headline font-bold mb-3">Instant Search</h3>
                <p className="text-muted-foreground">Find any book in our catalog with real-time availability status and shelf location.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-background">
              <CardContent className="pt-10 pb-8 text-center">
                <div className="h-16 w-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
                  <Clock size={32} />
                </div>
                <h3 className="text-2xl font-headline font-bold mb-3">Due Reminders</h3>
                <p className="text-muted-foreground">Get notified about your upcoming due dates to avoid late returns and fines.</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-xl transition-shadow bg-background">
              <CardContent className="pt-10 pb-8 text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-headline font-bold mb-3">Role-Based Access</h3>
                <p className="text-muted-foreground">Secure logins for both librarians and members with tailored experiences for each.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Announcements/CTA */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between text-primary-foreground gap-10">
              <div className="max-w-2xl">
                <h2 className="text-4xl lg:text-5xl font-headline font-bold mb-6">Become a LibVerse Member Today</h2>
                <p className="text-lg opacity-90 mb-8 font-body">Join our community of readers and gain access to thousands of books, digital resources, and seamless borrowing.</p>
                <div className="flex gap-4">
                  <Link href="/login">
                    <Button variant="secondary" size="lg" className="gap-2">
                      Get Started <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block relative w-96 h-64">
                <BookOpen className="w-full h-full opacity-20" strokeWidth={1} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground text-background py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen size={18} />
              </div>
              <span className="font-headline text-xl font-bold tracking-tight">LibVerse</span>
            </div>
            <p className="text-muted-foreground max-w-sm mb-6">Modernizing the way we share and access information. Our digital library management system makes learning more accessible than ever.</p>
          </div>
          <div>
            <h4 className="font-headline font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/catalog" className="hover:text-primary">Search Catalog</Link></li>
              <li><Link href="/login" className="hover:text-primary">Member Login</Link></li>
              <li><Link href="/admin" className="hover:text-primary">Admin Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-headline font-bold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>info@libverse.com</li>
              <li>+1 (555) 123-4567</li>
              <li>123 Library Lane, Knowledge City</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 border-t border-white/10 mt-12 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} LibVerse. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
