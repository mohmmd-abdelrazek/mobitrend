"use client";
import { useRef, useState } from "react";
import Image from "next/legacy/image";
import { toast } from "react-hot-toast";
import { useUser } from "@/src/services/queries";

import { User } from "lucide-react";
import { uploadAvatar } from "@/src/services/mutate";

const UploadAvatar = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: user, isLoading, error, mutate } = useUser();

  if (isLoading) return <p>Loading...</p>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
    console.log(fileInputRef?.current?.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("avatar", file);
      try {
        setUploading(true);
        await uploadAvatar(formData);
        mutate();
        setFile(null);
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
    <div className="my-2 flex h-fit w-full flex-col gap-4 p-8 shadow-xl lg:w-9/12 xl:w-7/12">
      <h2 className="">Upload Avatar</h2>
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="h-16 w-16">
            {file ? (
              <Image
                src={URL.createObjectURL(file)}
                alt="Avatar"
                width={64}
                height={64}
                className="mr-4 rounded-full"
              />
            ) : user?.profile_picture_url ? (
              <Image
                src={user.profile_picture_url}
                alt="Avatar"
                width={64}
                height={64}
                className="mr-4 rounded-full"
              />
            ) : (
              <User className="mr-4 h-16 w-16 rounded-full text-gray-500" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-bold text-slate-700">Choose Avatar</p>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="file:border-1 block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:cursor-pointer file:rounded-sm file:border-slate-400 file:bg-violet-50 file:px-2 file:py-1 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-violet-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded bg-orange-500 px-2 py-1 font-bold text-white hover:bg-orange-600 disabled:bg-gray-300"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadAvatar;
