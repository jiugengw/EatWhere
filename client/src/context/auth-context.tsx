import {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';

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
  const [auth, setAuth] = useState<AuthData>({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
