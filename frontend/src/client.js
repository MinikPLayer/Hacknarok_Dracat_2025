import axios from "axios";

const client = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshSubscribers = [];

// Funkcja dodająca nowe żądania do kolejki, gdy trwa odświeżanie tokena
const addRefreshSubscriber = (callback) => {
    refreshSubscribers.push(callback);
};

// Obsługa dodanych żądań po odświeżeniu tokena
const onRefreshed = (newAccessToken) => {
    refreshSubscribers.forEach((callback) => callback(newAccessToken));
    refreshSubscribers = [];
};

// Interceptor dołączający token do żądań
client.interceptors.request.use(async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Interceptor obsługujący odświeżanie tokena przy 401
client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((newToken) => {
                        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
                        resolve(client(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) throw new Error("Brak refreshToken");

                const response = await axios.post("http://127.0.0.1:8000/api/token/refresh/", { refresh: refreshToken });

                const newAccessToken = response.data.access;
                localStorage.setItem("accessToken", newAccessToken);

                client.defaults.headers["Authorization"] = `Bearer ${newAccessToken}`;
                isRefreshing = false;
                onRefreshed(newAccessToken);

                return client(originalRequest);  // Powtórzenie oryginalnego żądania
            } catch (refreshError) {
                console.error("Błąd odświeżania tokena", refreshError);
                isRefreshing = false;

                // Usunięcie tokenów i przekierowanie, ale tylko raz
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default client;
