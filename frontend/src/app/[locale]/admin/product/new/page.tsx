"use client";

import { useState } from "react";
import InputField from "@/src/components/InputField"; // Assuming InputField is imported correctly
import { axiosInstance } from "@/src/services/fetcher";
import toast from "react-hot-toast";
import { mutate } from "swr";

const AddProductForm = () => {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    images: "",
    brand: "",
    inStock: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData({ ...productData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // API endpoint should be configured as per your setup
      const response = await axiosInstance.post("/product", {
        ...productData,
        price: parseFloat(productData.price),
        inStock: parseInt(productData.inStock),
      });
      mutate("/product")
      toast.success("Product added");
      console.log("Product added:", response.data);
      // Handle further actions like clearing the form or showing a success message
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("failed adding product");
      // Handle errors, e.g., displaying error messages
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 px-8 py-2 shadow-xl my-2 lg:w-9/12 xl:w-7/12">
      <h2 className="">New Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <InputField
          id="product-name"
          name="name"
          type="text"
          value={productData.name}
          onChange={handleChange}
          isLoading={isLoading}
          label="Name"
          placeholder="Enter product name"
        />
        <InputField
          id="product-description"
          name="description"
          textarea={true}
          value={productData.description}
          onChange={handleChange}
          isLoading={isLoading}
          label="Description"
          placeholder="Enter product description"
          type={"text"}
        />
        <div className="dynamic-grid">
          <InputField
            id="product-price"
            name="price"
            type="number"
            value={productData.price}
            onChange={handleChange}
            isLoading={isLoading}
            label="Price"
            placeholder="Enter price"
          />
          <InputField
            id="product-category"
            name="category"
            type="select"
            value={productData.category}
            onChange={handleChange}
            isLoading={isLoading}
            label="Category"
            placeholder="Select a category"
            options={[
              { value: "electronics", label: "Electronics" },
              { value: "books", label: "Books" },
            ]}
          />
          <InputField
            id="product-brand"
            name="brand"
            type="text"
            value={productData.brand}
            onChange={handleChange}
            isLoading={isLoading}
            label="Brand"
            placeholder="Enter brand name"
          />
          <InputField
            id="product-stock"
            name="inStock"
            type="number"
            value={productData.inStock}
            onChange={handleChange}
            isLoading={isLoading}
            label="Stock"
            placeholder="Enter stock quantity"
          />
        </div>
        <button
          type="submit"
          className="text-bold my-2 w-full rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600 disabled:bg-gray-300"
          disabled={isLoading}
        >
          {isLoading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;
