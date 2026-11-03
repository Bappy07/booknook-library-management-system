
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  BookPlus,
  ImagePlus,
  BookOpen,
  UserRound,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";

export default function AddBookPage() {
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const title = String(formData.get("title") || "").trim();
    const author = String(formData.get("author") || "").trim();
    const description = String(formData.get("description") || "").trim();
    const copies = Number(formData.get("totalCopies"));

    if (title.length < 2 || author.length < 2) {
      toast.error("Title and author must contain at least 2 characters.");
      return;
    }

    if (description.length < 20) {
      toast.error("Description must contain at least 20 characters.");
      return;
    }

    if (!Number.isInteger(copies) || copies < 1 || copies > 1000) {
      toast.error("Enter a valid number of copies.");
      return;
    }

    if (!session) {
      toast.error("Please log in before adding a book.");
      return;
    }

    try {
      setIsSubmitting(true);

      // Get JWT token from Better Auth
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error(
          error?.message || "Authentication failed. Please log in again."
        );
      }

      // Send book data to Express backend
      const response = await fetch("http://localhost:5000/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify({
          title,
          author,
          category: formData.get("category"),
          totalCopies: copies,
          image: imageUrl,
          description,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add book.");
      }

      toast.success("Book added successfully!");

      form.reset();
      setImageUrl("");
      setImageError(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleReset() {
    setImageUrl("");
    setImageError(false);
  }

  return (
    <section className="min-h-screen bg-[#F6F3EB] px-5 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-[#777D74] transition hover:text-[#173D32]"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        {/* Heading */}
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.25em] text-[#C49A62]">
            SHARE A STORY
          </p>

          <h1 className="mt-3 font-heading text-4xl font-semibold text-[#173D32] md:text-5xl">
            Add a New Book.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-[#777D74]">
            Expand our library with a new story. Add the book details
            below and make it available for other readers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Book Information */}
          <div className="rounded-2xl border border-[#DED9CD] bg-[#FFFEFA] p-6 shadow-sm md:p-9">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8E2D6] text-[#173D32]">
                <BookOpen size={21} />
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold text-[#173D32]">
                  Book Information
                </h2>
                <p className="mt-1 text-xs text-[#777D74]">
                  Basic information about your book.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#26332D]">
                  Book Title *
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="Enter book title"
                  required
                  minLength={2}
                  maxLength={120}
                  className="w-full rounded-lg border border-[#DED9CD] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#26332D]">
                  Author Name *
                </label>
                <input
                  name="author"
                  type="text"
                  placeholder="Enter author name"
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full rounded-lg border border-[#DED9CD] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#173D32] focus:ring-2 focus:ring-[#173D32]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#26332D]">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  defaultValue=""
                  className="w-full rounded-lg border border-[#DED9CD] bg-[#FFFEFA] px-4 py-3 text-sm outline-none focus:border-[#173D32]"
                >
                  <option value="" disabled>
                    Select category
                  </option>
                  <option value="Fiction">Fiction</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                  <option value="Kids">Kids</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#26332D]">
                  Total Copies *
                </label>
                <input
                  name="totalCopies"
                  type="number"
                  min={1}
                  max={1000}
                  step={1}
                  placeholder="e.g. 5"
                  required
                  className="w-full rounded-lg border border-[#DED9CD] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#173D32]"
                />
                <p className="mt-2 text-xs text-[#777D74]">
                  Number of copies in your library.
                </p>
              </div>
            </div>
          </div>

          {/* Book Cover */}
          <div className="rounded-2xl border border-[#DED9CD] bg-[#FFFEFA] p-6 shadow-sm md:p-9">
            <div className="mb-7 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8E2D6] text-[#173D32]">
                <ImagePlus size={21} />
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold text-[#173D32]">
                  Book Cover
                </h2>
                <p className="mt-1 text-xs text-[#777D74]">
                  Add an image URL for your book cover.
                </p>
              </div>
            </div>

            <label className="mb-2 block text-sm font-medium text-[#26332D]">
              Cover Image URL *
            </label>

            <input
              name="image"
              type="url"
              value={imageUrl}
              onChange={(event) => {
                setImageUrl(event.target.value);
                setImageError(false);
              }}
              placeholder="https://example.com/book-cover.jpg"
              required
              className="w-full rounded-lg border border-[#DED9CD] bg-transparent px-4 py-3 text-sm outline-none focus:border-[#173D32]"
            />

            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-start">
              <div className="flex h-52 w-40 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-dashed border-[#C49A62] bg-[#F6F3EB]">
                {imageUrl && !imageError ? (
                  <img
                    src={imageUrl}
                    alt="Book cover preview"
                    className="h-full w-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="px-3 text-center text-[#A49B8C]">
                    <ImagePlus size={32} className="mx-auto mb-3" />
                    <p className="text-xs">
                      {imageError ? "Image could not load" : "Cover Preview"}
                    </p>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <p className="text-sm font-semibold text-[#173D32]">
                  Image guidelines
                </p>
                <ul className="mt-3 space-y-2 text-xs leading-6 text-[#777D74]">
                  <li>• Use a direct image URL.</li>
                  <li>• Prefer high-quality book covers.</li>
                  <li>• Portrait images work best.</li>
                  <li>• Make sure the image is publicly accessible.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-[#DED9CD] bg-[#FFFEFA] p-6 shadow-sm md:p-9">
            <h2 className="font-heading text-xl font-semibold text-[#173D32]">
              Book Description
            </h2>

            <p className="mt-1 text-xs text-[#777D74]">
              Tell readers what makes this book worth reading.
            </p>

            <textarea
              name="description"
              rows={6}
              minLength={20}
              maxLength={1500}
              placeholder="Write a short description about this book..."
              required
              className="mt-6 w-full resize-y rounded-lg border border-[#DED9CD] bg-transparent px-4 py-3 text-sm leading-7 outline-none focus:border-[#173D32]"
            />
          </div>

          {/* Contributor Information */}
          <div className="rounded-2xl border border-[#DED9CD] bg-[#FFFEFA] p-6 shadow-sm md:p-9">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E8E2D6] text-[#173D32]">
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="font-heading text-xl font-semibold text-[#173D32]">
                  Contributor Information
                </h2>
                <p className="mt-1 text-xs text-[#777D74]">
                  Your account details will be attached to this book.
                </p>
              </div>
            </div>

            <div className="grid gap-4 rounded-xl bg-[#F6F3EB] p-5 sm:grid-cols-2">
              <div>
                <p className="text-xs text-[#777D74]">Contributor Name</p>
                <p className="mt-2 text-sm font-medium text-[#173D32]">
                  {isPending ? "Loading..." : session?.user.name || "Not available"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#777D74]">Email Address</p>
                <p className="mt-2 break-all text-sm font-medium text-[#173D32]">
                  {isPending ? "Loading..." : session?.user.email || "Not available"}
                </p>
              </div>
            </div>

            <p className="mt-5 text-xs text-[#777D74]">
              <span className="font-semibold text-[#173D32]">Added date:</span>
              {" "}Automatically recorded when the book is saved.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#173D32] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#285344] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <BookPlus size={19} />
              {isSubmitting ? "Saving Book..." : "Add Book to Library"}
            </button>

            <button
              type="reset"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#DED9CD] px-6 py-4 text-sm font-semibold text-[#173D32] transition hover:bg-[#E8E2D6] disabled:opacity-50"
            >
              <RotateCcw size={17} />
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
