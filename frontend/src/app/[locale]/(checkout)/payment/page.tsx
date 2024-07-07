"use client";
import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { axiosInstance } from "@/src/services/fetcher";
import { ShippingDetails } from "@/src/types/types";
import { useRouter } from "@/src/navigation";
import { addOrder } from "@/src/services/mutate";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const Payment = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [shippingDetails, setShippingDetails] =
    useState<ShippingDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("cod"); // Default to COD
  const [loading, setLoading] = useState<boolean>(false); // State to track loading
  const router = useRouter();

  useEffect(() => {
    const savedShippingDetails = localStorage.getItem("shippingDetails");
    if (savedShippingDetails) {
      setShippingDetails(JSON.parse(savedShippingDetails));
    }

    const fetchCartItems = async () => {
      try {
        const { data: cart } = await axiosInstance.get("/cart");
        if (cart && cart.cartItems.length > 0) {
          const items = cart.cartItems.map((cartItem: any) => ({
            name: cartItem.name,
            price: cartItem.price,
            qty: cartItem.qty,
            product: cartItem.product,
            image: cartItem.image,
          }));
          const total = items.reduce(
            (acc: number, item: any) => acc + item.price * item.qty,
            0,
          );
          setCartItems(items);
          setTotalPrice(cart.totalPrice);
        }
      } catch (error) {
        console.error("Error fetching order items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handlePaymentSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setLoading(true); // Start loading

    if (paymentMethod === "cod") {
      const order = {
        orderItems: cartItems,
        shippingAddress: shippingDetails,
        paymentMethod: "cash",
        itemsPrice: totalPrice,
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: totalPrice,
      };
      await addOrder(order);
      router.push("/me/orders");
    } else {
      try {
        const { data } = await axiosInstance.post(
          "/payment/create-checkout-session",
          {
            cartItems,
          },
        );

        const stripe = await stripePromise;
        if (!stripe) return;

        const { id: sessionId } = data;

        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          console.error("Error redirecting to Stripe Checkout:", error);
        }
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    }

    setLoading(false); // Stop loading
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Payment</h1>
      <form onSubmit={handlePaymentSubmit} className="max-w-sm mx-auto">
        <div className="mb-4">
          <input
            type="radio"
            id="cod"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <label htmlFor="cod" className="font-medium">
            Cash on Delivery
          </label>
        </div>
        <div className="mb-4">
          <input
            type="radio"
            id="card"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mr-2"
          />
          <label htmlFor="card" className="font-medium">
            Credit/Debit Card
          </label>
        </div>
        <button
          type="submit"
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default Payment;