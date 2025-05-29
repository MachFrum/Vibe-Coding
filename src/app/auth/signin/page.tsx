
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label'; // Label is part of FormLabel
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '@/lib/firebase'; // Using real functions
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Chrome } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { FirebaseError } from 'firebase/app';

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);
    try {
      const userCredential = await doSignInWithEmailAndPassword(data.email, data.password);
      if (userCredential && userCredential.user) {
        toast({
          title: 'Signed In',
          description: `Welcome back, ${userCredential.user.email}!`,
        });
        router.push('/dashboard');
      }
    } catch (error) {
      let errorMessage = 'Failed to sign in. Please check your credentials.';
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as FirebaseError;
        // More specific error messages based on Firebase error codes
        if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password' || firebaseError.code === 'auth/invalid-credential') {
          errorMessage = 'Invalid email or password.';
        } else {
          errorMessage = firebaseError.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const userCredential = await doSignInWithGoogle();
      if (userCredential && userCredential.user) {
        toast({
          title: 'Signed In with Google',
          description: `Welcome, ${userCredential.user.displayName || userCredential.user.email}!`,
        });
        router.push('/dashboard');
      }
    } catch (error) {
       let errorMessage = 'Failed to sign in with Google. Please try again.';
       if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as FirebaseError;
        if (firebaseError.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Sign-in popup closed before completion.';
        } else {
          errorMessage = firebaseError.message;
        }
      } else if (error instanceof Error) {
         errorMessage = error.message;
       }
      toast({
        variant: 'destructive',
        title: 'Google Sign In Failed',
        description: errorMessage,
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Sign In to MaliTrack</CardTitle>
          <CardDescription>Enter your credentials or sign in with Google.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading || isGoogleLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Sign In
              </Button>
            </form>
          </Form>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading || isGoogleLoading}>
            {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Chrome className="mr-2 h-4 w-4" />}
            Sign In with Google
          </Button>

        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
