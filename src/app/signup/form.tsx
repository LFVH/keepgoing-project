'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { signup } from '@/app/api/auth/auth/signup';
import { useFormStatus } from 'react-dom';
import { useActionState, useState } from 'react';
import { signIn } from "next-auth/react"
interface SignupFormProps {
  onLoginSuccess: () => void;
}
export function SignupForm({ onLoginSuccess }: SignupFormProps) {
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    // Chama a Server Action manualmente
    const result = await signup(undefined, formData);

    setIsLoading(false);

    if (result?.errors) {
      setErrors({
        email: result.errors.email?.[0],
        password: result.errors.password?.[0],
        name: result.errors.name?.[0],
      });
      return;
    }

    if (result?.message) {
      setErrors({ general: result.message });
      return;
    }

    // Se o signup for bem-sucedido, faz login automático
    await signIn("credentials", {
      email: result?.data?.email,
      password: formData.get("password"),
      redirect: false,
    });

    onLoginSuccess();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="John Doe" />
        </div>
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="john@example.com" />
        </div>
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" />
        </div>
        {errors.password && (
          <div className="text-sm text-red-500">
            <p>Password must:</p>
            <ul>
             {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </ul>
          </div>
        )}
        
        {errors.general && <p className="text-sm text-red-500">{errors.general}</p>}

        <SignupButton isLoading={isLoading} />
      </div>
    </form>
  );
}

export function SignupButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button disabled={isLoading} type="submit" className="mt-2 w-full">
      {isLoading ? "Submitting..." : "Sign Up"}
    </Button>
  );
}