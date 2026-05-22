"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { resolveRedirect } from "@/lib/redirect";
import { cn } from "@/lib/utils";

import type { HomeSlide } from "../queries";

/**
 * Home slider — matches Flutter's CarouselSlider with enlargeCenterPage
 * and ExpandingDotsEffect indicators. Each card is 180px tall, rounded
 * 20px, image with a dark gradient overlay and white headline.
 */
export function HomeSlider({ slides }: { slides: HomeSlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "center",
    containScroll: false,
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (slides.length === 0) return null;

  return (
    <section>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide, i) => (
            <Slide
              key={slide.id}
              slide={slide}
              isActive={i === selected}
            />
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="mt-3 flex items-center justify-center gap-1.5">
          {slides.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2.5 rounded-full transition-all duration-200",
                i === selected
                  ? "w-6 bg-primary"
                  : "w-2.5 bg-primary/30"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Slide({
  slide,
  isActive,
}: {
  slide: HomeSlide;
  isActive: boolean;
}) {
  const redirect = resolveRedirect(slide.redirectUrl);

  const inner = (
    <div
      className={cn(
        "relative h-[180px] w-full overflow-hidden rounded-[20px] bg-foreground/5 shadow-md transition-transform duration-300",
        !isActive && "scale-[0.92] opacity-90"
      )}
    >
      {slide.imageUrl ? (
        <Image
          src={slide.imageUrl}
          alt={slide.text ?? "Featured"}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 600px, 90vw"
          priority
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-primary/5 text-muted-foreground">
          {slide.text ?? "Featured"}
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
      {slide.text && (
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-base font-bold text-white drop-shadow-md">
            {slide.text}
          </p>
        </div>
      )}
    </div>
  );

  const wrapperClass = "min-w-0 flex-[0_0_88%] px-2";

  if (redirect.kind === "external") {
    return (
      <a
        href={redirect.href}
        target="_blank"
        rel="noreferrer"
        className={wrapperClass}
      >
        {inner}
      </a>
    );
  }
  if (redirect.kind === "internal") {
    return (
      <Link href={redirect.href} className={wrapperClass}>
        {inner}
      </Link>
    );
  }
  return <div className={wrapperClass}>{inner}</div>;
}
