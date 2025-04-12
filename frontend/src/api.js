import client from "./client";
import {API_BASE_URL} from "./config";

export const register = async (username, email, password, passwordSecond) => {
    try {
        const response = await client.post(API_BASE_URL + "register/", { username, email, password, passwordSecond });

        // If registration is successful, automatically log in the user
        const loginResponse = await login(email, password);

        return loginResponse; // Return login response after successful registration
    } catch (error) {
        throw error; // Pass the error for handling in AuthContext
    }
};


export const login = async (email, password) => {
    try {
        const response = await client.post(API_BASE_URL + "login/", { email, password });

        if (response.data.access) {
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
        }

        return response.data; // Return user data after successful login
    } catch (error) {
        throw error; // Pass the error for handling
    }
};


export const logout = async () => {
    try{
        const response = await client.post(API_BASE_URL + "logout/", {});
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        localStorage.removeItem("image_set")
    } catch (err){
        console.log(err)
    }

};

export const getUser = async () => {
    const token = localStorage.getItem("access");
    if (!token) return null;

    try {
        const response = await client.get(API_BASE_URL + "user/", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        console.error("Failed to fetch user:", error);
        return null;
    }
};