"use client";

import { useProductImages } from "@/src/services/queries";
import clsx from "clsx";
import Image from "next/legacy/image";
import { useState, useEffect } from "react";

const ImageGallery = () => {
  const { data, isLoading, error } = useProductImages();
  const [activeImage, setActiveImage] = useState("");

  useEffect(() => {
    if (data?.images?.length > 0) {
      setActiveImage(data.images[0]);
    } else {
      setActiveImage(
        "https://res.cloudinary.com/dhliba9i5/image/upload/v1714169979/products/default-placeholder_r9thjf.png",
      );
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load images.</div>;

  const handleImageClick = (image: string) => {
    setActiveImage(image);
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <div className="relative aspect-square w-full">
        <Image
          src={activeImage}
          alt="Active product image"
          layout="fill"
          className="rounded-lg object-cover object-center transition-transform duration-300 ease-in-out group-hover:scale-110"
        />
      </div>
      <div className="flex w-full gap-2 overflow-x-auto">
        {data?.images?.map((image: string, index: number) => (
          <div
            key={index}
            className={clsx(
              "h-18 w-18 relative flex-shrink-0 cursor-pointer overflow-hidden rounded-lg transition-shadow duration-300 ease-in-out sm:h-20 sm:w-20",
              {
                "border-2 border-orange-500 border-opacity-80 shadow-xl":
                  image === activeImage,
                "shadow hover:shadow-md": image !== activeImage,
              },
            )}
            onClick={() => handleImageClick(image)}
            onKeyDown={(event) =>
              event.key === "Enter" && handleImageClick(image)
            }
            tabIndex={0}
            aria-label={`View image ${index + 1}`}
          >
            <Image
              src={image}
              alt={`Thumbnail ${index + 1}`}
              layout="fill"
              className="transform rounded-lg object-cover object-center"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
