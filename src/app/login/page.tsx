
"use client";

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Book as BookIcon, Loader2, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate Auth
    setTimeout(() => {
      if (email === 'admin@libverse.com') {
        localStorage.setItem('libverse_auth', 'admin');
        router.push('/admin');
      } else if (email.includes('@')) {
        localStorage.setItem('libverse_auth', 'user');
        router.push('/user/profile');
      } else {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/10">
          <CardHeader className="text-center space-y-1">
            <div className="mx-auto bg-primary text-primary-foreground p-3 rounded-2xl w-fit mb-4">
              <BookIcon size={32} />
            </div>
            <CardTitle className="text-3xl font-headline font-bold">Welcome Back</CardTitle>
            <CardDescription className="font-body">Enter your credentials to access LibVerse</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-4">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="px-0 font-normal text-xs text-primary" type="button">Forgot password?</Button>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-secondary/50"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 pb-8">
              <Button type="submit" className="w-full h-11 text-lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account? <Button variant="link" className="px-1 text-primary">Contact Librarian</Button>
              </div>
              
              <div className="pt-4 border-t w-full text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Demo Access</p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm" type="button" onClick={() => { setEmail('admin@libverse.com'); setPassword('password'); }}>Admin Demo</Button>
                  <Button variant="outline" size="sm" type="button" onClick={() => { setEmail('user@example.com'); setPassword('password'); }}>User Demo</Button>
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
