import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import axios from "axios";

interface User {
  userId: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isVerified: boolean;
  isDeleted: boolean;
}

interface ContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  getProfile: () => Promise<void>;
  loading: boolean;
}

export const Context = createContext<ContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useUser must be used within a ContextProvider");
  }
  return context;
};

interface ContextProviderProps {
  children: ReactNode;
}

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const response = await axios.get(`/api/profile`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setLoading(false);
        setUser(response.data);
      }
    } catch (error: any) {
      setLoading(false);
      console.error("Error fetching profile:", error.message);
    }
  };

  return (
    <Context.Provider value={{ user, setUser, getProfile, loading }}>
      {children}
    </Context.Provider>
  );
};
