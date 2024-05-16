import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "../navigation";
import { useProducts } from "../services/queries";

const Pagination = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") as string) || 1;
  const {data} = useProducts()
  const pageNumbers = Array.from({ length: data?.totalPages }, (_, i) => i + 1);
  console.log(currentPage, data);


  const onPageChange = (pageNumber: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pageNumber.toString());
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  return (
    <div className="mt-4 flex items-center justify-center text-sm font-bold">
      <button
        className="border border-gray-300 bg-gray-200 px-2 py-1 hover:bg-white"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        First
      </button>
      <button
        className="border border-gray-300 bg-gray-200 px-2 py-1 hover:bg-white"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          className={`border border-gray-300 px-2 py-1 ${currentPage === number ? "bg-blue-500 text-white" : "bg-white text-blue-500 hover:bg-blue-500 hover:text-white"}`}
          onClick={() => onPageChange(number)}
          disabled={currentPage === number}
        >
          {number}
        </button>
      ))}
      <button
        className="border border-gray-300 px-2 py-1 hover:bg-blue-500 hover:text-white"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === data?.totalPages}
      >
        Next
      </button>
      <button
        className="border border-gray-300 px-2 py-1 hover:bg-blue-500 hover:text-white"
        onClick={() => onPageChange(data?.totalPages)}
        disabled={currentPage === data?.totalPages}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;
