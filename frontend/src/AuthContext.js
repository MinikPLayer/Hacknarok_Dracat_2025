import { createContext, useState, useEffect } from "react";
import { getUser, login, logout, register } from "./api";
import {useNavigate} from "react-router-dom";

export const AuthContext = createContext();

export const isUserAuthenticated = () => {
    const token = localStorage.getItem("access");
    return token !== null;  // Return true if the token exists, false otherwise
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [errmess, setErrmess] = useState(null);
    const [errtype, setErrtype] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            const userData = await getUser();
            setUser(userData);
        };
        fetchUser();
    }, []);

    const loginUser = async (email, password) => {
        try {
            const userData = await login(email, password);
            setUser(userData);
            setIsAuthenticated(true);
            setErrmess(null);
            setErrtype(null);
            if (!errmess && !errtype) navigate("/main")
        } catch (error) {
            if (error.response && error.response.data.error) {
                setErrmess(error.response.data.error);
                setErrtype(error.response.data.type);
            } else {
                setErrmess("Błąd logowania. Sprawdź swoje dane.");
            }
        }
    };

    const registerUser = async (username, email, password, passwordSecond) => {
    try {
            await register(username, email, password, passwordSecond);

            const userData = await getUser();
            setUser(userData);
            setIsAuthenticated(true);
            setErrmess(null);  // Clear errors on success
            if (!errmess) navigate("/main")
    } catch (error) {
        console.log(error)
            if (error.response && error.response.data.error) {
                setErrmess(error.response.data.error);
            } else {
                setErrmess("Błąd rejestracji. Spróbuj ponownie.");
            }
        }
    };


    const logoutUser = () => {
        logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("access") !== null &&
        localStorage.getItem("refresh") !== null
    );

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, loginUser, logoutUser, registerUser, errmess, errtype, setErrtype, setErrmess }}>
            {children}
        </AuthContext.Provider>
    );
};