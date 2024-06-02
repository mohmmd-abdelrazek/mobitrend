import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import { useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { cn } from "../lib/utils";

type Filters = {
  categories: string[];
  ratings: string;
  price: string;
};

type FilterType = keyof Filters;

const FilterComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    ratings: "",
    price: "",
  });

  useEffect(() => {
    const categories = searchParams.get("categories")?.split(",") || [];
    const ratings = searchParams.get("ratings") || "";
    const price = searchParams.get("price") || "";
    setFilters({ categories, ratings, price });
  }, [searchParams]);

  // Create a debounced function to update search parameters
  const debouncedUpdateFilters = useMemo(
    () =>
      debounce((newParams: URLSearchParams) => {
        router.replace(`${pathname}?${newParams.toString()}`);
      }, 300), // Adjust debounce delay as needed
    [pathname, router]
  );

  // Handle updating filters, debounced to reduce frequent updates
  const handleMultiFilterChange = (
    filterType: FilterType,
    value: string,
    isChecked: boolean
  ) => {
    const currentFilters = filters[filterType] as string[];
    const updatedFilters = isChecked
      ? [...currentFilters, value]
      : currentFilters.filter((item) => item !== value);
    
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: updatedFilters,
    }));

    const newParams = new URLSearchParams(searchParams);
    if (updatedFilters.length > 0) {
      newParams.set(filterType, updatedFilters.join(","));
    } else {
      newParams.delete(filterType);
    }
    debouncedUpdateFilters(newParams);
  };

  const handleSingleFilterChange = (filterType: FilterType, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));

    const newParams = new URLSearchParams(searchParams);
    newParams.set(filterType, value);
    debouncedUpdateFilters(newParams);
  };

  return (
    <div className="my-16 flex w-48 flex-col gap-4 rounded-lg border p-4 shadow-sm transition-shadow duration-300 hover:shadow-lg">
      <h2 className="border-b">Filters</h2>
      <Accordion
        type="multiple"
        defaultValue={["categories", "ratings", "price"]}
        className="flex animate-none flex-col gap-2"
      >
        <AccordionItem value="categories">
          <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">Categories</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <ul className="space-y-2">
              {["electronics", "books", "clothing"].map((category) => (
                <li key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={category}
                    checked={filters.categories.includes(category)}
                    onChange={(e) =>
                      handleMultiFilterChange(
                        "categories",
                        category,
                        e.target.checked
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor={category}
                    className="ml-3 text-sm text-gray-600"
                  >
                    {category}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="ratings">
          <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">Ratings</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <ul className="space-y-2">
              {["5", "4", "3", "2", "1"].map((rating) => (
                <li key={rating} className="flex items-center">
                  <input
                    type="radio"
                    id={rating}
                    checked={filters.ratings === rating}
                    onChange={(e) =>
                      handleSingleFilterChange("ratings", rating)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor={rating}
                    className="ml-3 text-sm text-gray-600"
                  >
                    {rating} Stars & Up
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="price">
          <AccordionTrigger className="py-3 text-sm text-gray-400 hover:text-gray-500">
            <span className="font-medium text-gray-900">Price</span>
          </AccordionTrigger>
          <AccordionContent className="pt-2">
            <ul className="space-y-2">
              {["0-50", "51-100", "101-200"].map((price) => (
                <li key={price} className="flex items-center">
                  <input
                    type="checkbox"
                    id={price}
                    checked={filters.price === price}
                    onChange={(e) =>
                      handleSingleFilterChange("price", price)
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label htmlFor={price} className="ml-3 text-sm text-gray-600">
                    $ {price}
                  </label>
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FilterComponent;
