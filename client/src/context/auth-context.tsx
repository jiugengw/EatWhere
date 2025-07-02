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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuthState] = useState<AuthData>({});

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        setAuthState(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to parse stored auth:", err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("auth", JSON.stringify(auth));
  }, [auth]);

  const setAuth: Dispatch<SetStateAction<AuthData>> = (newAuth) => {
    setAuthState(prev => {
      const updated = typeof newAuth === "function" ? newAuth(prev) : newAuth;
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
