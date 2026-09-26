import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const LandingNav: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 64;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
    }
  };

  const navLinks = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How it Works' },
    { id: 'dashboards', label: 'Dashboards' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 bg-white border-b transition-all ${
        isScrolled ? 'border-[#E5E9EB] shadow-sm' : 'border-transparent'
      }`}
    >
      <div className="h-16 max-w-[1280px] mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#2D6A4F] flex items-center justify-center">
            <span className="text-white font-bold text-sm leading-none">F</span>
          </div>
          <span className="font-semibold text-[#0F1419] text-lg tracking-tight">
            Fintrox
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className="text-[15px] text-[#5A6A72] hover:text-[#0F1419] transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-5">
          <Link
            to="/login"
            className="text-[15px] text-[#5A6A72] hover:text-[#0F1419] transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="h-9 px-4 rounded bg-[#2D6A4F] text-white text-[14px] font-semibold flex items-center justify-center hover:bg-[#1B4332] transition-colors"
          >
            Get started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden flex h-10 w-10 items-center justify-center rounded text-[#0F1419] hover:bg-[#F4F6F8]"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">
            {isMobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E9EB] bg-white">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className="block w-full text-left px-3 py-3 text-[15px] text-[#5A6A72] hover:bg-[#F8FAFB] rounded transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-3 border-t border-[#E5E9EB] space-y-2">
              <Link
                to="/login"
                className="block w-full px-3 py-3 text-[15px] text-[#5A6A72] hover:bg-[#F8FAFB] rounded text-center transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="block w-full px-3 py-3 rounded bg-[#2D6A4F] text-white text-[15px] font-semibold text-center hover:bg-[#1B4332] transition-colors"
              >
                Get started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default LandingNav;