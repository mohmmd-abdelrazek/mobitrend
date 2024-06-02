"use client";
import { GrSearch } from "react-icons/gr";
import { useRouter } from "../navigation";
import { useState } from "react";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/?keyword=${encodeURIComponent(keyword.trim())}`);
  };
  return (
    <div className="hidden w-full max-w-sm items-center justify-center rounded-full border border-slate-500 bg-white pl-4 focus-within:border-orange-500 focus-within:shadow-sm focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-opacity-50 hover:border-orange-500 hover:shadow-sm hover:ring-2 hover:ring-orange-500 hover:ring-opacity-50 lg:flex">
      <form onSubmit={handleSearch} className="flex w-full max-w-md">
        <input
          className="text-md w-full py-1 text-gray-700 focus:outline-none"
          type="text"
          placeholder="Search product here..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="text-semibold flex h-8 min-w-10 cursor-pointer items-center justify-center rounded-r-full bg-orange-600 text-lg text-white">
          <GrSearch />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
