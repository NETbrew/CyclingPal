'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Reports', href: '/reports' },
  { label: 'Trainings', href: '/training-plan' },
  { label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="w-56 h-screen bg-gray-900 text-white flex flex-col py-8 px-4">
      <div className="text-2xl font-bold mb-8">CyclingPal</div>
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={`block px-4 py-2 rounded mb-2 ${pathname.startsWith(item.href) ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
} 