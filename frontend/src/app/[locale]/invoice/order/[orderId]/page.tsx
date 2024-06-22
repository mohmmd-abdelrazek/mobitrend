"use client";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useOrder } from "@/src/services/queries";
import Image from "next/image";

const OrderInvoice = () => {
  const { data: order, error } = useOrder();

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (error) return <div>Failed to load order</div>;

  return (
    <div className="small-responsive-container py-2">
      <div ref={componentRef} className="p-4">
        <h1 className="mb-4 text-2xl font-bold">Invoice #{order?._id}</h1>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Shipping Address</h2>
          <p>{order?.shippingAddress.address}</p>
          <p>
            {order?.shippingAddress.city}, {order?.shippingAddress.postalCode}
          </p>
          <p>{order?.shippingAddress.country}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Order Items</h2>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">image</th>
                <th className="py-2">Item</th>
                <th className="py-2">Qty</th>
                <th className="py-2">Price</th>
                <th className="py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {order?.orderItems.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="py-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={40}
                      height={40}
                      priority
                      className="rounded-md object-cover object-center"
                    />
                  </td>
                  <td className="py-2">{item.name}</td>
                  <td className="py-2 text-center">{item.qty}</td>
                  <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-2 text-right">
                    ${(item.qty * item.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Payment Details</h2>
          <p>Method: {order?.paymentMethod}</p>
          <p>Tax: ${order?.taxPrice.toFixed(2)}</p>
          <p>Shipping: ${order?.shippingPrice.toFixed(2)}</p>
          <p>Total: ${order?.totalPrice.toFixed(2)}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">order Status</h2>
          <p>
            Paid:{" "}
            {order?.isPaid
              ? `Yes, on ${new Date(order?.paidAt ?? "").toLocaleDateString()}`
              : "No"}
          </p>
          <p>Delivered: {order?.isDelivered ? "Yes" : "No"}</p>
        </div>
      </div>
      <button
        onClick={handlePrint}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white"
      >
        Print Invoice
      </button>
    </div>
  );
};

export default OrderInvoice;
