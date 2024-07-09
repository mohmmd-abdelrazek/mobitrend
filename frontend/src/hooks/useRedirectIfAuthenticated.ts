import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../services/queries";

const useRedirectIfAuthenticated = (): void => {
  const router = useRouter();
  const { data, isLoading } = useAuth();

  useEffect(() => {
    async function redirect() {
      if (data?.isAuthenticated && !isLoading) {
        router.push("/");
      }
    }
    redirect();
  }, [router, data, isLoading]);
};

export default useRedirectIfAuthenticated;
