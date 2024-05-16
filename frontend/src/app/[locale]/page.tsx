"use client";

import { useProducts } from "@/src/services/queries";
import { useSearchParams } from "next/navigation";
import FilterSide from "@/src/components/FilterSide";
import Pagination from "@/src/components/Pagination";
import Products from "@/src/components/Products";
import PromotionBanner from "@/src/components/home/PromotionBanner";
import Sort from "@/src/components/Sort";

const HomePage = () => {
  const searchParams = useSearchParams();

  const keyword = searchParams.get("keyword");

  const { data } = useProducts();

  return (
    <div className="responsive-container flex flex-1 flex-col gap-2">
      {!keyword && <PromotionBanner />}
      <div className="flex w-full flex-1 gap-8">
        {keyword && (
          <div>
            <FilterSide />
          </div>
        )}
        <div className="flex flex-1 flex-col">
          <div className="flex justify-between border-b border-gray-300">
            <h1 className="text-xl font-bold">
              {keyword
                ? `${data?.productsCount} products match keyword: ${keyword}`
                : "Latest Products"}
            </h1>
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
