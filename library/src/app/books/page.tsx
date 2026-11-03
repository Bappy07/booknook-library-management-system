
import Link from "next/link";
import {
  Search,
  ArrowRight,
  BookOpen,
  SlidersHorizontal,
} from "lucide-react";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image?: string;
  availableCopies?: number;
  createdAt?: string;
};

type BooksPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    sort?: string;
  }>;
};

const categories = ["All", "Fiction", "Science", "History", "Kids", "Others"];

async function getBooks(): Promise<Book[]> {
  const response = await fetch("http://localhost:5000/books", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Could not load books from the server.");
  }

  const data = await response.json();

  // Supports either an array or an object containing a books array.
  return Array.isArray(data) ? data : data.books || [];
}

export default async function BooksPage({
  searchParams,
}: BooksPageProps) {
  const params = await searchParams;

  const query = params.q?.trim().toLowerCase() || "";
  const category = categories.includes(params.category || "")
    ? params.category || "All"
    : "All";
  const sort = params.sort || "newest";

  let books: Book[] = [];
  let loadingError = false;

  try {
    books = await getBooks();
  } catch (error) {
    console.error("Books API error:", error);
    loadingError = true;
  }

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title?.toLowerCase().includes(query) ||
      book.author?.toLowerCase().includes(query);

    const matchesCategory =
      category === "All" || book.category === category;

    return matchesSearch && matchesCategory;
  });

  if (sort === "title") {
    filteredBooks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "author") {
    filteredBooks.sort((a, b) => a.author.localeCompare(b.author));
  } else {
    filteredBooks.sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime()
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F3EB]">
      {/* Hero */}
      <section className="bg-[#173D32] px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-5 text-xs font-semibold tracking-[0.25em] text-[#C49A62]">
            THE BOOKNOOK COLLECTION
          </p>

          <h1 className="font-heading text-4xl font-semibold text-[#F6F3EB] md:text-6xl">
            Explore Our Library.
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/65 md:text-base">
            Find your next favorite story among our growing collection
            of books, ideas, and discoveries.
          </p>

          <div className="mt-9 flex items-center gap-3 text-sm text-white/60">
            <BookOpen size={18} className="text-[#C49A62]" />
            Discover something worth reading.
          </div>
        </div>
      </section>

      {/* Books */}
      <section className="mx-auto max-w-7xl px-5 py-16 md:px-8">
        {/* Filters */}
        <form
          action="/books"
          method="GET"
          className="mb-12 rounded-2xl border border-[#DED9CD] bg-[#FFFEFA] p-5 md:p-7"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="relative md:col-span-6">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777D74]"
              />

              <input
                type="search"
                name="q"
                defaultValue={params.q || ""}
                placeholder="Search by book title or author..."
                className="h-12 w-full rounded-lg border border-[#DED9CD] bg-[#F6F3EB] pl-12 pr-4 text-sm text-[#26332D] outline-none focus:border-[#173D32]"
              />
            </div>

            <div className="md:col-span-3">
              <select
                name="category"
                defaultValue={category}
                className="h-12 w-full rounded-lg border border-[#DED9CD] bg-[#F6F3EB] px-4 text-sm text-[#26332D] outline-none focus:border-[#173D32]"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Categories" : item}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <select
                name="sort"
                defaultValue={sort}
                className="h-12 w-full rounded-lg border border-[#DED9CD] bg-[#F6F3EB] px-4 text-sm text-[#26332D] outline-none focus:border-[#173D32]"
              >
                <option value="newest">Newest First</option>
                <option value="title">Title: A to Z</option>
                <option value="author">Author: A to Z</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-[#777D74]">
              <SlidersHorizontal size={15} />
              Refine your book collection
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/books"
                className="text-sm font-medium text-[#777D74] hover:text-[#173D32]"
              >
                Clear filters
              </Link>

              <button
                type="submit"
                className="rounded-lg bg-[#173D32] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#285344]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>

        {/* Results */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#A47B48]">
              OUR COLLECTION
            </p>

            <h2 className="mt-2 font-heading text-3xl font-semibold text-[#173D32]">
              {category === "All" ? "All Books" : category}
            </h2>
          </div>

          <p className="text-sm text-[#777D74]">
            Showing{" "}
            <span className="font-semibold text-[#173D32]">
              {filteredBooks.length}
            </span>{" "}
            books
          </p>
        </div>

        {/* API Error */}
        {loadingError ? (
          <div className="rounded-2xl border border-[#DED9CD] bg-[#FFFEFA] px-6 py-20 text-center">
            <BookOpen
              size={42}
              strokeWidth={1.3}
              className="mx-auto text-[#C49A62]"
            />

            <h3 className="mt-5 font-heading text-2xl font-semibold text-[#173D32]">
              Unable to load books
            </h3>

            <p className="mt-3 text-sm text-[#777D74]">
              Please check that your backend server is running and try again.
            </p>

            <Link
              href="/books"
              className="mt-7 inline-flex rounded-lg bg-[#173D32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#285344]"
            >
              Try Again
            </Link>
          </div>
        ) : filteredBooks.length > 0 ? (
          /* Book Grid */
          <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <article key={book._id} className="group">
                <Link
                  href={`/books/${book._id}`}
                  className="relative block overflow-hidden rounded-xl bg-[#E8E2D6]"
                >
                  <div className="relative aspect-[4/3] w-full">
                    {book.image ? (
                      <img
                        src={book.image}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <BookOpen
                          size={48}
                          strokeWidth={1.2}
                          className="text-[#A49B8C]"
                        />
                      </div>
                    )}
                  </div>

                  <span className="absolute left-4 top-4 rounded-full bg-[#F6F3EB]/95 px-4 py-2 text-[10px] font-semibold tracking-wider text-[#173D32]">
                    {book.category?.toUpperCase()}
                  </span>
                </Link>

                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-[#173D32] transition-colors group-hover:text-[#A47B48]">
                      {book.title}
                    </h3>

                    <p className="mt-2 text-sm text-[#777D74]">
                      by {book.author}
                    </p>

                    <p className="mt-2 text-xs text-[#777D74]">
                      Available copies: {book.availableCopies ?? "—"}
                    </p>
                  </div>

                  <BookOpen
                    size={19}
                    className="mt-1 shrink-0 text-[#C49A62]"
                  />
                </div>

                <Link
                  href={`/books/${book._id}`}
                  className="mt-5 inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#173D32] transition-colors hover:text-[#A47B48]"
                >
                  VIEW DETAILS
                  <ArrowRight size={15} />
                </Link>

                <div className="mt-5 border-b border-[#DED9CD]" />
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#DED9CD] bg-[#FFFEFA] px-6 py-20 text-center">
            <BookOpen
              size={42}
              strokeWidth={1.3}
              className="mx-auto text-[#C49A62]"
            />

            <h3 className="mt-5 font-heading text-2xl font-semibold text-[#173D32]">
              No books found
            </h3>

            <p className="mt-3 text-sm text-[#777D74]">
              {books.length === 0
                ? "Our library is waiting for its first books."
                : "Try another search term or choose a different category."}
            </p>

            <Link
              href="/books"
              className="mt-7 inline-flex rounded-lg bg-[#173D32] px-6 py-3 text-sm font-semibold text-white hover:bg-[#285344]"
            >
              View All Books
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
