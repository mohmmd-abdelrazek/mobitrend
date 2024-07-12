import { axiosInstance } from "./fetcher";
import { Cart, Product, User } from "../types/types";
import { mutate } from "swr";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";
import { clearLocalCart, getLocalCart } from "../utils/indexedDb";

export async function createProduct(productData: Product) {
  const response = await axiosInstance.post("/product", productData);
  mutate("/product");
  return response.data;
}

export async function updateProduct(
  productSlug: string,
  productData: Product,
) {
  const response = await axiosInstance.put(
    `/product/${productSlug}`,
    productData,
  );
  mutate(`/product/${productSlug}`);
  return response.data;
}

export async function deleteProduct(productSlug: string) {
  const response = await axiosInstance.delete(`/product/${productSlug}`);
  toast.success("product deleted");
  return response.data;
}

export async function uploadImages(
  productSlug: string | string[],
  data: FormData,
) {
  const response = await axiosInstance.post(
    `/product/${productSlug}/upload-images`,
    data,
  );
  mutate(`/product/${productSlug}/images`);
  toast.success("images uploaded");
  return response.data;
}

export async function uploadAvatar(data: FormData) {
  const response = await axiosInstance.post("/user/upload-avatar", data);
  mutate("user/avatar");
  toast.success("Avatar uploaded");
  return response.data;
}

export async function addReview(productId: string | string[], data: any) {
  try {
    const response = await axiosInstance.post(`/review/${productId}`, data);
    mutate(`/review/${productId}`);
    toast.success("review added");
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      toast.error(error.response?.data.message);
    }
  }
}

export async function deleteImage(imageUrl: string) {
  const response = await axiosInstance.delete(
    `/product/images/${encodeURIComponent(imageUrl)}`,
  );
  toast.success("image deleted");
  return response.data;
}

export async function createUser(userData: User) {
  const response = await axiosInstance.post("/user", userData);
  mutate("/user");
  return response.data;
}

export async function updateUser(userId: string, userData: User) {
  const response = await axiosInstance.put(`/user/${userId}`, userData);
  mutate(`/user/${userId}`);
  return response.data;
}

export async function deleteUser(userId: string) {
  const response = await axiosInstance.delete(`/user/${userId}`);
  mutate("/user");
  return response.data;
}

export const addItemToCart = async (
  productId: string | string[],
  qty: number,
) => {
  const response = await axiosInstance.post("/cart/add", { productId, qty });
  mutate("/cart");
  return response.data;
};

export const removeItemFromCart = async (productId: string | string[]) => {
  const response = await axiosInstance.post("/cart/remove", { productId });
  mutate("/cart");
  return response.data;
};

export const updateItemInCart = async (
  productId: string | string[],
  qty: number,
) => {
  const response = await axiosInstance.post("/cart/update", { productId, qty });
  mutate("/cart");
  return response.data;
};

export const clearCart = async () => {
  const response = await axiosInstance.post("/cart/clear");
  mutate("/cart");
  return response.data;
};

export const mergeCart = async () => {
  try {
    const localCart = await getLocalCart();
    const response = await axiosInstance.post("/cart/merge", { localCart });
    mutate("/cart");
    await clearLocalCart();
    return response.data;
  } catch (error) {
    console.error("Error merging cart:", error);
    throw error;
  }
};

export async function addOrder(orderData: any) {
  const response = await axiosInstance.post("/order", orderData);
  mutate("/order");
  toast.success("Order added successfully");
  return response.data;
}

export async function deleteOrder(orderId: string) {
  const response = await axiosInstance.delete(`/order/${orderId}`);
  mutate("/order");
  toast.success("Order deleted successfully");
  return response.data;
}
