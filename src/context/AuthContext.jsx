// React se required cheezen import ki
// createContext = global state banane ke liye
// useContext = context ko use karne ke liye
// useState = state handle karne ke liye
import { createContext, useContext, useState } from "react";

// AuthContext naam ka context create kiya
// ye poori app me auth (login user) data share karega
export const AuthContext = createContext();

// custom hook banaya taake bar bar useContext(AuthContext) na likhna pare
// ab sirf useAuth() likh kar auth data mil jaye ga
export const useAuth = () => {
    return useContext(AuthContext)
}

// ye Provider component hai
// ye poori app ko wrap karega (App.jsx me)
export const AuthContextProvider = ({ children }) => {

    // authUser state:
    // localStorage se pehle se saved user uthata hai
    // agar localStorage empty ho to null
    // taake page refresh par user logout na ho
    const [authUser, setAuthUser] = useState(
        JSON.parse(localStorage.getItem('chatapp')) || null
    );

    // Provider return ho raha hai
    // value me authUser aur setAuthUser pass kiye
    // children = app ke andar ke saare components
    return (
        <AuthContext.Provider value={{ authUser, setAuthUser }}>
            {children}
        </AuthContext.Provider>
    )
}
