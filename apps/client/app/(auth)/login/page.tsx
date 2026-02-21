'use client';

import ThemeToggle from '@/components/theme-toggle';
import { useLogin } from '@/hooks/use-auth';

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
import { LoaderPinwheelIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FieldValues, useForm } from 'react-hook-form';

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: 'admin@restaurant.com',
      password: 'admin123',
    },
  });

  const onSubmit = async (data: FieldValues) => {
    try {
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      toast.success('Login successful!');
      router.replace('/');
    } catch (err: unknown) {
      toast.error('Login failed. Please check your credentials and try again.');
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
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                placeholder='Enter your email'
                {...register('email', { required: 'Email is required' })}
                disabled={loginMutation.isPending}
                className='h-10'
              />
              {errors.email && (
                <p className='text-sm text-red-500'>{errors.email.message}</p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='Enter your password'
                {...register('password', { required: 'Password is required' })}
                disabled={loginMutation.isPending}
                className='h-10'
              />
              {errors.password && (
                <p className='text-sm text-red-500'>
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              type='submit'
              className='h-10 w-full font-medium'
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <>
                  <LoaderPinwheelIcon className='mr-2 h-4 w-4 animate-spin' />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          <div className='bg-muted/50 text-muted-foreground mt-5 rounded-lg px-3 py-2 text-center text-xs'>
            <p className='text-foreground/80 font-medium'>
              Testing Credentials
            </p>
            <p>admin@restaurant.com / admin123</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
