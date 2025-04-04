'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { LoginFormSchema } from '@/app/api/auth/auth/definitions';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export const LoginForm = ({ onLoginSuccess }: LoginFormProps) => {
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const validatedFields = LoginFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!validatedFields.success) {
      const fieldErrors = validatedFields.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      setIsLoading(false);
      return;
    }

    const { email, password } = validatedFields.data;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setIsLoading(false);

    if (result?.error) {
      setErrors((prev) => ({ ...prev, general: result.error ?? 'Login failed' }));
    } else {
      onLoginSuccess();
    }
  };

  return (
    
    <form onSubmit={handleSubmit}>
      <div className="bg-red-500 p-4 text-white">Teste Tailwind</div>
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="m@example.com" type="email" required />
          {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link className="text-sm underline" href="#">
              Forgot your password?
            </Link>
          </div>
          <Input id="password" type="password" name="password" required />
          {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
        </div>
        {errors.general && (
          <p className="text-sm text-red-500">{errors.general}</p>
        )}
        <LoginButton isLoading={isLoading} />
      </div>
    </form>
  );
};

export function LoginButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button disabled={isLoading} type="submit" className="mt-4 w-full">
      {isLoading ? 'Submitting...' : 'Sign in'}
    </Button>
  );
}
