
"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    eyebrow: "YOUR NEXT CHAPTER STARTS HERE",
    title: "Every Book Holds a New World.",
    description:
      "Discover extraordinary stories, explore new ideas, and find the books that stay with you forever.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
    button: "Explore Our Library",
  },
  {
    eyebrow: "READ MORE. DISCOVER MORE.",
    title: "A Thousand Stories. One Place.",
    description:
      "From timeless classics to modern discoveries, your next favorite read is waiting for you.",
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    button: "Discover Books",
  },
  {
    eyebrow: "BORROW. READ. RETURN.",
    title: "Good Stories Are Meant to Be Shared.",
    description:
      "Borrow your favorite books, enjoy every page, and pass the joy of reading forward.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d",
    button: "Start Reading",
  },
];

export default function HeroSlider() {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  return (
    <section className="relative w-full bg-[#173D32]">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        speed={900}
        loop
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-white !opacity-50",
          bulletActiveClass: "!opacity-100 !w-8 !rounded-full",
        }}
        onSwiper={setSwiper}
        className="booknook-hero"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.title}>
            <div
              className="relative flex min-h-[520px] items-center bg-cover bg-center md:min-h-[620px]"
              style={{
                backgroundImage: `
                  linear-gradient(
                    90deg,
                    rgba(15, 43, 34, 0.96) 0%,
                    rgba(15, 43, 34, 0.82) 48%,
                    rgba(15, 43, 34, 0.30) 100%
                  ),
                  url('${slide.image}?auto=format&fit=crop&w=2000&q=85')
                `,
              }}
            >
              <div className="mx-auto w-full max-w-7xl px-6 py-24 md:px-10 lg:px-12">
                <div className="max-w-2xl">
                  <p className="mb-6 text-xs font-semibold tracking-[0.25em] text-[#C49A62] md:text-sm">
                    {slide.eyebrow}
                  </p>

                  <h1 className="font-heading text-4xl font-semibold leading-tight text-[#F6F3EB] md:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>

                  <p className="mt-7 max-w-xl text-base leading-8 text-white/75 md:text-lg">
                    {slide.description}
                  </p>

                  <Link
                    href="/books"
                    className="mt-9 inline-flex items-center gap-3 rounded-lg bg-[#C49A62] px-7 py-4 text-sm font-semibold text-[#26332D] transition-all hover:bg-[#D5B47F]"
                  >
                    {slide.button}
                    <ArrowRight size={18} />
                  </Link>

                  <p className="mt-8 text-xs tracking-widest text-white/50">
                    0{index + 1} / 03
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Slider Controls */}
      <div className="absolute bottom-8 right-6 z-10 flex gap-3 md:right-12">
        <button
          onClick={() => swiper?.slidePrev()}
          aria-label="Previous slide"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-[#173D32]"
        >
          <ChevronLeft size={20} />
        </button>

        <button
          onClick={() => swiper?.slideNext()}
          aria-label="Next slide"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white hover:text-[#173D32]"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
