
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Book, 
  Users, 
  ArrowLeftRight, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const auth = localStorage.getItem('libverse_auth');
    if (auth !== 'admin') {
      router.push('/login');
    }
  }, [router]);

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Book Inventory', href: '/admin/books', icon: Book },
    { name: 'Members', href: '/admin/members', icon: Users },
    { name: 'Transactions', href: '/admin/transactions', icon: ArrowLeftRight },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r transition-all duration-300 flex flex-col fixed inset-y-0 z-50`}>
        <div className="p-6 flex items-center gap-3">
          <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shrink-0">
            <Book size={20} />
          </div>
          {isSidebarOpen && <span className="font-headline text-2xl font-bold text-primary tracking-tight truncate">LibVerse</span>}
        </div>

        <nav className="flex-1 px-4 mt-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button 
                  variant={isActive ? "primary" : "ghost"} 
                  className={`w-full justify-start gap-3 h-11 ${!isSidebarOpen && 'px-2 justify-center'}`}
                >
                  <Icon size={20} className={isActive ? 'text-primary-foreground' : 'text-muted-foreground'} />
                  {isSidebarOpen && <span>{item.name}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <Button 
            variant="ghost" 
            className={`w-full justify-start gap-3 text-muted-foreground ${!isSidebarOpen && 'px-2 justify-center'}`}
            onClick={() => {
              localStorage.removeItem('libverse_auth');
              router.push('/');
            }}
          >
            <LogOut size={20} />
            {isSidebarOpen && <span>Sign Out</span>}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
               <Menu size={20} />
             </Button>
             <div className="hidden sm:flex relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Global search..." className="pl-9 h-9 bg-secondary/40 border-none" />
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} className="text-muted-foreground" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-accent rounded-full border-2 border-white"></span>
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none">Library Admin</p>
                <p className="text-xs text-muted-foreground">Managing Staff</p>
              </div>
              <Avatar className="h-9 w-9 ring-2 ring-primary/10">
                <AvatarImage src="https://picsum.photos/seed/admin/40" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
