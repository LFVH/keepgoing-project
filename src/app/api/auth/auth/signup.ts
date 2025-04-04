'use server';

import {
  FormState,
  SignupFormSchema,
} from '@/app/api/auth/auth/definitions';
import bcrypt from 'bcryptjs';
import Prisma from '@/database/prisma';

export async function signup(
  state: FormState,
  formData: FormData,
): Promise<FormState> {

  const validatedFields = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. Prepare data for insertion into database
  const { name, email, password } = validatedFields.data;

  // 3. Check if the user's email already exists
  const existingUser = await Prisma.usuario.findFirst({
    where: {
      email: validatedFields.data.email,
    }, 
  });

  if (existingUser) {
    return {
      message: 'Email already exists, please use a different email or login.',
    };
  }

  // Hash the user's password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Insert the user into the database or call an Auth Provider's API
  const userDB = await Prisma.usuario.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  if (!userDB) {
    return {
      message: 'An error occurred while creating your account.',
    };
  }

  // 4. Create a session for the user
  const userId = userDB.id.toString();
  return {data:{
      name: userDB.name,
      email: userDB.email,
      password: userDB.password, 
      id: userDB.id,
    }
  }
}