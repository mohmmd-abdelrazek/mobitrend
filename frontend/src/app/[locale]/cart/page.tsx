"use client";
import { useState, useEffect, useCallback } from "react";
import {
  clearCart,
  removeItemFromCart,
  updateItemInCart,
} from "@/src/services/mutate";
import { useAuth, useCart, useFilteredProducts } from "@/src/services/queries";
import {
  removeItemFromLocalCart,
  updateItemInLocalCart,
  clearLocalCart,
  getLocalCart,
} from "@/src/utils/indexedDb";
import { Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "@/src/navigation";
import QuantitySelector from "@/src/components/QuantitySelector";
import { Cart } from "@/src/types/types";

const CartPage = () => {
  const { data: remoteCart, isLoading, error, mutate } = useCart();
  const { data: productsData } = useFilteredProducts();
  const { data: status } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const isAuthenticated = status?.isAuthenticated;
  const products = productsData?.products;
  const router = useRouter();
  const localCart = getLocalCart();

  const fetchCart = useCallback(async () => {
    if (isAuthenticated) {
      setCart(remoteCart ?? null);
    } else {
      setCart(await localCart);
    }
  }, [isAuthenticated, localCart, remoteCart]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleClearCart = async () => {
    if (isAuthenticated) {
      await clearCart();
      mutate();
    } else {
      await clearLocalCart();
      setCart(null);
    }
  };

  const handleQuantityChange = async (productId: string, newQty: number) => {
    if (isAuthenticated) {
      await updateItemInCart(productId, newQty);
    } else {
      const updatedCart = await updateItemInLocalCart(productId, newQty);
    }
  };

  const handleRemoveItem = async (productId: string) => {
    if (isAuthenticated) {
      await removeItemFromCart(productId);
      mutate();
    } else {
      const updatedCart = await removeItemFromLocalCart(productId);
      setCart(updatedCart);
    }
  };

  if (isLoading) return <p className="flex-1">Loading...</p>;
  if (error) return <p className="flex-1">Error loading the cart.</p>;

  const cartItems = cart?.cartItems || [];
  const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);
  const totalPrice =
    cartItems.length > 0
      ? cartItems.reduce((total, item) => total + item.price * item.qty, 0)
      : 0;

  return (
    <div className="large-container flex flex-1 flex-col items-start gap-8 py-8 lg:flex-row lg:gap-20">
      <div className="flex w-full max-w-2xl flex-col lg:flex-1">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {cartItems.length > 0
              ? `Your Cart: ${cartItems.length} items`
              : "Your Cart is empty"}
          </h2>
          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="rounded bg-red-500 px-4 py-2 text-white transition duration-300 hover:bg-red-700"
            >
              Clear Cart
            </button>
          )}
        </div>
        <div className="flex flex-col gap-6">
          {cart?.cartItems.map((item: any) => (
            <div
              key={item.product}
              className="flex h-20 items-center justify-between rounded bg-white p-4 shadow"
            >
              <div className="relative aspect-square">
                <Image
                  src={
                    products?.find(
                      (product: any) => product._id === item.product,
                    )?.images[0] || item.image
                  }
                  alt={item.name}
                  width={64}
                  height={64}
                  className="rounded-md object-cover object-center"
                />
              </div>
              <div className="line-clamp-2 w-44 overflow-hidden text-ellipsis px-2 font-semibold">
                {item.name}
              </div>
              <div className="text-gray-500">${item.price.toFixed(2)}</div>
              <QuantitySelector
                maxQty={item.countInStock}
                minQty={1}
                onQuantityChange={(newQty) => {
                  handleQuantityChange(item.product, newQty);
                }}
                quantity={item.qty}
              />
              <button
                onClick={() => handleRemoveItem(item.product)}
                className="text-red-500 transition duration-300 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 w-52 rounded p-4 text-lg shadow-lg">
        <h3 className="mb-3 border-b-2 pb-2 text-lg font-bold">
          Order Summary
        </h3>
        <p>Total Items: {totalItems}</p>
        <p className="mb-3 border-b-2 pb-2">
          <span>Total:</span> ${totalPrice.toFixed(2)}
        </p>
        <button
          className="sm:text-md mx-auto mt-4 block w-full rounded-full bg-orange-500 px-4 py-2 text-sm font-bold text-white transition duration-150 ease-in-out hover:scale-105 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => router.push("/shipping")}
          disabled={cartItems.length < 1}
        >
          Check Out
        </button>
      </div>
    </div>
  );
};

export default CartPage;
