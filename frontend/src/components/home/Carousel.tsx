"use client";
import { useState } from "react";
import { useFilteredProducts } from "@/src/services/queries";
import { Product } from "@/src/types/types";
import Image from "next/legacy/image";

const Carousel = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useFilteredProducts();
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load products.</p>;
  const products = data.products;
  if (!products.length) return <p>No products found.</p>;

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrev = () => {
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + products.length) % products.length,
    );
  };

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="carousel carousel-center bg-neutral rounded-box space-x-4 p-4">
        {products.map((item: Product, index: number) => (
          <div
            key={item._id}
            className={`carousel-item ${index === activeIndex ? "active" : ""}`}
          >
            <div className="relative h-40 w-full">
              <Image
                src={"/path/to/default/image.jpg"} // Ensure you have a default image at this path
                alt={`${item.name} image`}
                layout="fill"
                objectFit="contain"
                className="rounded-box"
              />
            </div>
          </div>
        ))}
      </div>
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-1 shadow-lg"
        onClick={handlePrev}
        aria-label="Previous Slide"
      >
        ❮
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-white p-1 shadow-lg"
        onClick={handleNext}
        aria-label="Next Slide"
      >
        ❯
      </button>
    </div>
  );
};

export default Carousel;
