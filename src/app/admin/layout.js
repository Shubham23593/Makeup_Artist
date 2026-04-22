"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LogOut, Calendar, Image as ImageIcon, LayoutDashboard, Menu } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';

  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  if (isLoginPage) return <div className="min-h-screen bg-gray-50">{children}</div>;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  const navItems = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Bookings', href: '/admin/bookings', icon: Calendar },
    { label: 'Site Images', href: '/admin/images', icon: ImageIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans">
      {/* Sidebar */}
      <aside className={`bg-[#2A2522] text-[#FBF9F6] w-64 flex-shrink-0 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full fixed h-full z-50'}`}>
        <div className="p-6 border-b border-gray-700 font-serif text-xl tracking-widest uppercase">
          Deepali <br/><span className="text-[#C8A97E] text-xs">Admin Panel</span>
        </div>
        <nav className="p-4 space-y-2 flex-grow">
          {navItems.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${active ? 'bg-[#C8A97E] text-[#2A2522]' : 'hover:bg-gray-800'}`}>
                <item.icon size={18} />
                <span className="font-medium tracking-wide text-sm uppercase">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 mt-auto">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-red-400 hover:bg-gray-800 transition-colors">
            <LogOut size={18} />
            <span className="font-medium tracking-wide text-sm uppercase">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm h-16 flex items-center px-4 md:px-8">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="mr-4 lg:hidden">
            <Menu size={24} />
          </button>
          <div className="text-sm text-gray-500 uppercase tracking-widest font-medium">Dashboard</div>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
