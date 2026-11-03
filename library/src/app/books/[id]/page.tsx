
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen } from "lucide-react";
import BorrowModal from "@/components/books/BorrowModal";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image?: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
};

type Props = {
  params: Promise<{ id: string }>;
};

async function getBook(id: string): Promise<Book | null> {
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return null;
  }

  const response = await fetch(
    `http://localhost:5000/books/${id}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404 || response.status === 400) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to load book details.");
  }

  const book = await response.json();

  return book || null;
}

export default async function BookDetails({ params }: Props) {
  const { id } = await params;

  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return (
    <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:items-center md:px-8">
      <div>
        <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-[#E8E2D6] shadow-xl">
          {book.image ? (
            <img
              src={book.image}
              alt={book.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen
                size={70}
                strokeWidth={1.2}
                className="text-[#A49B8C]"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <Link
          href="/books"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#777D74] hover:text-[#173D32]"
        >
          <ArrowLeft size={17} />
          Back to Library
        </Link>

        <p className="text-xs font-semibold tracking-widest text-[#A47B48]">
          {book.category?.toUpperCase()}
        </p>

        <h1 className="mt-4 font-heading text-4xl font-semibold text-[#173D32] md:text-5xl">
          {book.title}
        </h1>

        <p className="mt-4 text-[#777D74]">
          Written by{" "}
          <span className="font-semibold text-[#26332D]">
            {book.author}
          </span>
        </p>

        <div className="my-8 border-t border-[#DED9CD]" />

        <h2 className="font-heading text-2xl font-semibold text-[#173D32]">
          About This Book
        </h2>

        <p className="mt-4 text-sm leading-8 text-[#777D74]">
          {book.description}
        </p>

        <div className="mt-8 rounded-xl border border-[#DED9CD] bg-[#FFFEFA] p-6">
          <div className="flex justify-between">
            <span className="text-sm text-[#777D74]">
              Total Copies
            </span>
            <span className="font-semibold text-[#173D32]">
              {book.totalCopies}
            </span>
          </div>

          <div className="mt-4 flex justify-between">
            <span className="text-sm text-[#777D74]">
              Available Copies
            </span>
            <span className="font-semibold text-[#173D32]">
              {book.availableCopies}
            </span>
          </div>

          <p
            className={`mt-5 text-sm font-semibold ${
              book.availableCopies > 0
                ? "text-green-700"
                : "text-red-600"
            }`}
          >
            {book.availableCopies > 0
              ? "Available to Borrow"
              : "Not Available"}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-3 text-sm text-[#777D74]">
          <BookOpen size={19} className="text-[#C49A62]" />
          Borrowing period: 7 days
        </div>

        {book.availableCopies > 0 ? (
          <BorrowModal
            bookId={book._id}
            title={book.title}
            image={book.image || ""}
          />
        ) : (
          <button
            disabled
            className="mt-8 w-full rounded-lg bg-gray-300 px-6 py-4 text-sm font-semibold text-gray-600"
          >
            Not Available
          </button>
        )}
      </div>
    </section>
  );
}
