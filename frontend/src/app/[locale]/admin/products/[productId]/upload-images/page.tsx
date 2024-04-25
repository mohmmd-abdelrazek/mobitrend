"use client";
import axios from "axios";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { useProductImages } from "@/src/services/queries";
import { mutate } from "swr";
import { axiosInstance } from "@/src/services/fetcher";

const UploadImages = () => {
  const { productId } = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { data: images, isLoading, error } = useProductImages();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load products.</p>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      try {
        setUploading(true);
        const response = await axiosInstance.post(
          `/product/${productId}/upload-images`,
          formData,
        );
        mutate(`/products/${productId}/upload-images`); 
        toast.success("Images uploaded successfully!");
        setFiles([]);
        fileInputRef.current && (fileInputRef.current.value = "");
      } catch (error) {
        console.error("Failed to upload images:", error);
        toast.error("Failed to upload images.");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="w-full px-4 py-6 shadow-lg">
      <h1 className="mb-4 text-2xl font-bold">Upload Images for Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
        />
        {files.length > 0 && (
          <div className="small-dynamic-grid mt-4">
            {Array.from(files).map((file, index) => (
              <div key={index} className="relative h-20 w-full">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {images.length > 0 && (
          <div className="small-dynamic-grid mt-4">
            {images.map((image: string, index: number) => (
              <div key={index} className="relative h-20 w-full">
                <Image
                  src={image}
                  alt="Preview"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default UploadImages;
