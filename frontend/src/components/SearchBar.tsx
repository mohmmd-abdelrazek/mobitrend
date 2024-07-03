"use client";
import { GrClose, GrSearch } from "react-icons/gr";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "../navigation";
import { useState } from "react";

const SearchBar = () => {
  const [keyword, setKeyword] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (keyword.trim() !== "") {
      router.push(`/?keyword=${encodeURIComponent(keyword.trim())}`);
    }
  };

  const toggleSearchMode = () => {
    setIsSearchMode(!isSearchMode);
  };

  return (
    <>
      <button
        onClick={toggleSearchMode}
        className="p-2 text-white focus:outline-none sm:mr-6 md:hidden"
      >
        <FaSearch aria-hidden="true" />
      </button>

      {isSearchMode && (
        <div className="absolute left-0 top-0 z-50 flex w-full bg-white p-2 shadow-md md:hidden">
          <div
            onClick={toggleSearchMode}
            className="flex cursor-pointer items-center justify-center px-2"
          >
            <GrClose />
          </div>
          <form onSubmit={handleSearch} className="flex w-full">
            <input
              className="flex-grow rounded-l-md border border-gray-300 px-2 py-1 text-gray-700 focus:outline-none"
              type="text"
              placeholder="Search product here..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              type="submit"
              className="flex items-center justify-center rounded-r-md bg-orange-600 px-4 text-white"
            >
              <FaSearch />
            </button>
          </form>
        </div>
      )}

      <div className="mr-6 hidden max-w-xs flex-1 items-center justify-center rounded-full border border-slate-500 bg-white pl-4 focus-within:border-orange-500 focus-within:shadow-sm focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-opacity-50 hover:border-orange-500 hover:shadow-sm hover:ring-2 hover:ring-orange-500 hover:ring-opacity-50 md:flex lg:mr-16 lg:max-w-md xl:max-w-xl">
        <form onSubmit={handleSearch} className="flex w-full max-w-xl">
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
    </>
  );
};

export default SearchBar;
