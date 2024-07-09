import { Navigate } from "react-router-dom"
import { jwtDecode } from 'jwt-decode'
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useEffect, useState } from "react"

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null)

    // Use the useEffect hook to check authorization status on component mount
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false))
    }, [])

    // Function to refresh the access token using the refresh token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN); // Get the refresh token from local storage

        try {
            // Make a POST request to refresh the access token
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken,
            });

            // If the request is successful, update the access token in local storage and set authorization to true
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            } else {
                // If the request fails, set authorization to false
                setIsAuthorized(false);
            }
        } catch (error) {
            // Log any errors and set authorization to false
            console.log(error);
            setIsAuthorized(false);
        }
    };

    // Function to check the current authorization status
    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN); // Get the access token from local storage

        // If no token is found, set authorization to false
        if (!token) {
            setIsAuthorized(false);
            return;
        }

        const decoded = jwtDecode(token); // Decode the token to get its payload
        const tokenExpiration = decoded.exp; // Extract the expiration time
        const now = Date.now() / 1000; // Get the current time in seconds

        // If the token is expired, attempt to refresh it
        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            // If the token is still valid, set authorization to true
            setIsAuthorized(true);
        }
    };

    // Show a loading message while authorization status is being determined
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    // Render the children if authorized, otherwise navigate to the login page
    return isAuthorized ? children : <Navigate to="/login " />;
}


export default ProtectedRoute