"use client";

import { useState } from "react";
import Image from "next/image";
import { getOptimizedUrl } from "@/lib/utils/cloudinary";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-surface-2 text-text-muted">
        No Image Available
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-surface-2">
        <Image
          src={getOptimizedUrl(images[activeIdx], 800)}
          alt={`${productName} image ${activeIdx + 1}`}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                idx === activeIdx ? "border-accent" : "border-transparent"
              }`}
            >
              <Image
                src={getOptimizedUrl(img, 200)}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
