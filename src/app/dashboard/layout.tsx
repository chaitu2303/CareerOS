import { ReactNode } from 'react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Sidebar } from '@/components/layout/Sidebar';
import { Bell, UserCircle } from 'lucide-react';
import Link from 'next/link';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/');
  }

  // Fetch user data including gamification stats
  const dbUser = await prisma.user.findUnique({
    where: { email: authUser.email! },
    include: {
      streakRecord: true,
      xpRecord: true,
    }
  });

  const streak = dbUser?.streakRecord?.currentStreak ?? 0;
  const xp = dbUser?.xpRecord?.totalXp ?? 0;
  const level = dbUser?.xpRecord?.currentLevel ?? 1;
  const userName = dbUser?.name ?? authUser.email?.split('@')[0] ?? 'Member';

  return (
    <div className="flex h-screen bg-muted/10 overflow-hidden">
      <Sidebar userName={userName} streak={streak} xp={xp} level={level} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen">
        {/* Top Bar */}
        <header className="h-14 border-b bg-card flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
          {/* spacer for mobile hamburger */}
          <div className="w-10 md:w-0" />
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Link href="/dashboard/notifications" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link href="/settings" className="flex items-center gap-2 pl-3 border-l">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <UserCircle className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium hidden sm:block">{userName}</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
