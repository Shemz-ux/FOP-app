import { Link, useLocation } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Avatar from '../Ui/Avatar.jsx';
import ThemeToggle from '../Ui/ThemeToggle.jsx';

export default function Navbar({
  userName = 'User',
  userImage,
  logo,
  onNotificationClick,
}) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button and Logo */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-foreground" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              {logo || (
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 2L2 7L12 12L22 7L12 2Z"
                      fill="white"
                      fillOpacity="0.9"
                    />
                    <path
                      d="M2 17L12 22L22 17"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2 12L12 17L22 12"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link
                to="/jobs"
                className={`transition-colors ${
                  isActive('/jobs')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Find Jobs
              </Link>
              <Link
                to="/events"
                className={`transition-colors ${
                  isActive('/events')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Events
              </Link>
              <Link
                to="/resources"
                className={`transition-colors ${
                  isActive('/resources')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Resources
              </Link>
              <Link
                to="/students"
                className={`transition-colors ${
                  isActive('/students')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Students
              </Link>
              <Link
                to="/employers"
                className={`transition-colors ${
                  isActive('/employers')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Employers
              </Link>
              <Link
                to="/about"
                className={`transition-colors ${
                  isActive('/about')
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                About Us
              </Link>
            </nav>
          </div>

          {/* Right Section - Always visible */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <button
              onClick={onNotificationClick}
              className="p-2 hover:bg-secondary rounded-lg transition-colors relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>

            {/* User Profile */}
            <Link to="/profile" className="flex items-center gap-3 pl-4 border-l border-border hover:opacity-80 transition-opacity">
              <span className="text-foreground hidden lg:block">{userName}</span>
              <Avatar src={userImage} alt={userName} fallback={userName.charAt(0)} />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-transparent z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Menu Slide-out */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-card border-r border-border transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="p-2 hover:bg-secondary rounded-lg transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6 text-foreground" />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <nav className="flex-1 px-6 py-4">
            <div className="space-y-2">
              <Link
                to="/jobs"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive('/jobs')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                Find Jobs
              </Link>
              <Link
                to="/events"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive('/events')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                Events
              </Link>
              <Link
                to="/resources"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive('/resources')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                Resources
              </Link>
              <Link
                to="/students"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive('/students')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                Students
              </Link>
              <Link
                to="/employers"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive('/employers')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                Employers
              </Link>
              <Link
                to="/about"
                onClick={closeMobileMenu}
                className={`block px-4 py-3 rounded-lg transition-colors ${
                  isActive('/about')
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                About Us
              </Link>
            </div>
          </nav>

        </div>
      </div>
    </header>
  );
}