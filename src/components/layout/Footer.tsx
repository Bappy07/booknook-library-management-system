import Link from "next/link";
import {
  BookOpen,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
} from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "All Books", href: "/books" },
  { name: "Login", href: "/login" },
  { name: "Register", href: "/register" },
];

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
];

export default function Footer() {
  return (
    <footer className="bg-[#173D32] text-[#F6F3EB]">
      <div className="mx-auto max-w-7xl px-5 pb-8 pt-20 md:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 gap-12 border-b border-white/15 pb-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#C49A62] text-[#173D32]">
                <BookOpen size={25} strokeWidth={1.7} />
              </div>

              <div>
                <h2 className="font-heading text-2xl font-semibold">
                  BookNook
                </h2>
                <p className="text-[9px] tracking-[0.2em] text-white/55">
                  READ. DISCOVER. SHARE.
                </p>
              </div>
            </Link>

            <p className="mt-7 max-w-xs text-sm leading-7 text-white/60">
              A little corner for curious minds. Discover meaningful
              stories, borrow books, and make reading a part of your life.
            </p>

          <div className="mt-7 flex gap-3">
            {["Facebook", "Instagram", "Twitter"].map((social) => (
                <a
                key={social}
                href="#"
                aria-label={social}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/70 transition-all hover:border-[#C49A62] hover:bg-[#C49A62] hover:text-[#173D32]"
                >
                <ExternalLink size={17} />
                </a>
            ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-7 text-xs font-semibold tracking-[0.2em] text-[#C49A62]">
              QUICK LINKS
            </h3>

            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-[#C49A62]"
                  >
                    {link.name}
                    <ArrowUpRight
                      size={13}
                      className="opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="mb-7 text-xs font-semibold tracking-[0.2em] text-[#C49A62]">
              EXPLORE CATEGORIES
            </h3>

            <ul className="space-y-4">
              {categories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/books?category=${category}`}
                    className="text-sm text-white/65 transition-colors hover:text-[#C49A62]"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-7 text-xs font-semibold tracking-[0.2em] text-[#C49A62]">
              GET IN TOUCH
            </h3>

            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-sm text-white/65">
                <Mail size={17} className="mt-0.5 shrink-0 text-[#C49A62]" />
                <span>hello@booknook.com</span>
              </li>

              <li className="flex items-start gap-3 text-sm text-white/65">
                <Phone size={17} className="mt-0.5 shrink-0 text-[#C49A62]" />
                <span>+880 1XXX-XXXXXX</span>
              </li>

              <li className="flex items-start gap-3 text-sm text-white/65">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[#C49A62]" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>

            <p className="mt-7 text-xs leading-6 text-white/40">
              Have a question or suggestion? We'd love to hear from you.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col items-center justify-between gap-4 pt-7 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/45">
            © 2026 BookNook. All rights reserved.
          </p>

          <p className="font-heading text-sm italic text-[#C49A62]">
            Every book opens a new door.
          </p>

          <Link
            href="/"
            className="text-xs text-white/55 transition-colors hover:text-[#C49A62]"
          >
            Back to top ↑
          </Link>
        </div>
      </div>
    </footer>
  );
}