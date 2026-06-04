"use client";

import Image from "next/image";
import { Check, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { product } from "@/data/product";
import { getSection } from "@/data/sections";
import { MagneticButton } from "@/components/motion/MagneticButton";

export function ProductDetail() {
  const [selectedMl, setSelectedMl] = useState<50 | 100>(50);
  const [added, setAdded] = useState(false);
  const copy = getSection("product");
  const selected = product.sizes.find((size) => size.ml === selectedMl) ?? product.sizes[0];

  return (
    <section className="product-section" aria-labelledby="product-title">
      <div className="section-shell product-layout">
        <div className="product-image">
          <Image
            src={product.heroImage}
            alt="Solène bottle"
            width={540}
            height={720}
            sizes="(max-width: 768px) 82vw, 420px"
          />
        </div>
        <div className="product-panel">
          <p className="eyebrow">{product.house}</p>
          <h2 id="product-title" className="display">
            {copy?.heading}
          </h2>
          <p className="product-body">{copy?.body}</p>
          <div className="size-toggle" aria-label="Select bottle size">
            {product.sizes.map((size) => (
              <button
                className={selectedMl === size.ml ? "active" : ""}
                key={size.ml}
                onClick={() => setSelectedMl(size.ml)}
                type="button"
              >
                {size.ml}ml
              </button>
            ))}
          </div>
          <p className="price">{selected.priceLabel}</p>
          <div className="inci">
            <span>INCI</span>
            <p>{product.inci.join(", ")}</p>
          </div>
          <MagneticButton
            className={added ? "is-added" : ""}
            onClick={() => setAdded(true)}
            type="button"
          >
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
            {added ? "Added" : "Add to bag"}
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
