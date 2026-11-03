
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { User, LogOut, ChevronDown } from "lucide-react";

export default function UserMenu() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);

  if (!session?.user) return null;

  const user = session.user;

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-[#DED9CD] bg-white p-1.5 pr-3"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[#173D32] text-white flex items-center justify-center">
            <User size={18} />
          </div>
        )}

        <span className="text-sm font-medium text-[#173D32] max-w-24 truncate">
          {user.name}
        </span>

        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-14 w-48 rounded-xl border border-[#DED9CD] bg-white p-2 shadow-lg z-50">

          <div className="px-3 py-2 border-b border-[#DED9CD]">
            <p className="font-medium text-sm text-[#173D32]">
              {user.name}
            </p>
            <p className="text-xs text-[#777D74] truncate">
              {user.email}
            </p>
          </div>

          <Link
            href="/my-profile"
            onClick={() => setOpen(false)}
            className="block px-3 py-2 text-sm rounded-lg hover:bg-[#F6F3EB]"
          >
            My Profile
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
          >
            <LogOut size={16} />
            Logout
          </button>

        </div>
      )}
    </div>
  );
}
