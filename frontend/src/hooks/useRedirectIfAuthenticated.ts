// hooks/useRedirectIfAuthenticated.ts
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../services/queries";

const useRedirectIfAuthenticated = (redirectUrl: string): void => {
  const router = useRouter();
  const {data, isLoading} = useAuth();
  

  useEffect(() => {
    
        if (data?.isAuthenticated && !isLoading) {
          router.push(redirectUrl);
        }
      
      },
    [router, redirectUrl, data, isLoading]);
    
};

export default useRedirectIfAuthenticated;
