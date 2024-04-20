import NavigationLink from "@/src/components/NavigationLink";
import { ReactNode } from "react";
import { FaRegCircleUser } from "react-icons/fa6";

const AdminPanel = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-1">
      <aside className="min-h-full w-full max-w-60 bg-white shadow-2xl shadow-black">
        <div className="flex h-32 items-center justify-center bg-blue-500 px-4 py-2">
          <div className="cursor-pointer text-5xl">
            <FaRegCircleUser />
          </div>
        </div>
        
      </aside>
      <main className="flex-1 bg-slate-50 px-6 py-4">{children}</main>
    </div>
  );
};

export default AdminPanel;
