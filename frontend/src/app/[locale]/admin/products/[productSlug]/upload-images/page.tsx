"use client";
import { useRef, useState } from "react";
import Image from "next/legacy/image";
import { toast } from "react-hot-toast";
import { useParams } from "next/navigation";
import { useProductImages } from "@/src/services/queries";

import { deleteImage, uploadImages } from "@/src/services/mutate";
import { TicketX } from "lucide-react";

const UploadImages = () => {
  const { productSlug } = useParams();
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { data, isLoading, error, mutate } = useProductImages();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load products.</p>;

  const images = data.images;
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
    console.log(fileInputRef?.current?.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (files.length > 0) {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));
      try {
        setUploading(true);
        await uploadImages(productSlug, formData);
        mutate();
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
      <h1 className="mb-4 text-2xl font-bold">{`Upload Images for Product ${productSlug}`}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100"
        />
        {files.length > 0 ? (
          <div className="small-dynamic-grid my-4">
            {Array.from(files).map((file, index) => (
              <div key={index} className="relative aspect-square w-full">
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  layout="fill"
                  className="h-full w-full rounded-t-md object-cover object-center"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="my-4">
            No images choosen, choose images to be uploaded.
          </div>
        )}

        <button
          type="submit"
          className="rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:bg-gray-300"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

        {images.length > 0 ? (
          <div className="small-dynamic-grid mt-10">
            {images.map((image: string, index: number) => (
              <div key={index} className="group relative overflow-hidden">
                <div className="relative aspect-square w-full">
                  <Image
                    src={image}
                    alt="Preview"
                    layout="fill"
                    className="h-full w-full rounded-t-md object-cover object-center"
                  />
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteImage(image);
                    mutate();
                  }}
                  className="text-xm z-1 absolute -bottom-full flex w-full justify-center bg-red-500 font-semibold text-white transition-all group-hover:bottom-0"
                >
                  <TicketX />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-12">No images uploaded for this product.</div>
        )}
      </form>
    </div>
  );
};

export default UploadImages;
