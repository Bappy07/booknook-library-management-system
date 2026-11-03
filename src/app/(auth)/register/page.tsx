
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const form = new FormData(event.currentTarget);

    const name = String(form.get("name")).trim();
    const email = String(form.get("email")).trim();
    const image = String(form.get("image")).trim();
    const password = String(form.get("password"));

    if (
      password.length < 6 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password)
    ) {
      setError(
        "Password needs 6 characters, one uppercase and one lowercase letter."
      );
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.signUp.email({
        name,
        email,
        password,
        image: image || undefined,
      });

      if (error) {
        setError(error.message ?? "Registration failed. Please try again.");
        return;
      }

      router.push("/login?registered=true");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] grid md:grid-cols-2 bg-[#F6F3EB]">
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <BookOpen className="text-[#173D32]" size={30} />
            <span className="text-2xl font-bold text-[#173D32]">
              BookNook
            </span>
          </Link>

          <p className="text-sm uppercase tracking-[3px] text-[#C49A62] mb-3">
            Join Our Community
          </p>

          <h1 className="font-heading text-4xl text-[#173D32] mb-3">
            Create your account
          </h1>

          <p className="text-[#777D74] mb-7">
            Start discovering your next favorite book.
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                placeholder="Your full name"
                required
                className="w-full h-12 px-4 rounded-lg border border-[#DED9CD] bg-white outline-none focus:border-[#173D32]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                required
                className="w-full h-12 px-4 rounded-lg border border-[#DED9CD] bg-white outline-none focus:border-[#173D32]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Profile Photo URL
              </label>
              <input
                name="image"
                type="url"
                placeholder="https://example.com/photo.jpg"
                className="w-full h-12 px-4 rounded-lg border border-[#DED9CD] bg-white outline-none focus:border-[#173D32]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                placeholder="Create a password"
                minLength={6}
                required
                className="w-full h-12 px-4 rounded-lg border border-[#DED9CD] bg-white outline-none focus:border-[#173D32]"
              />
              <p className="text-xs text-[#777D74] mt-2">
                Minimum 6 characters, including uppercase and lowercase letters.
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#173D32] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#245343] transition disabled:opacity-60"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="text-center text-sm text-[#777D74] mt-7">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#173D32] hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:block relative min-h-[650px]">
        <Image
          src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&q=90"
          alt="Books and a cozy reading space"
          fill
          priority
          className="object-cover"
          unoptimized
        />

        <div className="absolute inset-0 bg-[#173D32]/70" />

        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
          <p className="text-[#D7B783] uppercase tracking-[4px] text-sm mb-4">
            Read. Discover. Share.
          </p>

          <h2 className="font-heading text-5xl leading-tight mb-5">
            A world of stories is waiting for you.
          </h2>

          <p className="text-white/80 max-w-md leading-relaxed">
            Join BookNook and make reading a part of your everyday life.
            Your next great discovery starts here.
          </p>
        </div>
      </div>
    </div>
  );
}
