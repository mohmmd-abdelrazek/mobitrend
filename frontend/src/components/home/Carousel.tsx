"use client";
import { useState } from "react";
import { useProducts } from "@/src/services/queries";
import { Product } from "@/src/types/types";
import Image from "next/legacy/image";

const Carousel = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useProducts(currentPage);
  const [activeIndex, setActiveIndex] = useState(0);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load products.</p>;
  const products = data.products;
  if (!products.length) return <p>No products found.</p>;


  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  return (
    <div className="relative max-w-2xl mx-auto">
      <div className="carousel carousel-center p-4 space-x-4 bg-neutral rounded-box">
        {products.map((item: Product, index: number) => (
          <div key={item._id} className={`carousel-item ${index === activeIndex ? 'active' : ''}`}>
            <div className="h-40 w-full relative">
              <Image
                src={'/path/to/default/image.jpg'} // Ensure you have a default image at this path
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
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-lg"
        onClick={handlePrev}
        aria-label="Previous Slide"
      >
        ❮
      </button>
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-1 rounded-full shadow-lg"
        onClick={handleNext}
        aria-label="Next Slide"
      >
        ❯
      </button>
    </div>
  );
};

export default Carousel;
