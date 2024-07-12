"use client";
import { useProducts } from "@/src/services/queries";
import { FaEdit, FaUpload, FaTrashAlt } from "react-icons/fa";
import { Product } from "@/src/types/types";
import clsx from "clsx";
import { deleteProduct } from "@/src/services/mutate";
import { Link, usePathname, useRouter } from "@/src/navigation";
import { useSearchParams } from "next/navigation";
import Pagination from "@/src/components/Pagination";

const AdminProductsPage = () => {
  const { data, isLoading, error, mutate: mutateProducts } = useProducts();
  const searchParams = useSearchParams();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load products.</p>;
  const products = data?.products;
  if (!products?.length) return <p>No products found.</p>;

  return (
    <div className="flex w-full flex-col">
      <h1 className="my-4 text-xl font-bold sm:text-2xl">
        Number of Products: {data.productsCount}
      </h1>
      <div className="w-full overflow-x-auto flex-1">
        <table className="min-w-full table-auto border-collapse text-left">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 sm:px-6 sm:py-3">
                ID
              </th>
              <th className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 sm:px-6 sm:py-3">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 sm:px-6 sm:py-3">
                Stock
              </th>
              <th className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 sm:px-6 sm:py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product: Product, index: number) => (
              <tr
                key={product.slug}
                className={clsx(index % 2 === 0 ? "bg-white" : "bg-gray-200")}
              >
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 sm:px-6 sm:py-4">
                  {product.slug}
                </td>
                <td className="max-w-48 overflow-hidden text-ellipsis whitespace-nowrap text-pretty border border-gray-300 px-4 py-2 text-sm text-gray-900 sm:px-6 sm:py-4">
                  {product.name}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 sm:px-6 sm:py-4">
                  {product.inStock}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 sm:px-6 sm:py-4">
                  <div className="flex gap-2 items-center">
                  <Link
                    href={`/admin/products/${product.slug}/update`}
                    className="rounded-md border-2 border-orange-500 p-1 text-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    <FaEdit />
                  </Link>
                  <Link
                    href={`/admin/products/${product.slug}/upload-images`}
                    className="rounded-md border-2 border-green-500 p-1 text-green-500 hover:bg-green-500 hover:text-white"
                  >
                    <FaUpload />
                  </Link>
                  <button
                    onClick={async () => {
                      await deleteProduct(product.slug);
                      mutateProducts();
                    }}
                    className="rounded-md border-2 border-red-500 p-1 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <FaTrashAlt />
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination />
    </div>
  );
};

export default AdminProductsPage;
