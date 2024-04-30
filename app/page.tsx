import { Poppins } from 'next/font/google';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LoginButton } from '@/components/auth/login-button';

const font = Poppins({
  subsets: ['latin'],
  weight: ['600'],
});

export default function Home() {
  return (
    <main
      className="
    flex
    h-full
    flex-col
    items-center
    justify-center
    bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 to-slate-800
    ">
      <div className="space-y-6 text-center">
        <h1 className={cn('text-6xl font-semibold text-white drop-shadow-md', font.className)}>
          connectX
        </h1>
        <p
          className="
          text-white
          text-lg
          ">
          Let&apos;s start!
        </p>
        <div>
          <LoginButton asChild>
            <Button variant="primary" size="lg">
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
