import { Link } from 'react-router-dom';
import { Instagram, Mail, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.jsx';

const CONTACT_EMAIL = 'info@foperspectives.co.uk';

// What someone comes to the site to do, in the order they tend to want it.
const EXPLORE_LINKS = [
  { label: 'Browse Jobs', to: '/jobs' },
  { label: 'Events', to: '/events' },
  { label: 'Webinars', to: '/webinars' },
  { label: 'Career Resources', to: '/resources' },
];

// Who we are and who the platform is for.
const COMPANY_LINKS = [
  { label: 'About Us', to: '/about' },
  { label: 'For Students', to: '/students' },
  { label: 'For Employers', to: '/employers' },
  { label: 'Contact Us', to: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
];

const SOCIAL_LINKS = [
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@foperspectives?_r=1&_t=ZN-93I3RY03p1H',
    Icon: TikTokIcon,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/fo-perspectives/',
    Icon: LinkedInIcon,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/foperspectives?igsh=YWpkYTljdTh4Zmd4&utm_source=qr',
    Icon: Instagram,
  },
];

function TikTokIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function LinkedInIcon({ className = 'w-4 h-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const linkClass = 'text-muted-foreground hover:text-primary text-sm transition-colors';

function FooterLinkColumn({ heading, links }) {
  return (
    <div>
      <h4 className="text-foreground mb-4">{heading}</h4>
      <ul className="space-y-3">
        {links.map(({ label, to }) => (
          <li key={to}>
            <Link to={to} className={linkClass}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const { isLoggedIn } = useAuth();

  return (
    <footer className="bg-secondary/30 bg-card border-t border-border mt-auto print:hidden">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 py-16 text-left">
          {/* Company Info */}
          <div>
            <h3 className="text-foreground mb-4">FO Perspectives</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Bridging the gap between employers and the next generation of early career talent.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-secondary hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterLinkColumn heading="Explore" links={EXPLORE_LINKS} />
          <FooterLinkColumn heading="Company" links={COMPANY_LINKS} />

          {/* Contact Info */}
          <div>
            <h4 className="text-foreground mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                <span>London, United Kingdom</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 flex-shrink-0 text-primary" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-primary transition-colors">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>

            {/* Signed-in users already have these in the navbar, so only show
                the account prompts to visitors who can act on them. */}
            {!isLoggedIn() && (
              <div className="flex items-center gap-4 mt-6">
                <Link to="/signup" className="text-primary hover:underline text-sm">
                  Create an account
                </Link>
                <span aria-hidden="true" className="text-border">|</span>
                <Link to="/login" className={linkClass}>
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FO Perspectives. All rights reserved.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {LEGAL_LINKS.map(({ label, to }) => (
                <Link key={to} to={to} className={linkClass}>
                  {label}
                </Link>
              ))}
              <p className="text-sm text-muted-foreground">Website powered by SD Studios</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
