import { Gender, UserRole } from '@prisma/client';
import NextAuth, { type DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
  gender: Gender;
  description: string;
  status: string;
  bannerImage: string;
};

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser;
  }
}
