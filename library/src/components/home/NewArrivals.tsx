
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { apiRequest } from "@/lib/api";

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image?: string;
};

async function getBooks(): Promise<Book[]> {
  try {
    const data = await apiRequest("/books", {
      next: { revalidate: 60 },
    });

    const books: Book[] = Array.isArray(data)
      ? data
      : data.books || [];

    return books.slice(0, 6);
  } catch (error) {
    console.error("New arrivals API error:", error);
    return [];
  }
}

export default async function NewArrivals() {
  const books = await getBooks();

  return (
    <section className="bg-[#F6F3EB] px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-[#C49A62]">
              DISCOVER SOMETHING NEW
            </p>

            <h2 className="font-heading text-4xl font-semibold text-[#173D32] md:text-5xl">
              Fresh Off the Shelf.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#777D74] md:text-base">
              Explore our latest arrivals and discover stories worth
              remembering. Your next favorite book might be here.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex w-fit items-center gap-2 border-b border-[#173D32] pb-2 text-sm font-semibold text-[#173D32] transition-colors hover:border-[#C49A62] hover:text-[#C49A62]"
          >
            Explore All Books
            <ArrowRight size={17} />
          </Link>
        </div>

        {books.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
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

                  <div className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#F6F3EB] text-[#173D32] opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <ArrowRight size={19} />
                  </div>
                </Link>

                <div className="mt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link href={`/books/${book._id}`}>
                        <h3 className="font-heading text-xl font-semibold text-[#173D32] transition-colors group-hover:text-[#A47B48]">
                          {book.title}
                        </h3>
                      </Link>

                      <p className="mt-2 text-sm text-[#777D74]">
                        by {book.author}
                      </p>
                    </div>

                    <BookOpen
                      size={19}
                      strokeWidth={1.5}
                      className="mt-1 shrink-0 text-[#C49A62]"
                    />
                  </div>

                  <div className="mt-5 border-b border-[#DED9CD]" />
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#DED9CD] bg-[#FFFEFA] px-6 py-16 text-center">
            <BookOpen
              size={42}
              strokeWidth={1.3}
              className="mx-auto text-[#C49A62]"
            />

            <h3 className="mt-5 font-heading text-2xl font-semibold text-[#173D32]">
              No books available yet
            </h3>

            <p className="mt-3 text-sm text-[#777D74]">
              Add your first book to see it here.
            </p>
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            href="/books"
            className="inline-flex items-center gap-3 rounded-lg bg-[#173D32] px-7 py-4 text-sm font-semibold text-white transition-all hover:bg-[#285344]"
          >
            Browse the Library
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}
