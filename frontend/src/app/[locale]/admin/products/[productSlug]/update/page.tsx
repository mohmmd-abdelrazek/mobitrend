"use client";
import { useState } from "react";
import InputField from "@/src/components/InputField";
import toast from "react-hot-toast";
import { useRouter } from "@/src/navigation";
import { useParams } from "next/navigation";
import { useProduct } from "@/src/services/queries";
import { updateProduct } from "@/src/services/mutate";
import { mutate } from "swr";

const UpdateProductForm = () => {
  const router = useRouter();
  const {
    data: productData,
    isLoading,
    error,
    mutate: mutateProduct,
  } = useProduct();
  const [isUpdating, setIsUpdating] = useState(false);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load product.</p>;
  if (!productData) return <p>Updating...</p>; // Display a Updating message while the data is being fetched

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    mutateProduct({ ...productData, [name]: value }, false); // Optimistic UI update
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUpdating(true);
    try {
      const updatedData = {
        ...productData,
        price: parseFloat(productData.price),
        inStock: parseInt(productData.inStock),
      };
      updateProduct(productData.slug, updatedData);
      toast.success("Product updated successfully");
      mutate("/product");
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="my-2 flex w-full flex-col gap-4 px-8 py-2 shadow-xl lg:w-9/12 xl:w-7/12">
      <h2 className="mb-4 text-2xl font-bold">Update Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          id="product-name"
          name="name"
          type="text"
          value={productData.name}
          onChange={handleChange}
          isLoading={isUpdating}
          label="Name"
          placeholder="Enter product name"
        />
        <InputField
          id="product-description"
          name="description"
          textarea={true}
          value={productData.description}
          onChange={handleChange}
          isLoading={isUpdating}
          label="Description"
          placeholder="Enter product description"
          type={"textarea"}
        />
        <div className="dynamic-grid">
          <InputField
            id="product-price"
            name="price"
            type="number"
            value={productData.price}
            onChange={handleChange}
            isLoading={isUpdating}
            label="Price"
            placeholder="Enter price"
          />
          <InputField
            id="product-category"
            name="category"
            type="select"
            value={productData.category}
            onChange={handleChange}
            isLoading={isUpdating}
            label="Category"
            placeholder="Select a category"
            options={[
              {value: "mobiles", label: "Mobiles"},
              {value: "airpodes", label: "Airpodes"},
              {value: "watches", label: "Watches"},
            ]}
          />
          <InputField
            id="product-brand"
            name="brand"
            type="text"
            value={productData.brand}
            onChange={handleChange}
            isLoading={isUpdating}
            label="Brand"
            placeholder="Enter brand name"
          />
          <InputField
            id="product-stock"
            name="inStock"
            type="number"
            value={productData.inStock}
            onChange={handleChange}
            isLoading={isUpdating}
            label="Stock"
            placeholder="Enter stock quantity"
          />
        </div>
        <button
          type="submit"
          className="text-bold my-2 w-full rounded bg-orange-500 px-2 py-1 text-white hover:bg-orange-600 disabled:bg-gray-300"
          disabled={isUpdating}
        >
          {isUpdating ? "Updating Product..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default UpdateProductForm;
