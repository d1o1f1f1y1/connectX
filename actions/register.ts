'use server';

import bcrypt from 'bcryptjs';

import { db } from '@/lib/db';

import * as z from 'zod';

import { RegisterSchema } from '@/schemas';
import { getUserByEmail } from '@/data/user';

import { sendVerificationEmail } from '@/lib/mail';

import { generateVerificationToken } from '@/lib/tokens';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' };
  }

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'Email already in use!' };
  }

  await db.user.create({
    data: {
      image: 'https://i.pinimg.com/564x/7d/ce/0c/7dce0c6c1aaf069312ef1b41fbd7a026.jpg',
      name,
      email,
      password: hashedPassword,
    },
  });

  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Confirmation email sent!' };
};
