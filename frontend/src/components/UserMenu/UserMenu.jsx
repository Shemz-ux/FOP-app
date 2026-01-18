import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { Avatar, AvatarFallback } from '../Ui/Avatar';
import { useAuth } from '../../contexts/AuthContext';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getUserInitials = () => {
    if (user?.name) {
      const nameParts = user.name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return user.name.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserTypeLabel = () => {
    if (user?.userType === 'jobseeker') return 'Jobseeker';
    if (user?.userType === 'society') return 'Society';
    if (user?.userType === 'admin') return user?.role === 'super_admin' ? 'Super Admin' : 'Admin';
    return 'User';
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg transition-colors"
      >
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-lg py-2 z-50 text-left">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">{getUserTypeLabel()}</p>
                <p className="text-xs text-muted-foreground">ID: {user?.userId}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {isAdmin() && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2 hover:bg-secondary transition-colors"
              >
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm text-foreground">Admin Dashboard</span>
              </Link>
            )}

            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-secondary transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="text-sm text-foreground">Dashboard</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-secondary transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span className="text-sm text-foreground">Settings</span>
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-border pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 w-full hover:bg-secondary transition-colors text-left"
            >
              <LogOut className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
