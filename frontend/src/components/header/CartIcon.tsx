"use client";

import { useAuth, useCart } from "@/src/services/queries";
import LoadingIndicator from "../LoadingIndicator";
import { Cart } from "@/src/types/types";
import { useCallback, useEffect, useState } from "react";
import { getLocalCart } from "@/src/utils/indexedDb";

const CartIcon = () => {
  const { data: status, isLoading: authLoading } = useAuth();
  const { data: remoteCart, isLoading: cartLoading, error } = useCart();
  const localCart = getLocalCart();
  const [cart, setCart] = useState<Cart | null>(null);

  const fetchCart = useCallback(async () => {
    if (status?.isAuthenticated) {
      setCart(remoteCart ?? null);
    } else {
      setCart(await localCart);
    }
  },[localCart, remoteCart, status?.isAuthenticated])

  
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  
  if (cartLoading || authLoading) return <div className="flex-1"><LoadingIndicator w={2} d={2} /></div>;
  if (error) return <div className="flex-1">E</div>;

  const cartItems = cart?.cartItems.reduce(
    (total: number, item: any) => total + item.qty,
    0,
  );
  return <p>{cartItems}</p>;
};

export default CartIcon;
