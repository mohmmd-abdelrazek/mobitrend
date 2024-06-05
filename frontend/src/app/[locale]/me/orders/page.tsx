"use client";
import { useMyOrders } from "@/src/services/queries";
import { FaEdit, FaUpload, FaTrashAlt } from "react-icons/fa";
import clsx from "clsx";
import { deleteOrder } from "@/src/services/mutate";
import { Link } from "@/src/navigation";
import Pagination from "@/src/components/Pagination";

const MyOrdersPage = () => {
  const { data: orders, isLoading, error, mutate: mutateOrders } = useMyOrders();
  console.log(orders)


  if (isLoading) return <p className="flex-1">Loading...</p>;
  if (error) {
    console.error('Error fetching orders:', error);
    return <div className="flex-1">{error.message}</div>;
  }

  return (
    <div className="flex responsive-container flex-1 w-full flex-col">
      <h1 className="my-4 text-xl font-bold sm:text-2xl">
        {orders?.length ? `Number of orders: ${orders.length}` : ""}
      </h1>
      <div className="w-full flex-1 overflow-x-auto">
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
          {!orders?.length && <p className="py-4">No orders found</p>}
          <tbody>
            {orders?.map((order: any, index: number) => (
              <tr
                key={order._id}
                className={clsx(index % 2 === 0 ? "bg-white" : "bg-gray-200")}
              >
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 sm:px-6 sm:py-4">
                  {order._id}
                </td>
                <td className="max-w-48 overflow-hidden text-ellipsis whitespace-nowrap text-pretty border border-gray-300 px-4 py-2 text-sm text-gray-900 sm:px-6 sm:py-4">
                  
                </td>
                <td className="border border-gray-300 px-4 py-2 text-sm text-gray-900 sm:px-6 sm:py-4">
                  
                </td>
                <td className="flex gap-2 border border-gray-300 px-4 py-2 text-sm text-gray-900 sm:px-6 sm:py-4">
                  <Link
                    href={`/admin/orders/${order._id}/update`}
                    className="rounded-md border-2 border-orange-500 p-1 text-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    <FaEdit />
                  </Link>
                  <Link
                    href={`/admin/orders/${order._id}/upload-images`}
                    className="rounded-md border-2 border-green-500 p-1 text-green-500 hover:bg-green-500 hover:text-white"
                  >
                    <FaUpload />
                  </Link>
                  <button
                    onClick={async () => {
                      await deleteOrder(order._id);
                      mutateOrders();
                    }}
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
      <Pagination />
    </div>
  );
};

export default MyOrdersPage;
