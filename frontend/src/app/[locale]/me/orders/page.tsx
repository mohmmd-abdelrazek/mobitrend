"use client";
import { useMyOrders } from "@/src/services/queries";
import clsx from "clsx";
import { Link } from "@/src/navigation";
import { Eye, Printer } from "lucide-react";
import { useEffect } from "react";
import { mutate } from "swr";
import LoadingIndicator from "@/src/components/LoadingIndicator";

const MyOrdersPage = () => {
  const { data: orders, isLoading, error, mutate: mutateOrders } = useMyOrders();

  useEffect(() => {
    mutateOrders();
    mutate("/cart")
  }, [mutateOrders])
  

  if (isLoading) return <div className="flex-1 flex justify-center items-center"><LoadingIndicator w={4} d={4} /></div>;
  if (error) {
    console.error('Error fetching orders:', error);
    return <div className="flex-1">{error.message}</div>;
  }

  return (
    <div className="flex large-container flex-1 w-full flex-col">
      <h1 className="my-4 text-xl font-bold sm:text-2xl">
        {orders?.length ? `Number of orders: ${orders.length}` : "No orders found"}
      </h1>
      <div className="w-full flex-1 overflow-x-auto">
        <table className="min-w-full table-auto border-collapse text-left">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 sm:px-6 sm:py-3">
                ID
              </th>
              <th className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 sm:px-6 sm:py-3">
                Amount
              </th>
              <th className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 sm:px-6 sm:py-3">
                Payment Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 sm:px-6 sm:py-3">
                Order Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 sm:px-6 sm:py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.slice(0).reverse().map((order: any, index: number) => (
              <tr
                key={order._id}
                className={clsx(index % 2 === 0 ? "bg-white" : "bg-gray-200")}
              >
                <td className="border border-gray-300 px-4 py-1 text-sm text-gray-900 sm:px-6 sm:py-2">
                  {order._id}
                </td>
                <td className="max-w-48 overflow-hidden text-ellipsis whitespace-nowrap text-pretty border border-gray-300 px-4 py-1 text-sm text-gray-900 sm:px-6 sm:py-1">
                  ${order.totalPrice}
                </td>
                <td className="border border-gray-300 px-4 py-1 text-sm text-gray-900 sm:px-6 sm:py-2">
                  {order.isPaid ? "PAID" : "NOT PAID"}
                </td>
                <td className="border border-gray-300 px-4 py-1 text-sm text-gray-900 sm:px-6 sm:py-2">
                  {order.isDelivered ? "Delivered" : "Processing"}
                </td>
                <td className="flex gap-2 border border-gray-300 px-4 py-1 text-sm text-gray-900 sm:px-6 sm:py-2">
                  <Link
                    href={`/me/orders/${order._id}`}
                    className="rounded-md border-2 border-orange-500 p-1 text-orange-500 hover:bg-orange-500 hover:text-white"
                  >
                    <Eye size={20} />
                  </Link>
                  <Link
                    href={`/invoice/order/${order._id}`}
                    className="rounded-md border-2 border-green-500 p-1 text-green-500 hover:bg-green-500 hover:text-white"
                  >
                    <Printer size={20} />
                  </Link>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default MyOrdersPage;
