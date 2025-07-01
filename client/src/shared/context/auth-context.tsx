import { createContext, useState,ReactNode } from "react";


interface AuthData{
    [key:string]:any;
    token?:string;
}

export interface AuthContextType{
    auth:AuthData;
    setAuth:React.Dispatch<React.SetStateAction<AuthData>>;
}

const AuthContext = createContext<AuthContextType | undefined> (undefined);

interface AuthProviderProps{
    children:ReactNode;
}
export const AuthProvider = ({ children }:AuthProviderProps) => {
    const [auth, setAuth] = useState<AuthData>({});

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;


// never log in
// login | signup

// logged in
// home | explore | profile | Group | History | using as: group/user name

