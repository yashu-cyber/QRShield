"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { label: "History", href: "/history" },
  { label: "How It Works", href: "/how-it-works" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="nav-inner">
        <Link
          className="brand"
          href="/"
          onClick={() => setIsOpen(false)}
        >
          <span className="brand-mark">QS</span>
          QRSHIELD
        </Link>

        <button
          className="mobile-menu"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "×" : "="}
        </button>

        <nav
          className={`nav-links${isOpen ? " open" : ""}`}
          aria-label="Primary navigation"
        >
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                className={`nav-link${isActive ? " active" : ""}`}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}