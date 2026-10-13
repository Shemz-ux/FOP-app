import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, Settings, ShieldCheck, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '../Ui/Avatar';
import { useAuth } from '../../contexts/AuthContext';

const itemClass =
  'flex items-center gap-3 w-full px-3 py-2.5 rounded-2xl transition-colors hover:bg-secondary/70';

const iconTileClass =
  'flex items-center justify-center shrink-0 size-9 rounded-xl bg-secondary text-muted-foreground';

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

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
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

  const displayName = user?.name || user?.first_name || 'Account';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1.5 rounded-2xl transition-colors hover:bg-secondary/70"
      >
        <Avatar className="size-8">
          <AvatarFallback className="bg-primary/15 text-primary text-xs font-medium">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        {/* Folds to the avatar alone below lg, where the nav links leave no room for a name */}
        <span className="hidden lg:block max-w-[120px] xl:max-w-[160px] truncate text-sm lg:text-base font-medium text-foreground tracking-[-0.15px]">
          {displayName}
        </span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-[286px] p-2 z-50 text-left rounded-[24px] border border-border bg-popover/95 backdrop-blur-[24px] shadow-2xl shadow-black/40"
        >
          {/* Signed-in user */}
          <div className="flex items-center gap-3 p-3">
            <Avatar className="size-10">
              <AvatarFallback className="bg-primary/15 text-primary text-sm">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm text-foreground tracking-[-0.15px]">{displayName}</p>
              <p className="text-xs text-muted-foreground">Signed in</p>
            </div>
          </div>

          <div className="mx-2 mt-1 h-px bg-border" />

          {/* Menu items */}
          <div className="mt-1">
            {isAdmin() ? (
              <Link to="/admin" onClick={() => setIsOpen(false)} className={itemClass} role="menuitem">
                <span className={iconTileClass}>
                  <ShieldCheck className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-foreground tracking-[-0.15px]">Admin console</span>
                  <span className="block text-xs text-muted-foreground">Manage jobs, events &amp; more</span>
                </span>
              </Link>
            ) : (
              <Link to="/profile" onClick={() => setIsOpen(false)} className={itemClass} role="menuitem">
                <span className={iconTileClass}>
                  <LayoutDashboard className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-foreground tracking-[-0.15px]">Dashboard</span>
                  <span className="block text-xs text-muted-foreground">Your saved items &amp; activity</span>
                </span>
              </Link>
            )}

            <Link to="/settings" onClick={() => setIsOpen(false)} className={itemClass} role="menuitem">
              <span className={iconTileClass}>
                <Settings className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-foreground tracking-[-0.15px]">Settings</span>
                <span className="block text-xs text-muted-foreground">Account &amp; preferences</span>
              </span>
            </Link>
          </div>

          <div className="mx-2 mt-1 h-px bg-border" />

          {/* Log out */}
          <button
            onClick={handleLogout}
            role="menuitem"
            className={`${itemClass} mt-1 text-muted-foreground hover:text-destructive`}
          >
            <span className="flex items-center px-2.5">
              <LogOut className="size-4" />
            </span>
            <span className="text-sm tracking-[-0.15px]">Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
