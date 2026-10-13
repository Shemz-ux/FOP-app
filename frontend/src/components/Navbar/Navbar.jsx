import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import UserMenu from '../UserMenu/UserMenu.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';

// The source file is mostly empty artboard, so Cloudinary trims it to the mark
// (e_trim) and delivers it navbar-sized rather than shipping the 99KB original.
const FOP_LOGO_SRC =
  'https://res.cloudinary.com/dcoilkm8r/image/upload/e_trim/w_280,f_auto,q_auto/v1791928309/FOP_logos-07_iukaj8.png';

const NAV_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Employers', to: '/employers' },
  { label: 'Students', to: '/students' },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Resources', to: '/resources' },
  { label: 'Events', to: '/events' },
  { label: 'Webinars', to: '/webinars' },
];

// The wordmark is 2.5:1, so it is sized by height and left to find its own width.
const FopLogo = ({ className = 'h-7' }) => (
  <img src={FOP_LOGO_SRC} alt="FP Perspectives" className={`w-auto ${className}`} />
);

export default function Navbar({ logo }) {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const mobileLinkClass = (path) =>
    `flex items-center gap-2 px-4 py-3 rounded-2xl transition-colors ${
      isActive(path)
        ? 'bg-primary/15 text-primary'
        : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
    }`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 py-3 sm:px-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between gap-4 pl-4 pr-2 py-[11px] rounded-[24px] border border-border bg-card/75 backdrop-blur-[24px] shadow-lg shadow-black/20">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0 ml-2" aria-label="Home">
            {logo || <FopLogo />}
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-0.5 lg:gap-1">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={`px-2.5 lg:px-3.5 py-2 rounded-2xl text-sm lg:text-base tracking-[-0.15px] transition-colors ${
                  isActive(to)
                    ? 'bg-primary/15 text-primary'
                    : 'text-muted-foreground hover:bg-secondary/70 hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-1 shrink-0">
            {isLoggedIn() ? (
              <UserMenu />
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-2xl text-primary-foreground text-sm lg:text-base font-medium transition-colors hover:bg-secondary/70"
              >
                <LogIn className="size-4" />
                <span>Log In</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-2xl text-foreground transition-colors hover:bg-secondary/70"
              aria-label="Open menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile menu slide-out */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] p-3 z-50 md:hidden transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full rounded-[24px] border border-border bg-popover/95 backdrop-blur-[24px] shadow-2xl shadow-black/40 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between gap-4 p-4 border-b border-border">
            <Link to="/" onClick={closeMobileMenu} className="flex items-center" aria-label="Home">
              <FopLogo />
            </Link>
            <button
              onClick={closeMobileMenu}
              className="p-2.5 rounded-2xl text-foreground transition-colors hover:bg-secondary/70"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="flex-1 overflow-y-auto p-3">
            <div className="space-y-1 text-left">
              {isAdmin() && (
                <Link
                  to="/admin"
                  onClick={closeMobileMenu}
                  className={mobileLinkClass('/admin')}
                >
                  <Shield className="size-5" />
                  Admin Dashboard
                </Link>
              )}

              <Link to="/" onClick={closeMobileMenu} className={mobileLinkClass('/')}>
                Home
              </Link>

              {NAV_LINKS.map(({ label, to }) => (
                <Link key={to} to={to} onClick={closeMobileMenu} className={mobileLinkClass(to)}>
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
