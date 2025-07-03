'use client';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // Hide sidebar on root, auth, register, onboarding, and training-plan/new screens
  const hideSidebar =
    pathname === '/' ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/training-plan/new');

  const showSidebar =
    !hideSidebar && (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/training-plan') ||
      pathname.startsWith('/settings') ||
      pathname.startsWith('/reports')
    );

  return showSidebar ? (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  ) : (
    <>{children}</>
  );
} 