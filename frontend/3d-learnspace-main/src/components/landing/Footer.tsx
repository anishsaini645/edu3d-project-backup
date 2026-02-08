import { BookOpen, Mail, MapPin, Phone, Globe, Accessibility } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerLinks = {
  Product: [
    { label: '3D Library', href: '/library' },
    { label: 'For Students', href: '/dashboard' },
    { label: 'For Teachers', href: '/teacher' },
    { label: 'Pricing', href: '/pricing' },
  ],
  Subjects: [
    { label: 'Science', href: '/library?subject=science' },
    { label: 'Mathematics', href: '/library?subject=math' },
    { label: 'Engineering', href: '/library?subject=engineering' },
    { label: 'Medical', href: '/library?subject=medical' },
  ],
  Support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Community', href: '/community' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Accessibility', href: '/accessibility' },
  ],
};

const languages = ['English', 'हिंदी', 'தமிழ்', 'తెలుగు', 'ಕನ್ನಡ'];

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-accent to-secondary flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">Edu3D</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              Making education interactive and immersive through 3D visualization technology.
            </p>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <a href="mailto:hello@edu3d.in" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Mail className="w-4 h-4" />
                hello@edu3d.in
              </a>
              <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Phone className="w-4 h-4" />
                +91 123 456 7890
              </a>
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Bangalore, India
              </span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Accessibility & Language */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Accessibility className="w-4 h-4" />
              Accessibility Options
            </button>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <select className="bg-transparent text-sm text-muted-foreground border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary">
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Edu3D. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
