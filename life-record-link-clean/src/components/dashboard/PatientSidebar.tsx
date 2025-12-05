import { Heart, LayoutDashboard, Clock, Upload, Users, Settings, LogOut, Sparkles } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/patient/dashboard' },
  { icon: Clock, label: 'Timeline', path: '/patient/timeline' },
  { icon: Upload, label: 'Upload Records', path: '/patient/upload' },
  { icon: Users, label: 'Doctor Access', path: '/patient/access' },
  { icon: Sparkles, label: 'AI Summary', path: '/patient/ai-summary' },
  { icon: Settings, label: 'Settings', path: '/patient/settings' },
];

export const PatientSidebar = () => {
  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
            <Heart className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">MediTrack</span>
        </NavLink>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground transition-all duration-200",
                  "hover:bg-primary/5 hover:text-foreground"
                )}
                activeClassName="bg-primary/10 text-primary font-medium"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User section */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-4 px-4">
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-primary-foreground font-semibold">
            AJ
          </div>
          <div>
            <div className="font-medium text-sm">Alex Johnson</div>
            <div className="text-xs text-muted-foreground">Patient</div>
          </div>
        </div>
        
        <NavLink
          to="/auth"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </NavLink>
      </div>
    </aside>
  );
};
