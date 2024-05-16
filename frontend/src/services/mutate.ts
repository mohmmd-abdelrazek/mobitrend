import { axiosInstance } from "./fetcher";
import { Product, User } from "../types/types";
import { mutate } from "swr";
import toast from "react-hot-toast";

export async function createProduct(productData: Product) {
  const response = await axiosInstance.post("/product", productData);
  mutate("/product");
  return response.data;
}

export async function updateProduct(
  productId: string | string[],
  productData: Product,
) {
  const response = await axiosInstance.put(
    `/product/${productId}`,
    productData,
  );
  mutate(`/product/${productId}`);
  return response.data;
}

export async function deleteProduct(productId: number) {
  const response = await axiosInstance.delete(`/product/${productId}`);
  toast.success("product deleted");
  return response.data;
}

export async function uploadImages(
  productId: string | string[],
  data: FormData,
) {
  const response = await axiosInstance.post(
    `/product/${productId}/upload-images`,
    data,
  );
  mutate(`/product/${productId}/images`);
  toast.success("images uploaded");
  return response.data;
}

export async function addReview(productId: string | string[], data: any) {
  const response = await axiosInstance.post(`/review/${productId}`, data);
  mutate(`/review/${productId}`);
  toast.success("review added");
  return response.data;
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
  mutate("/user"); // Revalidate the users list after adding a new user
  return response.data;
}

export async function updateUser(userId: string, userData: User) {
  const response = await axiosInstance.put(`/user/${userId}`, userData);
  mutate(`/user/${userId}`); // Revalidate the specific user
  return response.data;
}

export async function deleteUser(userId: string) {
  const response = await axiosInstance.delete(`/user/${userId}`);
  mutate("/user"); // Revalidate the users list after deleting
  return response.data;
}

export const addItemToCart = async (
  productId: string | string[],
  qty: number,
) => {
  const response = await axiosInstance.post("/cart/add", { productId, qty });
  mutate("/cart"); // Optimistically update the cache
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
