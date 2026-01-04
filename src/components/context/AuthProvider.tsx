import { useEffect } from "react";
import { useAuth } from "../../store/useAuth";
import authApi from "../../services/api-auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setUser, setAuthenticated, setLoading } = useAuth();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await authApi.fetchAccount();
        if (res.statusCode === 200 && res.data) {
          setUser(res.data);
          setAuthenticated(true);
        }
      } catch (error) {
        console.error("Fetch account error:", error);
      } finally {
        // Always set loading to false after auth check completes
        setLoading(false);
      }
    };
    fetchAccount();
  }, [setUser, setAuthenticated, setLoading]);

  return <>{children}</>;
};

export default AuthProvider;
