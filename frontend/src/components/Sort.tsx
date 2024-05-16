import { cn } from "@/src/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useRouter, usePathname } from "@/src/navigation";
import { useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { name: "None", value: "none" },
  { name: "Price: Low to High", value: "price-asc" },
  { name: "Price: High to Low", value: "price-desc" },
] as const;

const Sort = () => {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();
  
    const selectedSort = searchParams.get("sort") || "none";

  return (
    <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="group inline-flex justify-center focus:outline-none text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDown className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {SORT_OPTIONS.map((option) => (
                      <DropdownMenuItem asChild className={cn(
                        "block w-full px-4 py-2 text-left text-sm hover:bg-gray-100",
                        {
                          "bg-gray-100 text-gray-900":
                            selectedSort === option.value,
                          "text-gray-500": selectedSort !== option.value,
                        },
                      )}
                      key={option.name}>
                        <button
                        onClick={() => {
                          const newParams = new URLSearchParams(searchParams);
                          if (option.value === "none") {
                            newParams.delete("sort");
                          } else {
                            newParams.set("sort", option.value);
                          }
                          router.replace(
                            `${pathname}?${newParams.toString()}`,
                          );
                        }}
                      >
                        {option.name}
                      </button>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
  )
}

export default Sort