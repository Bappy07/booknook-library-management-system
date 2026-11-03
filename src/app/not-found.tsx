
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[65vh] items-center justify-center px-4">
      <div className="text-center">
        <BookOpen
          size={48}
          className="mx-auto text-[#C49A62]"
        />

        <h1 className="mt-5 font-heading text-6xl font-bold text-[#173D32]">
          404
        </h1>

        <h2 className="mt-3 text-xl font-semibold text-[#26332D]">
          Book Not Found
        </h2>

        <p className="mt-2 text-sm text-[#777D74]">
          Sorry, we couldn't find the page you're looking for.
        </p>

        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-[#173D32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#245747]"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
