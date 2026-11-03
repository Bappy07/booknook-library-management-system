
"use client";

import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { User, Mail, BookOpen } from "lucide-react";

export default function MyProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#173D32]">
        Loading profile...
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="font-heading text-3xl text-[#173D32]">
          Please sign in
        </h1>
        <Link
          href="/login"
          className="bg-[#173D32] text-white px-6 py-3 rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="min-h-[75vh] bg-[#F6F3EB] px-6 py-16">
      <div className="max-w-3xl mx-auto">

        <p className="text-sm uppercase tracking-[3px] text-[#C49A62] mb-3">
          Your Account
        </p>

        <h1 className="font-heading text-4xl text-[#173D32] mb-10">
          My Profile
        </h1>

        <div className="bg-white border border-[#DED9CD] rounded-2xl p-8">

          <div className="flex flex-col sm:flex-row items-center gap-5 pb-8 border-b border-[#DED9CD]">

            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={100}
                height={100}
                unoptimized
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-[#173D32] text-white flex items-center justify-center">
                <User size={38} />
              </div>
            )}

            <div className="text-center sm:text-left">
              <h2 className="font-heading text-2xl text-[#173D32]">
                {user.name}
              </h2>
              <p className="text-sm text-[#777D74]">
                BookNook Member
              </p>
            </div>
          </div>

          <div className="space-y-6 pt-8">

            <div className="flex items-center gap-4">
              <User className="text-[#C49A62]" />
              <div>
                <p className="text-xs text-[#777D74]">Full Name</p>
                <p className="font-medium text-[#26332D]">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="text-[#C49A62]" />
              <div>
                <p className="text-xs text-[#777D74]">Email Address</p>
                <p className="font-medium text-[#26332D]">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <BookOpen className="text-[#C49A62]" />
              <div>
                <p className="text-xs text-[#777D74]">Membership</p>
                <p className="font-medium text-[#26332D]">BookNook Member</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
