import { axiosInstance } from "./fetcher";
import { Product, User } from "../types/types";
import { mutate } from "swr";
import toast from "react-hot-toast";

export async function createProduct(productData: Product) {
  const response = await axiosInstance.post("/product", productData);
  mutate("/product"); // Revalidate the products list after adding a new product
  return response.data;
}

export async function updateProduct(productId: string | string[], productData: Product) {
  const response = await axiosInstance.put(
    `/product/${productId}`,
    productData,
  );
  mutate(`/product/${productId}`); // Revalidate the specific product
  return response.data;
}

export async function deleteProduct(productId: number, page: number) {
  const response = await axiosInstance.delete(`/product/${productId}`);
  mutate(`/product?page=${page}`);
  toast.success("product deleted");
  return response.data;
}

export async function createUser(userData: User) {
  const response = await axiosInstance.post("/user", userData);
  mutate("/users"); // Revalidate the users list after adding a new user
  return response.data;
}

export async function updateUser(userId: string, userData: User) {
  const response = await axiosInstance.put(`/user/${userId}`, userData);
  mutate(`/users/${userId}`); // Revalidate the specific user
  return response.data;
}

export async function deleteUser(userId: string) {
  const response = await axiosInstance.delete(`/user/${userId}`);
  mutate("/users"); // Revalidate the users list after deleting
  return response.data;
}
