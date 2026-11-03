import Link from "next/link";
import {
  BookOpen,
  FlaskConical,
  Landmark,
  Baby,
  Shapes,
  ArrowUpRight,
} from "lucide-react";

const categories = [
  {
    name: "Fiction",
    description: "Stories that take you beyond imagination.",
    count: "Explore stories",
    icon: BookOpen,
    number: "01",
  },
  {
    name: "Science",
    description: "Discover the wonders of our universe.",
    count: "Explore knowledge",
    icon: FlaskConical,
    number: "02",
  },
  {
    name: "History",
    description: "Travel through time and human history.",
    count: "Explore the past",
    icon: Landmark,
    number: "03",
  },
  {
    name: "Kids",
    description: "Wonderful adventures for young minds.",
    count: "Explore adventures",
    icon: Baby,
    number: "04",
  },
  {
    name: "Others",
    description: "Find something unexpected and inspiring.",
    count: "Explore more",
    icon: Shapes,
    number: "05",
  },
];

export default function Categories() {
  return (
    <section className="bg-[#F6F3EB] px-5 py-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-14 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-[#A47B48]">
              FIND YOUR INTEREST
            </p>

            <h2 className="font-heading text-4xl font-semibold text-[#173D32] md:text-5xl">
              Explore by Category.
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#777D74] md:text-base">
              Every reader has a different journey. Find the collection
              that speaks to yours.
            </p>
          </div>

          <span className="text-sm font-medium text-[#777D74]">
            05 Collections
          </span>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, index) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href={`/books?category=${category.name}`}
                className={`group relative flex min-h-[230px] flex-col justify-between overflow-hidden rounded-2xl border border-[#DED9CD] bg-[#FFFEFA] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#C49A62] hover:shadow-xl hover:shadow-[#173D32]/5 md:p-9 ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#173D32] text-[#C49A62] transition-transform duration-300 group-hover:rotate-6">
                    <Icon size={26} strokeWidth={1.6} />
                  </div>

                  <span className="font-heading text-3xl text-[#DED9CD] transition-colors group-hover:text-[#C49A62]">
                    {category.number}
                  </span>
                </div>

                <div className="mt-10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="font-heading text-2xl font-semibold text-[#173D32]">
                        {category.name}
                      </h3>

                        <p className="mt-2 max-w-sm text-sm leading-6 text-[#777D74]">
                          {category.description}
                        </p>
                    </div>

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#DED9CD] text-[#173D32] transition-all group-hover:border-[#173D32] group-hover:bg-[#173D32] group-hover:text-white">
                      <ArrowUpRight size={19} />
                    </div>
                  </div>

                    <p className="mt-5 text-[10px] font-semibold tracking-[0.16em] text-[#A47B48]">
                      {category.count.toUpperCase()}
                    </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}