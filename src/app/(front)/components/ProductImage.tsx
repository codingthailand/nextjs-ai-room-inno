"use client";

import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER = "/product-image/placeholder.svg";

type Props = {
  alt?: string;
  src?: string | null;
};

export default function ProductImage({ alt, src }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src || PLACEHOLDER);

  return (
    <Image
      alt={alt ?? ""}
      className="size-full bg-muted object-cover"
      width={0}
      height={0}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      src={currentSrc}
      onError={() => {
        if (currentSrc !== PLACEHOLDER) setCurrentSrc(PLACEHOLDER);
      }}
      loading="eager"
    />
  );
}
