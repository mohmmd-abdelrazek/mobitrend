"use client";
import QuantitySelector from "@/src/components/QuantitySelector";
import {
  clearCart,
  removeItemFromCart,
  updateItemInCart,
} from "@/src/services/mutate";
import { useCart } from "@/src/services/queries";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

const CartPage = () => {
  const { data: cart, isLoading, error, mutate } = useCart();

  useEffect(() => {
    mutate(); // This may not be necessary unless you need to force a revalidation
  }, [mutate]);

  if (isLoading) return <p className="flex-1">Loading...</p>;
  if (error) return <p className="flex-1">Error loading the cart.</p>;

  const handleQuantityChange = (productId: string, newQty: number) => {
    updateItemInCart(productId, newQty); // Assume this function is properly defined to handle API requests
    mutate(); // Optimistically update or re-fetch data
  };

  return (
    <div className="responsive-container flex flex-1 flex-col items-start gap-8 py-8 md:flex-row md:gap-20">
      <div className="flex w-full flex-col md:flex-1">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {cart?.cartItems.length > 0
              ? `Your Cart: ${cart.cartItems.length} items`
              : "Your Cart is empty"}
          </h2>
          {cart?.cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="rounded bg-red-500 px-4 py-2 text-white transition duration-300 hover:bg-red-700"
            >
              Clear Cart
            </button>
          )}
        </div>
        <div className="flex flex-col gap-6">
          {cart.cartItems.map((item: any) => (
            <div
              key={item.product}
              className="flex items-center justify-between rounded bg-white p-4 shadow"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                />
                <div className="flex w-52 flex-col overflow-hidden text-ellipsis whitespace-nowrap px-2">
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-gray-500">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              </div>
              <QuantitySelector
                maxQty={item.countInStock}
                onQuantityChange={(newQty) =>
                  handleQuantityChange(item.product, newQty)
                }
                quantity={item.qty}
              />
              <button
                onClick={() => removeItemFromCart(item.product)}
                className="text-red-500 transition duration-300 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 w-52 rounded bg-gray-100 p-4 text-lg shadow">
        <h3 className="mb-3 text-lg font-bold">Order Summary</h3>
        <p>
          Total Items:{" "}
          {cart.cartItems.reduce(
            (total: number, item: any) => total + item.qty,
            0,
          )}
        </p>
        <p>
          <span>Total:</span> $
          {cart.cartItems.reduce(
            (total: number, item: any) => total + item.qty,
            0,
          ) === 0
            ? 0
            : cart.totalPrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CartPage;
