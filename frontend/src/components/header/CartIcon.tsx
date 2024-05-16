"use client";

import { Link } from "@/src/navigation";
import { useCart } from "@/src/services/queries";
import { FaShoppingCart } from "react-icons/fa";
import LoadingIndicator from "../LoadingIndicator";

const CartIcon = () => {
  const { data: cart, isLoading, error } = useCart();
  if (isLoading)
    return (
      <div className="flex-1">
        <LoadingIndicator />
      </div>
    );
  if (error) return <p className="flex-1">Error loading the cart.</p>;
  return (
    <p>
      {cart.cartItems.reduce((total: number, item: any) => total + item.qty, 0)}
    </p>
  );
};

export default CartIcon;
