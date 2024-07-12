"use client";
import { useRouter } from "../navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import clsx from "clsx";

type Category = {
  name: string;
  image: string;
};

const categories: Category[] = [
  { name: "mobiles", image: "https://res.cloudinary.com/dhliba9i5/image/upload/v1720756103/categories/mobile_chvkdk.png" },
  { name: "airpodes", image: "https://res.cloudinary.com/dhliba9i5/image/upload/v1720756103/categories/airpodes_ec2i74.png" },
  { name: "watches", image: "https://res.cloudinary.com/dhliba9i5/image/upload/v1720756103/categories/smart-watch_so46wc.png" },
];

const Categories = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const category = searchParams.get("categories");
    if (category) {
      setSelectedCategory(category);
    } else {
      setSelectedCategory("all");
    }
  }, [searchParams]);

  const handleCategoryClick = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === "all") {
      newParams.delete("categories");
    } else {
      newParams.set("categories", category);
    }
    router.push(`/?${newParams.toString()}`);
    setSelectedCategory(category);
  };

  return (
    <div className="flex items-center gap-8 p-4">
          <div
            className={clsx(
                "flex justify-center aspect-square items-center text-sm font-semibold text-gray-900 p-4 cursor-pointer rounded-full",
                selectedCategory === "all"
                ? "text-indigo-500 ring-2 ring-indigo-500"
                : "hover:text-gray-300 hover:ring-2 hover:ring-gray-300"
            )}
            onClick={() => handleCategoryClick("all")}
          >
            {"all".toUpperCase()}
          </div>
      {categories.map((category) => (
        <div
          key={category.name}
          onClick={() => handleCategoryClick(category.name)}
          className="flex flex-col items-center group cursor-pointer"
        >
          <div className={clsx(
              "p-2 rounded-full",
              selectedCategory === category.name
                ? "ring-2 ring-indigo-500"
                : "group-hover:ring-2 group-hover:ring-gray-300"
            )}>
          <div
            className=
              "relative rounded-full w-8 aspect-square"
          >
            <Image
              src={category.image}
              alt={category.name}
              className="object-cover object-center"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 30vw"
              priority
            />
          </div>
          </div>
          <div
            className={clsx(
              "mt-2 text-center text-xs font-medium text-gray-900",
              selectedCategory === category.name
                ? "text-indigo-500"
                : "group-hover:text-gray-300"
            )}
          >
            {category.name.toUpperCase()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;
