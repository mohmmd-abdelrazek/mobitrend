import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../services/queries";

const useRedirectIfAuthenticated = (): void => {
  const router = useRouter();
  const { data, isLoading, mutate } = useAuth();

  useEffect(() => {
    async function redirect() {
      await mutate();
      if (data?.isAuthenticated && !isLoading) {
        router.push("/");
      }
    }
    redirect();
  }, [router, data, isLoading, mutate]);
};

export default useRedirectIfAuthenticated;
