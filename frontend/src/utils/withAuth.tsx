import { usePathname, useRouter } from '@/src/navigation';
import { useAuth } from '../services/queries'; // Adjust the import path as necessary
import LoadingIndicator from '../components/LoadingIndicator'; // Adjust the import path as necessary
import { useEffect } from 'react';
import toast from 'react-hot-toast';

type WithAuthProps = {
  [key: string]: any;
};

const withAuth = <P extends WithAuthProps>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const Auth: React.FC<P> = (props) => {
    const router = useRouter();
    const pathname = usePathname();
    const { data, isLoading, mutate } = useAuth();

    useEffect(() => {
      async function redirect() {
        await mutate();
        if (!data?.isAuthenticated && !isLoading) {
          toast.loading("You need to sign in first", {duration:4000})
          router.push(`/signin?redirect=${pathname}`);
        }
      }
      redirect();
      
    }, [data?.isAuthenticated, isLoading, mutate, pathname, router]);

    if (isLoading) {
      return <div className="flex-1 flex items-center justify-center"><LoadingIndicator w={4} d={4} /></div>;
    }

    if (!data?.isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  Auth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return Auth;
};

export default withAuth;
