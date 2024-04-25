import useSWR from "swr";
import { Order, Product, Review, User } from "../types/types";
import { useParams } from "next/navigation";

// Helper function to extract numerical IDs from paths or slugs
const extractId = (pathSlug: string | string[] | undefined): number | null => {
  if (typeof pathSlug !== "string") return null;
  const possibleId = pathSlug.split("-").pop();
  const id = Number(possibleId);
  return !isNaN(id) && id > 0 ? id : null;
};

export function useAuth() {
  return useSWR("/auth/status");
}

export function useProducts(page: number) {
  return useSWR(`/product?page=${page}`);
}

export function useProduct() {
  const { productId } = useParams();
  return useSWR(productId ? `/product/${productId}` : null);
}

export function useProductImages() {
  const { productId } = useParams();
  return useSWR(productId ? `/product/${productId}/images` : null);
}

export function useUsers() {
  return useSWR<User[]>("/user");
}

export function useUser() {
  return useSWR<User>("/user/profile");
}

export function useReviews() {
  const { productId } = useParams();
  return useSWR<Review[]>(
    productId ? `/product/${productId}/reviews` : null,
  );
}

export function useOrders() {
  return useSWR<Order[]>("/order");
}

export function useOrder() {
  const { orderId } = useParams();
  return useSWR<Order>(orderId ? `/order/${orderId}` : null);
}
