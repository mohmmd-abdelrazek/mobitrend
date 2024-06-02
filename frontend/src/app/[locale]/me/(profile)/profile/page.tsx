"use client";

import { useUser } from "@/src/services/queries";
import { User } from "lucide-react";
import Image from "next/legacy/image";

const Profile = () => {
  const { data: user } = useUser();
  console.log(user?.createdAt);
  return (
    <div className="flex flex-1 justify-center gap-20 py-8">
      <div>
        {user?.profile_picture_url ? (
          <Image
            src={user.profile_picture_url}
            alt="Avatar"
            width={160}
            height={160}
            className="mr-4 rounded-full"
          />
        ) : (
          <User className="mr-4 h-40 w-40 rounded-full bg-gray-300 p-4 text-white" />
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h2>Full Name</h2>
          <p>{user?.name}</p>
        </div>
        <div>
          <h2>Email Address</h2>
          <p>{user?.email}</p>
        </div>
        <div>
          <h2>Joined On</h2>
          <p>{new Date(user?.createdAt ?? "").toLocaleDateString("en-US")}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
