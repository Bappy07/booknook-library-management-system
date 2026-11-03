
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import {
  Pencil,
  Trash2,
  BookOpen,
  X,
  AlertTriangle,
} from "lucide-react";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image?: string;
  description?: string;
  totalCopies: number;
  availableCopies: number;
  ownerId: string;
};

const categories = ["Fiction", "Science", "History", "Kids", "Others"];

export default function MyBooksPage() {
  const { data: session, isPending } = authClient.useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true);

      const data = await apiRequest("/books", {
        cache: "no-store",
      });

      const allBooks: Book[] = Array.isArray(data)
        ? data
        : data.books || [];

      const myBooks = allBooks.filter(
        (book: Book) => book.ownerId === session?.user.id
      );

      setBooks(myBooks);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }, [session?.user.id]);

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      setLoading(false);
      return;
    }

    loadBooks();
  }, [session, isPending, loadBooks]);

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!editingBook) return;

    const borrowedCopies =
      editingBook.totalCopies -
      (books.find((book) => book._id === editingBook._id)?.availableCopies ?? 0);

    if (editingBook.totalCopies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    if (editingBook.totalCopies < borrowedCopies) {
      toast.error(
        `At least ${borrowedCopies} copies are already borrowed.`
      );
      return;
    }

    if (!editingBook.title.trim() || !editingBook.author.trim()) {
      toast.error("Please enter the book title and author.");
      return;
    }

    try {
      setIsSaving(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please login again.");
      }

      await apiRequest(`/books/${editingBook._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editingBook.title.trim(),
          author: editingBook.author.trim(),
          category: editingBook.category,
          totalCopies: editingBook.totalCopies,
        }),
      });

      toast.success("Book updated successfully!");
      setEditingBook(null);
      await loadBooks();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!deletingBook) return;

    try {
      setIsDeleting(true);

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) {
        throw new Error("Please login again.");
      }

      await apiRequest(`/books/${deletingBook._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBooks((currentBooks) =>
        currentBooks.filter((book) => book._id !== deletingBook._id)
      );

      setDeletingBook(null);
      toast.success("Book deleted successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  if (isPending || loading) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-24 text-center md:px-8">
        <BookOpen
          size={40}
          className="mx-auto animate-pulse text-[#C49A62]"
        />
        <p className="mt-5 text-sm text-[#777D74]">
          Loading your collection...
        </p>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="mx-auto max-w-7xl px-5 py-24 text-center md:px-8">
        <BookOpen size={42} className="mx-auto text-[#C49A62]" />
        <h1 className="mt-5 font-heading text-3xl font-semibold text-[#173D32]">
          Login Required
        </h1>
        <p className="mt-3 text-sm text-[#777D74]">
          Please login to manage your books.
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
      {/* Heading */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#A47B48]">
            Your Collection
          </p>

          <h1 className="mt-3 font-heading text-4xl font-semibold text-[#173D32]">
            My Books
          </h1>

          <p className="mt-3 text-sm text-[#777D74]">
            Manage the books you have added to BookNook.
          </p>
        </div>

        <Link
          href="/add-book"
          className="rounded-lg bg-[#173D32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285344]"
        >
          + Add New Book
        </Link>
      </div>

      {/* Book List / Empty State */}
      {books.length === 0 ? (
        <div className="rounded-xl border border-[#DED9CD] bg-[#FFFEFA] px-6 py-16 text-center">
          <BookOpen
            size={42}
            className="mx-auto mb-5 text-[#C49A62]"
          />

          <h2 className="font-heading text-2xl font-semibold text-[#173D32]">
            Your Collection Is Empty
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#777D74]">
            You haven't added any books yet. Start building your
            collection and share your favorite reads with others.
          </p>

          <Link
            href="/add-book"
            className="mt-7 inline-block rounded-lg bg-[#173D32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285344]"
          >
            Add Your First Book
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {books.map((book) => (
            <div
              key={book._id}
              className="flex flex-col gap-5 rounded-xl border border-[#DED9CD] bg-[#FFFEFA] p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
            >
              {/* Book Cover */}
              <div className="flex h-40 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#E8E2D6] sm:h-36 sm:w-28">
                {book.image ? (
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen size={40} className="text-[#A49B8C]" />
                )}
              </div>

              {/* Book Information */}
              <div className="min-w-0 flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#A47B48]">
                  {book.category}
                </span>

                <h2 className="mt-2 font-heading text-xl font-semibold text-[#173D32]">
                  {book.title}
                </h2>

                <p className="mt-1 text-sm text-[#777D74]">
                  By {book.author}
                </p>

                <div className="mt-4 flex flex-wrap gap-5 text-sm text-[#777D74]">
                  <span>
                    Total:{" "}
                    <strong className="text-[#26332D]">
                      {book.totalCopies}
                    </strong>
                  </span>

                  <span>
                    Available:{" "}
                    <strong className="text-[#173D32]">
                      {book.availableCopies}
                    </strong>
                  </span>

                  <span>
                    Borrowed:{" "}
                    <strong className="text-[#26332D]">
                      {book.totalCopies - book.availableCopies}
                    </strong>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 sm:flex-col">
                <button
                  onClick={() => setEditingBook({ ...book })}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#DED9CD] px-5 py-3 text-sm text-[#173D32] transition hover:bg-[#F6F3EB] sm:flex-none"
                >
                  <Pencil size={16} />
                  Edit
                </button>

                <button
                  onClick={() => setDeletingBook(book)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-5 py-3 text-sm text-red-600 transition hover:bg-red-50 sm:flex-none"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
          onClick={() => !isSaving && setEditingBook(null)}
        >
          <form
            onSubmit={handleSave}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-2xl bg-[#FFFEFA] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-2xl font-semibold text-[#173D32]">
                Edit Book
              </h2>

              <button
                type="button"
                onClick={() => setEditingBook(null)}
                disabled={isSaving}
                aria-label="Close edit modal"
                className="rounded-full p-2 text-[#777D74] transition hover:bg-[#F6F3EB]"
              >
                <X size={20} />
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#26332D]">
                Book Title
              </label>

              <input
                value={editingBook.title}
                onChange={(event) =>
                  setEditingBook({
                    ...editingBook,
                    title: event.target.value,
                  })
                }
                required
                className="w-full rounded-lg border border-[#DED9CD] bg-white p-3 outline-none focus:border-[#173D32]"
              />
            </div>

            {/* Author */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#26332D]">
                Author Name
              </label>

              <input
                value={editingBook.author}
                onChange={(event) =>
                  setEditingBook({
                    ...editingBook,
                    author: event.target.value,
                  })
                }
                required
                className="w-full rounded-lg border border-[#DED9CD] bg-white p-3 outline-none focus:border-[#173D32]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#26332D]">
                Category
              </label>

              <select
                value={editingBook.category}
                onChange={(event) =>
                  setEditingBook({
                    ...editingBook,
                    category: event.target.value,
                  })
                }
                className="w-full rounded-lg border border-[#DED9CD] bg-white p-3 outline-none focus:border-[#173D32]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Total Copies */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#26332D]">
                Total Copies
              </label>

              <input
                type="number"
                min={
                  books.find((book) => book._id === editingBook._id)
                    ? books.find((book) => book._id === editingBook._id)!
                        .totalCopies -
                      books.find((book) => book._id === editingBook._id)!
                        .availableCopies
                    : 1
                }
                value={editingBook.totalCopies}
                onChange={(event) =>
                  setEditingBook({
                    ...editingBook,
                    totalCopies: Number(event.target.value),
                  })
                }
                required
                className="w-full rounded-lg border border-[#DED9CD] bg-white p-3 outline-none focus:border-[#173D32]"
              />

              <p className="mt-2 text-xs text-[#777D74]">
                Already borrowed:{" "}
                {books.find((book) => book._id === editingBook._id)!
                  .totalCopies -
                  books.find((book) => book._id === editingBook._id)!
                    .availableCopies}{" "}
                copies.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse gap-3 border-t border-[#DED9CD] pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setEditingBook(null)}
                disabled={isSaving}
                className="rounded-lg border border-[#DED9CD] px-5 py-3 text-sm transition hover:bg-[#F6F3EB] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg bg-[#173D32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285344] disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingBook && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5"
          onClick={() => !isDeleting && setDeletingBook(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-[#FFFEFA] p-7 shadow-xl"
          >
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={24} />
            </div>

            <div className="flex items-start justify-between gap-4">
              <h2
                id="delete-title"
                className="font-heading text-2xl font-semibold text-[#173D32]"
              >
                Delete this book?
              </h2>

              <button
                onClick={() => setDeletingBook(null)}
                disabled={isDeleting}
                aria-label="Close delete confirmation"
                className="rounded-full p-2 text-[#777D74] transition hover:bg-[#F6F3EB]"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mt-3 text-sm leading-6 text-[#777D74]">
              Are you sure you want to delete{" "}
              <strong className="text-[#173D32]">
                {deletingBook.title}
              </strong>
              ? This action cannot be undone.
            </p>

            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={() => setDeletingBook(null)}
                disabled={isDeleting}
                className="rounded-lg border border-[#DED9CD] px-5 py-3 text-sm transition hover:bg-[#F6F3EB]"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
