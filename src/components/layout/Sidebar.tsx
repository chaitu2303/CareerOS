'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, UserCircle, Database, Briefcase, FileText,
  Code2, Brain, BarChart3, Trophy, Settings, ChevronRight,
  GraduationCap, FlameKindling, Zap, BookOpen, Target,
  MonitorCheck, Menu, X, FileCog
} from 'lucide-react';

const navGroups = [
  {
    label: 'Core',
    items: [
      { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard, exact: true },
      { href: '/dashboard/profile', label: 'Master Profile', icon: UserCircle },
      { href: '/dashboard/memory', label: 'Career Memory', icon: Database },
    ]
  },
  {
    label: 'Career Intelligence',
    items: [
      { href: '/dashboard/jobs', label: 'Job Intelligence', icon: Briefcase },
      { href: '/dashboard/resumes', label: 'Resume Studio', icon: FileText },
      { href: '/dashboard/applications', label: 'Applications', icon: Target },
    ]
  },
  {
    label: 'Practice',
    items: [
      { href: '/dashboard/assess', label: 'Assessments', icon: MonitorCheck },
      { href: '/dashboard/code', label: 'Coding Arena', icon: Code2 },
      { href: '/dashboard/interview', label: 'Mock Interviews', icon: Brain },
    ]
  },
  {
    label: 'Progress',
    items: [
      { href: '/dashboard/analytics', label: 'Performance', icon: BarChart3 },
      { href: '/dashboard/achievements', label: 'Achievements', icon: Trophy },
      { href: '/dashboard/learn', label: 'Learning Paths', icon: BookOpen },
    ]
  }
];

interface SidebarProps {
  userName?: string;
  streak?: number;
  xp?: number;
  level?: number;
}

export function Sidebar({ userName, streak = 0, xp = 0, level = 1 }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">CareerOS</span>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-1 rounded-md hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User Mini Stats */}
      <div className="px-4 py-3 border-b bg-muted/20">
        <div className="text-xs text-muted-foreground mb-2 truncate">
          {userName || 'Career Member'}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1 font-medium">
            <FlameKindling className="w-3.5 h-3.5 text-orange-500" />
            <span>{streak}d streak</span>
          </div>
          <div className="flex items-center gap-1 font-medium">
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
            <span>Lv.{level}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>{xp.toLocaleString()} XP</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
        {navGroups.map(group => (
          <div key={group.label}>
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 px-2 mb-1.5">
              {group.label}
            </div>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium transition-all ${
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                    {active && <ChevronRight className="w-3 h-3 ml-auto" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t p-3 space-y-0.5">
        <Link
          href="/dashboard/tools"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all"
        >
          <FileCog className="w-4 h-4" />
          <span>Document Tools</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all"
        >
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-60 border-r bg-card hidden md:flex flex-col shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-card border rounded-lg shadow-md"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-card border-r shadow-2xl flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
