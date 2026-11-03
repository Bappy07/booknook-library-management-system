
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  RotateCcw,
  X,
} from "lucide-react";

type BorrowStatus = "Active" | "Overdue" | "Returned";

type Borrow = {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage?: string;
  author?: string;
  category?: string;
  borrowDate: string;
  returnDate: string;
  returnedAt?: string | null;
  status: BorrowStatus;
};

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyle(status: BorrowStatus) {
  if (status === "Returned") {
    return "bg-green-100 text-green-800";
  }

  if (status === "Overdue") {
    return "bg-red-100 text-red-700";
  }

  return "bg-blue-100 text-blue-800";
}

export default function MyBorrowsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [selectedBorrow, setSelectedBorrow] = useState<Borrow | null>(null);

  const [loading, setLoading] = useState(true);
  const [isReturning, setIsReturning] = useState(false);

  async function loadBorrows() {
    try {
      setLoading(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please login again.");
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [borrowResponse, bookResponse] = await Promise.all([
        fetch("http://localhost:5000/borrows", {
          headers,
          cache: "no-store",
        }),
        fetch("http://localhost:5000/books", {
          cache: "no-store",
        }),
      ]);

      if (!borrowResponse.ok) {
        throw new Error("Could not load your borrowing records.");
      }

      const borrowData = await borrowResponse.json();

      const borrowList = Array.isArray(borrowData)
        ? borrowData
        : borrowData.borrows || [];

      let books: Book[] = [];

      if (bookResponse.ok) {
        const bookData = await bookResponse.json();
        books = Array.isArray(bookData)
          ? bookData
          : bookData.books || [];
      }

      const enrichedBorrows: Borrow[] = borrowList.map(
        (item: {
          _id: string;
          bookId: string;
          bookTitle: string;
          bookImage?: string;
          borrowDate: string;
          returnDate: string;
          returnedAt?: string | null;
          status?: string;
        }) => {
          const book = books.find(
            (itemBook) => itemBook._id === String(item.bookId)
          );

          let status: BorrowStatus = "Active";

          if (item.returnedAt || item.status === "returned") {
            status = "Returned";
          } else if (item.status === "overdue") {
            status = "Overdue";
          }

          return {
            _id: item._id,
            bookId: String(item.bookId),
            bookTitle: item.bookTitle,
            bookImage: item.bookImage || "",
            author: book?.author || "",
            category: book?.category || "Book",
            borrowDate: item.borrowDate,
            returnDate: item.returnDate,
            returnedAt: item.returnedAt,
            status,
          };
        }
      );

      setBorrows(enrichedBorrows);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      setLoading(false);
      return;
    }

    loadBorrows();
  }, [session, isPending]);

  async function handleReturn() {
    if (!selectedBorrow) return;

    try {
      setIsReturning(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please login again.");
      }

      const response = await fetch(
        `http://localhost:5000/borrows/${selectedBorrow._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not return this book.");
      }

      setBorrows((current) =>
        current.map((borrow) =>
          borrow._id === selectedBorrow._id
            ? {
                ...borrow,
                status: "Returned",
                returnedAt: new Date().toISOString(),
              }
            : borrow
        )
      );

      toast.success("Book returned successfully!");
      setSelectedBorrow(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong.";

      toast.error(message);
    } finally {
      setIsReturning(false);
    }
  }

  const activeCount = borrows.filter(
    (borrow) => borrow.status === "Active"
  ).length;

  const overdueCount = borrows.filter(
    (borrow) => borrow.status === "Overdue"
  ).length;

  const returnedCount = borrows.filter(
    (borrow) => borrow.status === "Returned"
  ).length;

  if (isPending || loading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-24 text-center md:px-8">
        <BookOpen
          size={40}
          className="mx-auto animate-pulse text-[#C49A62]"
        />
        <p className="mt-5 text-sm text-[#777D74]">
          Loading your borrowed books...
        </p>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-24 text-center md:px-8">
        <BookOpen
          size={42}
          className="mx-auto text-[#C49A62]"
        />
        <h1 className="mt-5 font-heading text-3xl font-semibold text-[#173D32]">
          Login Required
        </h1>
        <p className="mt-3 text-sm text-[#777D74]">
          Please login to see your borrowed books.
        </p>
        <Link
          href="/login"
          className="mt-7 inline-block rounded-lg bg-[#173D32] px-6 py-3 text-sm font-semibold text-white"
        >
          Login
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
      <div className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#A47B48]">
          Your Reading Activity
        </p>

        <h1 className="mt-3 font-heading text-4xl font-semibold text-[#173D32]">
          My Borrows
        </h1>

        <p className="mt-3 text-sm text-[#777D74]">
          Track your borrowed books and keep your reading journey organized.
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#DED9CD] bg-[#FFFEFA] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#777D74]">Active Borrows</p>
            <Clock size={20} className="text-blue-600" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-[#173D32]">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#DED9CD] bg-[#FFFEFA] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#777D74]">Overdue Books</p>
            <CalendarDays size={20} className="text-red-600" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-red-600">
            {overdueCount}
          </p>
        </div>

        <div className="rounded-xl border border-[#DED9CD] bg-[#FFFEFA] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#777D74]">Returned Books</p>
            <CheckCircle2 size={20} className="text-green-700" />
          </div>
          <p className="mt-3 text-3xl font-semibold text-[#173D32]">
            {returnedCount}
          </p>
        </div>
      </div>

      {borrows.length === 0 ? (
        <div className="rounded-xl border border-[#DED9CD] bg-[#FFFEFA] px-6 py-16 text-center">
          <BookOpen
            size={42}
            className="mx-auto mb-5 text-[#C49A62]"
          />

          <h2 className="font-heading text-2xl font-semibold text-[#173D32]">
            No Borrowed Books Yet
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#777D74]">
            You haven't borrowed any books yet. Explore our collection and
            discover your next favorite read.
          </p>

          <Link
            href="/books"
            className="mt-7 inline-block rounded-lg bg-[#173D32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285344]"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {borrows.map((borrow) => (
            <div
              key={borrow._id}
              className="flex flex-col gap-5 rounded-xl border border-[#DED9CD] bg-[#FFFEFA] p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
            >
              <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#E8E2D6] sm:h-36 sm:w-28">
                {borrow.bookImage ? (
                  <img
                    src={borrow.bookImage}
                    alt={borrow.bookTitle}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen
                    size={40}
                    className="text-[#A49B8C]"
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A47B48]">
                  {borrow.category}
                </span>

                <h2 className="mt-2 font-heading text-xl font-semibold text-[#173D32]">
                  {borrow.bookTitle}
                </h2>

                <p className="mt-1 text-sm text-[#777D74]">
                  By {borrow.author || "Unknown Author"}
                </p>

                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#777D74]">
                  <span>
                    Borrowed:{" "}
                    <strong className="text-[#26332D]">
                      {formatDate(borrow.borrowDate)}
                    </strong>
                  </span>

                  <span>
                    Return Date:{" "}
                    <strong className="text-[#26332D]">
                      {formatDate(borrow.returnDate)}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start gap-4 sm:items-end">
                <span
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold ${getStatusStyle(
                    borrow.status
                  )}`}
                >
                  {borrow.status}
                </span>

                {borrow.status !== "Returned" && (
                  <button
                    onClick={() => setSelectedBorrow(borrow)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#173D32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285344] sm:w-auto"
                  >
                    <RotateCcw size={16} />
                    Return Book
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBorrow && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
          onClick={() => !isReturning && setSelectedBorrow(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="return-title"
            className="w-full max-w-md rounded-2xl bg-[#FFFEFA] p-7 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
              <RotateCcw size={24} />
            </div>

            <div className="flex items-start justify-between gap-4">
              <h2
                id="return-title"
                className="font-heading text-2xl font-semibold text-[#173D32]"
              >
                Return this book?
              </h2>

              <button
                onClick={() => setSelectedBorrow(null)}
                disabled={isReturning}
                aria-label="Close confirmation"
                className="rounded-full p-2 text-[#777D74] transition hover:bg-[#F6F3EB]"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-[#777D74]">
              Are you sure you want to return{" "}
              <strong className="text-[#173D32]">
                {selectedBorrow.bookTitle}
              </strong>
              ?
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setSelectedBorrow(null)}
                disabled={isReturning}
                className="rounded-lg border border-[#DED9CD] px-5 py-3 text-sm font-semibold text-[#26332D] transition hover:bg-[#F6F3EB] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                onClick={handleReturn}
                disabled={isReturning}
                className="rounded-lg bg-[#173D32] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#285344] disabled:opacity-50"
              >
                {isReturning ? "Returning..." : "Confirm Return"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
