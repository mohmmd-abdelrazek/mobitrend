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
      return;
    }

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
  };

  return (
    <div>
      <h1>Payment</h1>
      <div>
        {cartItems.map((item, index) => (
          <div key={index}>
            <p>{item.name}</p>
            <p>{item.price}</p>
            <p>{item.qty}</p>
          </div>
        ))}
      </div>
      <p>Total Price: {totalPrice}</p>
      <form onSubmit={handlePaymentSubmit}>
        <input
          type="radio"
          id="cod"
          name="paymentMethod"
          value="cod"
          checked={paymentMethod === "cod"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        <label htmlFor="cod">Cash on Delivery</label>
        <br />
        <input
          type="radio"
          id="card"
          name="paymentMethod"
          value="card"
          checked={paymentMethod === "card"}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        <label htmlFor="card">Credit/Debit Card</label>
        <br />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default Payment;
