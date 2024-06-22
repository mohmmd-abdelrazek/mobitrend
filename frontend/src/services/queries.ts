import useSWRImmutable from "swr/immutable";
import { Cart, Order, Product, Review, User } from "../types/types";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";

const extractId = (pathSlug: string | string[] | undefined): number | null => {
  if (typeof pathSlug !== "string") return null;
  const possibleId = pathSlug.split("-").pop();
  const id = Number(possibleId);
  return !isNaN(id) && id > 0 ? id : null;
};

export function useAuth() {
  return useSWRImmutable("/auth/status");
}

export function useProducts() {
  const searchParams = useSearchParams();
  return useSWRImmutable(`/product?${searchParams}`);
}

export function useProduct() {
  const { productId } = useParams();
  return useSWRImmutable(productId ? `/product/${productId}` : null);
}

export function useProductImages() {
  const { productId } = useParams();
  return useSWRImmutable(productId ? `/product/${productId}/images` : null);
}

export function useProductImage(productId: number) {
  return useSWRImmutable(productId ? `/product/${productId}/images` : null);
}

export function useUsers() {
  return useSWRImmutable<User[]>("/user");
}

export function useUser() {
  return useSWRImmutable<User>("/user/profile");
}

export function useAvatar() {
  return useSWRImmutable<User>("/user/avatar");
}

export function useReviews() {
  const { productId } = useParams();
  return useSWRImmutable<Review[]>(
    productId ? `/review/${productId}` : null,
  );
}

export function useCart() {
  return useSWRImmutable<Cart>("/cart");
}

export function useAllOrders() {
  return useSWRImmutable<Order[]>("/order");
}

export function useMyOrders() {
  return useSWRImmutable<Order[]>("/order/myorders");
}

export function useOrder() {
  const { orderId } = useParams();
  return useSWRImmutable<Order>(orderId ? `/order/${orderId}` : null);
}
