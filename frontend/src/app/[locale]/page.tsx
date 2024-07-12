"use client";

import { useProducts } from "@/src/services/queries";
import { useSearchParams } from "next/navigation";
import FilterSide from "@/src/components/FilterSide";
import Pagination from "@/src/components/Pagination";
import Products from "@/src/components/Products";
import PromotionBanner from "@/src/components/home/PromotionBanner";
import Sort from "@/src/components/Sort";
import Categories from "@/src/components/categories";

const HomePage = () => {
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword");

  const { data } = useProducts();

  return (
    <div className="large-container flex flex-1 flex-col gap-8 py-4">
      {/* {!keyword && <PromotionBanner />} */}
      {!keyword && (
        <div>
          <h2 className="text-xl font-bold border-b border-gray-300">Categories</h2>
          <Categories />
        </div>
      )}
      <div className="flex w-full flex-1 gap-8">
        {keyword && (
          <div>
            <FilterSide />
          </div>
        )}
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between border-b border-gray-300">
            <h2 className="text-xl font-bold">
              {keyword
                ? `${data?.productsCount} products match keyword: ${keyword}`
                : "Latest Products"}
            </h2>
            {keyword && <Sort />}
          </div>
          <Products />
        </div>
      </div>
      {!keyword && <Pagination />}
    </div>
  );
};

export default HomePage;
