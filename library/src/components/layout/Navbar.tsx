
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, BookOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import UserMenu from "@/components/auth/UserMenu";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const isLoggedIn = !!session?.user;

  const publicLinks = [
    { name: "Home", href: "/" },
    { name: "All Books", href: "/books" },
  ];

  const privateLinks = [
    { name: "Add Book", href: "/add-book" },
    { name: "My Books", href: "/my-books" },
    { name: "My Borrows", href: "/my-borrows" },
  ];

  const links = isLoggedIn
    ? [...publicLinks, ...privateLinks]
    : publicLinks;

  return (
    <header className="sticky top-0 z-50 bg-[#FFFEFA] border-b border-[#DED9CD]">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <BookOpen size={30} className="text-[#173D32]" />
          <span className="text-2xl font-bold text-[#173D32]">
            BookNook
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-[#26332D] hover:text-[#C49A62] transition"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth */}
        <div className="hidden lg:flex items-center gap-3">
          {!isPending && (
            isLoggedIn ? (
              <UserMenu />
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-[#173D32] hover:text-[#C49A62]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-[#173D32] text-white rounded-lg text-sm font-medium hover:bg-[#245343] transition"
                >
                  Get Started
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-[#173D32]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#FFFEFA] border-t border-[#DED9CD] px-6 py-5 space-y-4">

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-[#26332D] hover:text-[#C49A62]"
            >
              {link.name}
            </Link>
          ))}

          {!isPending && (
            isLoggedIn ? (
              <div className="pt-3 border-t border-[#DED9CD]">
                <UserMenu />
              </div>
            ) : (
              <div className="flex gap-3 pt-3 border-t border-[#DED9CD]">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 border border-[#173D32] text-[#173D32] rounded-lg"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center py-2 bg-[#173D32] text-white rounded-lg"
                >
                  Register
                </Link>
              </div>
            )
          )}

        </div>
      )}
    </header>
  );
}
