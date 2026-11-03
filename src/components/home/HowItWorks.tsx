import Link from "next/link";
import {
  Search,
  BookOpen,
  BookmarkCheck,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "Explore our growing collection of books. Find stories, ideas, and knowledge that match your interests.",
    icon: Search,
  },
  {
    number: "02",
    title: "Borrow",
    description:
      "Found something interesting? Borrow your favorite book and enjoy seven days of uninterrupted reading.",
    icon: BookOpen,
  },
  {
    number: "03",
    title: "Enjoy & Return",
    description:
      "Immerse yourself in every page, then return your book so someone else can discover its magic.",
    icon: BookmarkCheck,
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#EEEAE1] px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-[#A47B48]">
            SIMPLE BY DESIGN
          </p>

          <h2 className="font-heading text-4xl font-semibold text-[#173D32] md:text-5xl">
            A Better Way to Read.
          </h2>

          <p className="mt-5 text-sm leading-7 text-[#777D74] md:text-base">
            Your next favorite book is closer than you think.
            Three simple steps are all it takes to begin.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <article
                key={step.number}
                className="group relative rounded-2xl border border-[#DED9CD] bg-[#F6F3EB] p-8 transition-all duration-300 hover:-translate-y-2 hover:border-[#C49A62] hover:shadow-xl hover:shadow-[#173D32]/5 md:p-10"
              >
                <div className="mb-12 flex items-center justify-between">
                  <span className="font-heading text-4xl text-[#C49A62]">
                    {step.number}
                  </span>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#173D32] text-[#C49A62] transition-transform duration-300 group-hover:rotate-6">
                    <Icon size={25} strokeWidth={1.6} />
                  </div>
                </div>

                <h3 className="font-heading text-2xl font-semibold text-[#173D32]">
                  {step.title}
                </h3>

                <p className="mt-4 min-h-20 text-sm leading-7 text-[#777D74]">
                  {step.description}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-[#DED9CD] pt-5">
                  <span className="text-xs font-medium tracking-wider text-[#777D74]">
                    STEP {step.number}
                  </span>

                  <ArrowUpRight
                    size={19}
                    className="text-[#C49A62] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 flex flex-col items-center justify-between gap-5 rounded-2xl bg-[#173D32] px-8 py-9 text-center md:flex-row md:px-12 md:text-left">
          <div>
            <h3 className="font-heading text-2xl font-semibold text-[#F6F3EB]">
              Ready to find your next read?
            </h3>
            <p className="mt-2 text-sm text-white/65">
              A world of stories is waiting for you.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex shrink-0 items-center gap-3 rounded-lg bg-[#C49A62] px-6 py-3.5 text-sm font-semibold text-[#26332D] transition-colors hover:bg-[#D5B47F]"
          >
            Explore Books
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </section>
  );
}