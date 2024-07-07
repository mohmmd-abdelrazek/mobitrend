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
import { FaStar } from "react-icons/fa6";

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

  const debouncedUpdateFilters = useMemo(
    () =>
      debounce((newParams: URLSearchParams) => {
        router.replace(`${pathname}?${newParams.toString()}`);
      }, 300),
    [pathname, router],
  );

  const handleMultiFilterChange = (
    filterType: FilterType,
    value: string,
    isChecked: boolean,
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

  const handleSingleFilterChange = (
    filterType: FilterType,
    value: string,
    isChecked: boolean,
  ) => {
    const updatedValue = isChecked ? value : "";

    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: updatedValue,
    }));

    const newParams = new URLSearchParams(searchParams);
    if (updatedValue) {
      newParams.set(filterType, updatedValue);
    } else {
      newParams.delete(filterType);
    }
    
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
              {["mobiles", "airpodes", "watches"].map((category) => (
                <li key={category} className="flex items-center">
                  <input
                    type="checkbox"
                    id={category}
                    checked={filters.categories.includes(category)}
                    onChange={(e) =>
                      handleMultiFilterChange(
                        "categories",
                        category,
                        e.target.checked,
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor={category}
                    className="ml-3 text-sm text-gray-600"
                  >
                    {category.toUpperCase()}
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
                    type="checkbox"
                    id={rating}
                    checked={filters.ratings === rating}
                    onChange={(e) =>
                      handleSingleFilterChange(
                        "ratings",
                        rating,
                        e.target.checked,
                      )
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <label
                    htmlFor={rating}
                    className="ml-3 text-sm text-gray-600 flex items-center gap-1"
                  >
                    {Array.from({ length: parseInt(rating) }, (_, index) => (
                      <FaStar key={index} color="#ffc107" />
                    ))}
                    {Array.from({ length: 5 - parseInt(rating) }, (_, index) => (
                      <FaStar key={index} color="#aaaaaa" />
                    ))}
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
                      handleSingleFilterChange("price", price, e.target.checked)
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
