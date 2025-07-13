import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

interface AuthData {
  [key: string]: any;
  token?: string;
}

export interface AuthContextType {
  auth: AuthData;
  setAuth: Dispatch<SetStateAction<AuthData>>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuthState] = useState<AuthData>({});
  const [isInitialised, setIsInitialised] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("auth");
    if (stored) {
      try {
        setAuthState(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse stored auth:", err);
      }
    }
    setIsInitialised(true);
  }, []);

  useEffect(() => {
    if (isInitialised) {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    }
  }, [auth, isInitialised]);

  const setAuth: Dispatch<SetStateAction<AuthData>> = (newAuth) => {
    setAuthState((prev) => {
      const updated = typeof newAuth === "function" ? newAuth(prev) : newAuth;
      return updated;
    });
  };

  const isAuthenticated = !!auth?.token;
  const isLoading = !isInitialised;

  return (
    <AuthContext.Provider value={{
      auth,
      setAuth,
      isAuthenticated,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
