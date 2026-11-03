
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(event.currentTarget);

    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));

    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setError(String(error.message || "Login failed. Please try again."));
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] grid md:grid-cols-2 bg-[#F6F3EB]">

      {/* Login Form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <Link href="/" className="flex items-center gap-2 mb-8">
            <BookOpen className="text-[#173D32]" size={30} />
            <span className="text-2xl font-bold text-[#173D32]">
              BookNook
            </span>
          </Link>

          <p className="text-sm uppercase tracking-[3px] text-[#C49A62] mb-3">
            Welcome Back
          </p>

          <h1 className="font-heading text-4xl text-[#173D32] mb-3">
            Sign in to your account
          </h1>

          <p className="text-[#777D74] mb-7">
            Continue your reading journey with BookNook.
          </p>

          <form onSubmit={handleLogin} className="space-y-5">

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
                Password
              </label>

              <input
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="w-full h-12 px-4 rounded-lg border border-[#DED9CD] bg-white outline-none focus:border-[#173D32]"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#173D32] text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#245343] transition disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
              {!loading && <ArrowRight size={18} />}
            </button>

          </form>

          <p className="text-center text-sm text-[#777D74] mt-7">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#173D32] hover:underline"
            >
              Create Account
            </Link>
          </p>

        </div>
      </div>

      {/* Right Image */}
      <div className="hidden md:block relative min-h-[650px]">

        <Image
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=90"
          alt="Beautiful library interior"
          fill
          priority
          unoptimized
          className="object-cover"
        />

        <div className="absolute inset-0 bg-[#173D32]/70" />

        <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">

          <p className="text-[#D7B783] uppercase tracking-[4px] text-sm mb-4">
            Read. Discover. Share.
          </p>

          <h2 className="font-heading text-5xl leading-tight mb-5">
            Every book opens a new world.
          </h2>

          <p className="text-white/80 max-w-md leading-relaxed">
            Discover stories, explore knowledge, and find your next
            favorite book with BookNook.
          </p>

        </div>
      </div>

    </div>
  );
}

