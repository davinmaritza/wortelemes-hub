import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full py-6 opacity-0 animate-fade-in" style={{ animationFillMode: 'forwards', animationDelay: '200ms' }}>
      <nav className="container mx-auto px-4 flex items-center justify-center gap-8 text-sm font-body tracking-wide">
        <Link 
          to="/about"
          className={`nav-link ${isActive('/about') ? 'active' : ''}`}
        >
          About
        </Link>
        <Link 
          to="/videos"
          className={`nav-link ${isActive('/videos') ? 'active' : ''}`}
        >
          Videos
        </Link>
        <Link 
          to="/"
          className="nav-link font-display text-xl font-medium tracking-wider"
        >
          Wortelemes
        </Link>
        <Link 
          to="/portfolio"
          className={`nav-link ${isActive('/portfolio') ? 'active' : ''}`}
        >
          Portfolio
        </Link>
        <Link 
          to="/contact"
          className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
        >
          Contact
        </Link>
      </nav>
    </header>
  );
};

export default Header;
