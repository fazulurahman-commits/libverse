
"use client";

import Link from 'next/link';
import { Book as BookIcon, Search, User, LogIn, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simulated auth check
    const authStatus = localStorage.getItem('libverse_auth');
    if (authStatus) {
      setIsLoggedIn(true);
      setIsAdmin(authStatus === 'admin');
    }
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookIcon size={20} />
          </div>
          <span className="font-headline text-2xl font-bold text-primary tracking-tight">LibVerse</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/catalog" className="text-sm font-medium hover:text-primary transition-colors">Catalog</Link>
          {isLoggedIn && (
            <Link href={isAdmin ? "/admin" : "/user/profile"} className="text-sm font-medium hover:text-primary transition-colors">
              {isAdmin ? "Dashboard" : "My Profile"}
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/catalog">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
          </Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link href={isAdmin ? "/admin" : "/user/profile"}>
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => {
                localStorage.removeItem('libverse_auth');
                window.location.href = '/';
              }}>Log Out</Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm" className="gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
