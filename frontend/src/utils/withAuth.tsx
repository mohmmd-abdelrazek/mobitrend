import { useRouter } from '@/src/navigation';
import { useAuth } from '../services/queries'; // Adjust the import path as necessary
import LoadingIndicator from '../components/LoadingIndicator'; // Adjust the import path as necessary
import { useEffect } from 'react';

// Define a generic type for props that could be passed to any component
type WithAuthProps = {
  [key: string]: any;
};

// The HOC takes a component and returns a new component
const withAuth = <P extends WithAuthProps>(WrappedComponent: React.ComponentType<P>): React.FC<P> => {
  const Auth: React.FC<P> = (props) => {
    const router = useRouter();
    const { data, isLoading } = useAuth();

    useEffect(() => {
      if (!data?.isAuthenticated && !isLoading) {
        // Redirect to signin page if not authenticated and not loading
        router.push('/signin');
      }
    }, [data?.isAuthenticated, isLoading, router]);

    if (isLoading) {
      // Show loading indicator while authentication status is being determined
      return <LoadingIndicator />;
    }

    if (!data?.isAuthenticated) {
      // Return null or a placeholder while redirecting or if not authenticated
      // You can also implement a redirect here if you prefer
      return null;
    }

    // If authenticated, render the wrapped component with all its props
    return <WrappedComponent {...props} />;
  };

  // Optionally, you can set a display name for your HOC for debugging purposes
  Auth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return Auth;
};

export default withAuth;
