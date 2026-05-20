"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { resolveRedirect } from "@/lib/redirect";
import { cn } from "@/lib/utils";

import type { HomeSlide } from "../queries";

/**
 * Home slider — full-width swipeable carousel of admin-authored slides.
 * Mirrors the Flutter app's home rail. Each slide is an image + overlay
 * text that taps through to a route or external URL via resolveRedirect.
 */
export function HomeSlider({ slides }: { slides: HomeSlide[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
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
    <section className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {slides.map((slide) => (
            <Slide key={slide.id} slide={slide} />
          ))}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="mt-3 flex justify-center gap-1.5">
          {slides.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                i === selected ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function Slide({ slide }: { slide: HomeSlide }) {
  const redirect = resolveRedirect(slide.redirectUrl);

  const inner = (
    <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-foreground/5 sm:aspect-[21/9]">
      {slide.imageUrl ? (
        <Image
          src={slide.imageUrl}
          alt={slide.text ?? "Featured"}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 1024px, 100vw"
          priority
        />
      ) : (
        <div className="flex h-full items-center justify-center bg-primary/5 text-muted-foreground">
          {slide.text ?? "Featured"}
        </div>
      )}
      {slide.text && (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-base font-bold uppercase tracking-tight text-white sm:text-xl">
            {slide.text}
          </p>
        </div>
      )}
    </div>
  );

  const wrapperClass = "min-w-0 flex-[0_0_100%] px-1";

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
