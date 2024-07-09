import axios from "axios"
import { ACCESS_TOKEN } from "./constants"
// Creating an instance of axios with a base URL set from environment variables
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Adding a request interceptor to the axios instance
api.interceptors.request.use(
    (config) => {
        // Retrieve the access token from local storage
        const token = localStorage.getItem(ACCESS_TOKEN);
        
        // If the token exists, set the Authorization header for the request
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // Return the modified config object
        return config;
    },
    (error) => {
        // If there's an error in the request, reject the promise with the error
        return Promise.reject(error);
    }
);

// Exporting the configured axios instance for use in other parts of the application
export default api;