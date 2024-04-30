import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';
import { ModalProvider } from '@/components/providers/modal-provider';
import { SocketProvider } from '@/components/providers/socket-provider';
import QueryProvider from '@/components/providers/query-provider';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';
import { Toaster } from 'sonner';

const font = Open_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'connectX',
  description: 'connectX App',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(font.className, 'bg-white dark:bg-[#313338]')}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme">
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>
                <Toaster />
                {children}
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
