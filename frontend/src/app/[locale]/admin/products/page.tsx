"use client";
import { useState } from "react";
import { useProducts } from "@/src/services/queries";
import { FaEdit, FaUpload, FaTrashAlt } from "react-icons/fa";
import { Product } from "@/src/types/types";
import clsx from "clsx";
import { deleteProduct } from "@/src/services/mutate";
import { mutate } from "swr";
import { Link } from "@/src/navigation";

const AdminProductsPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error } = useProducts(currentPage);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load products.</p>;
  const products = data.products;
  if (!products.length) return <p>No products found.</p>;

  return (
    <div className="flex w-full flex-col">
      <h1 className="my-4 text-xl font-bold sm:text-2xl">
        Number of Products: {data.productsCount}
      </h1>
      <div className="w-full overflow-x-auto">
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
                key={product._id}
                className={clsx(index % 2 === 0 ? "bg-white" : "bg-gray-200")}
              >
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 sm:px-6 sm:py-4">
                  {product._id}
                </td>
                <td className="overflow-hidden max-w-48 text-pretty whitespace-nowrap text-ellipsis border border-gray-300 px-4 py-2 text-sm text-gray-900 sm:px-6 sm:py-4">
                  {product.name}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 sm:px-6 sm:py-4">
                  {product.inStock}
                </td>
                <td className="flex gap-2 border border-gray-300 px-4 py-2 text-sm text-gray-900 sm:px-6 sm:py-4">
                  <Link href={`/admin/products/${product._id}/update`} className="rounded-md border-2 border-blue-500 p-1 text-blue-500 hover:bg-blue-500 hover:text-white">
                    <FaEdit />
                  </Link>
                  <Link href={`/admin/products/${product._id}/upload-images`} className="rounded-md border-2 border-green-500 p-1 text-green-500 hover:bg-green-500 hover:text-white">
                    <FaUpload />
                  </Link>
                  <button
                    onClick={() => deleteProduct(product._id, currentPage)}
                    className="rounded-md border-2 border-red-500 p-1 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="my-4 flex justify-center space-x-2">
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </button>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={products && products.length < 10} // Assuming 10 products per page
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminProductsPage;
