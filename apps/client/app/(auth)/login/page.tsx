'use client';

import { ThemeToggle } from '@/components/theme-toggle';
import { useLogin } from '@/hooks/use-auth';

import { Alert, AlertDescription } from '@workspace/ui/components/alert';
import { Button } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { toast } from '@workspace/ui/components/sonner';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [email, setEmail] = useState('admin@restaurant.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    try {
      await loginMutation.mutateAsync({ email, password });
      toast.success('Login successful!');
      router.replace('/');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? 'Login failed';
      setError(msg);
    }
  };

  return (
    <div className='page-pattern flex min-h-screen items-center justify-center p-4'>
      <div className='absolute right-4 top-4'>
        <ThemeToggle />
      </div>
      <Card className='shadow-card md:shadow-card-hover w-full max-w-md border-0 transition-shadow'>
        <CardHeader className='pb-2 text-center'>
          <div className='mx-auto flex h-14 w-14 items-center justify-center rounded-xl'>
            <Image
              src='/icons/restaurant.png'
              alt='Logo'
              width={400}
              height={400}
              className='h-full w-full'
            />
          </div>
          <CardTitle className='text-2xl font-semibold tracking-tight'>
            Restaurant POS
          </CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent className='pt-2'>
          {error && (
            <Alert variant='destructive' className='mb-4'>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='name@restaurant.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loginMutation.isPending}
                className='h-10'
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginMutation.isPending}
                className='h-10'
              />
            </div>
            <Button
              type='submit'
              className='h-10 w-full font-medium'
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
          <div className='bg-muted/50 text-muted-foreground mt-5 rounded-lg px-3 py-2 text-center text-xs'>
            <p className='text-foreground/80 font-medium'>Demo</p>
            <p>admin@restaurant.com / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
