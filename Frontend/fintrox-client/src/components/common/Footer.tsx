import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant w-full">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 px-gutter max-w-7xl mx-auto">
        {/* Brand Column */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container text-2xl icon-fill-1">
              account_balance
            </span>
            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Fintrox
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">
            Enterprise finance management, simplified.
          </p>
        </div>

        {/* Legal */}
        <div className="flex flex-col gap-3">
          <h4 className="font-label-md text-label-md text-on-surface mb-2">Legal</h4>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80" href="#">
            Privacy Policy
          </a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80" href="#">
            Terms of Service
          </a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80" href="#">
            Security
          </a>
        </div>

        {/* Product */}
        <div className="flex flex-col gap-3">
          <h4 className="font-label-md text-label-md text-on-surface mb-2">Product</h4>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80" href="#">
            Features
          </a>
          <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80" to="/login">
            Login
          </Link>
          <Link className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80" to="/register">
            Get Started
          </Link>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-3">
          <h4 className="font-label-md text-label-md text-on-surface mb-2">Company</h4>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80" href="#">
            About Us
          </a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-opacity hover:opacity-80" href="#">
            Contact
          </a>
        </div>
      </div>

      <div className="border-t border-outline-variant/30 py-6 px-gutter">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body-md text-body-md text-on-surface-variant">
            © 2024 Fintrox Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;