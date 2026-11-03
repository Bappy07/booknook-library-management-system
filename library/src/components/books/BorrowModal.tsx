
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, BookOpen } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

type Props = {
  bookId: string;
  title: string;
  image: string;
};

export default function BorrowModal({ bookId, title, image }: Props) {
  const [open, setOpen] = useState(false);
  const [isBorrowing, setIsBorrowing] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const dueDate = new Date(today);

    dueDate.setDate(today.getDate() + 7);

    setBorrowDate(today.toLocaleDateString());
    setReturnDate(dueDate.toLocaleDateString());
  }, []);

  async function handleBorrow() {
    if (!session) {
      toast.error("Please login before borrowing a book.");
      return;
    }

    try {
      setIsBorrowing(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Authentication failed. Please login again.");
      }

      const response = await fetch("http://localhost:5000/borrows", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not borrow this book.");
      }

      toast.success("Book borrowed successfully!");

      setOpen(false);
      router.refresh();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      toast.error(message);
    } finally {
      setIsBorrowing(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-8 w-full rounded-lg bg-[#173D32] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#245747]"
      >
        Borrow This Book
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-[#FFFEFA] p-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 text-[#777D74]"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <BookOpen size={28} className="text-[#C49A62]" />

            <h2 className="mt-4 font-heading text-2xl font-semibold text-[#173D32]">
              Confirm Your Borrow
            </h2>

            <div className="mt-5 flex items-center gap-4 rounded-xl bg-[#F6F3EB] p-3">
              {image ? (
                <img
                  src={image}
                  alt={title}
                  className="h-20 w-16 rounded-md object-cover"
                />
              ) : (
                <div className="flex h-20 w-16 items-center justify-center rounded-md bg-[#E8E2D6]">
                  <BookOpen size={24} className="text-[#A49B8C]" />
                </div>
              )}

              <p className="font-semibold text-[#26332D]">{title}</p>
            </div>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-[#777D74]">Borrower Name</p>
                <p className="font-medium text-[#26332D]">
                  {isPending
                    ? "Loading..."
                    : session?.user.name || "Not logged in"}
                </p>
              </div>

              <div>
                <p className="text-[#777D74]">Email Address</p>
                <p className="font-medium text-[#26332D]">
                  {isPending
                    ? "Loading..."
                    : session?.user.email || "Not logged in"}
                </p>
              </div>

              <div>
                <p className="text-[#777D74]">Borrow Date</p>
                <p className="font-medium text-[#26332D]">
                  {borrowDate}
                </p>
              </div>

              <div>
                <p className="text-[#777D74]">Expected Return Date</p>
                <p className="font-medium text-[#173D32]">
                  {returnDate}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setOpen(false)}
                disabled={isBorrowing}
                className="w-full rounded-lg border border-[#DED9CD] px-4 py-3 text-sm font-semibold text-[#26332D] disabled:opacity-50"
              >
                Cancel
              </button>

              {isPending ? (
                <button
                  disabled
                  className="w-full rounded-lg bg-[#173D32]/50 px-4 py-3 text-sm font-semibold text-white"
                >
                  Loading...
                </button>
              ) : session ? (
                <button
                  onClick={handleBorrow}
                  disabled={isBorrowing}
                  className="w-full rounded-lg bg-[#173D32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#245747] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isBorrowing ? "Borrowing..." : "Confirm Borrow"}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="w-full rounded-lg bg-[#173D32] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Login First
                </Link>
              )}
            </div>

            <p className="mt-3 text-center text-xs text-[#777D74]">
              Borrowing period: 7 days
            </p>
          </div>
        </div>
      )}
    </>
  );
}
