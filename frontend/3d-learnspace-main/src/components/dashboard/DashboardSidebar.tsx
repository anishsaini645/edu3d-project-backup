import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Library,
  ClipboardList,
  Users,
  Trophy,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ---------- MENUS ---------- */

const studentNavItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen, label: 'My Subjects', href: '/dashboard/subjects' },
  { icon: Library, label: '3D Model Library', href: '/library' },
  { icon: ClipboardList, label: 'Assignments', href: '/dashboard/assignments' },
  { icon: Users, label: 'Collaboration Room', href: '/dashboard/collaboration' },
  { icon: Trophy, label: 'Achievements', href: '/dashboard/achievements' },
];

const teacherNavItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Upload, label: 'Upload 3D Model', href: '/dashboard/upload' },
  { icon: Library, label: 'My Models', href: '/dashboard/models' },
  { icon: ClipboardList, label: 'Assignments', href: '/dashboard/assignments' },
  { icon: Users, label: 'Students', href: '/dashboard/students' },
];

/* ---------- COMPONENT ---------- */

interface DashboardSidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  // 🔥 ROLE CHECK HERE
  const role = localStorage.getItem('role');
  const navItems = role === 'teacher' ? teacherNavItems : studentNavItems;

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col z-40',
        className
      )}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold gradient-text"
            >
              Edu3D
            </motion.span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center hover:bg-sidebar-accent/80 transition-colors"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn('nav-item', isActive && 'active')}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 border-t border-sidebar-border space-y-2">
        <Link to="/settings" className="nav-item">
          <Settings className="w-5 h-5" />
          {!collapsed && <span>Settings</span>}
        </Link>

        <button
          className="nav-item w-full text-left"
          onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
}
