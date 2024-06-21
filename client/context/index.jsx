import { useState, createContext, useEffect } from "react";
import { useRouter } from 'next/router';
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [state, setState] = useState({
        user: null,
        token: "",
    });

    useEffect(() => {
        const authData = JSON.parse(localStorage.getItem('auth'));
        if (authData) {
            setState(authData);
        }
    }, []);

    const router = useRouter();

    useEffect(() => {
        // Set Axios defaults base URL
        axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
        
        // Set Authorization header for Axios requests
        axios.defaults.headers.common["Authorization"] = state?.token ? `Bearer ${state.token}` : "";

        // Axios interceptor for response errors
        const interceptor = axios.interceptors.response.use(
            function (response) {
                // Return a successful response directly
                return response;
            },
            function (error) {
                // Handle errors here
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log("Response status:", error.response.status);
                    console.log("Response data:", error.response.data);
                    console.log("Response headers:", error.response.headers);
                    if (error.response.status === 401) {
                        // Handle unauthorized access (e.g., token expired)
                        setState({ user: null, token: "" });
                        localStorage.removeItem("auth");
                        router.push('/login');
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    console.log("No response received:", error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log("Error:", error.message);
                }
                // Return the error
                return Promise.reject(error);
            }
        );

        // Clean up Axios interceptor on component unmount
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [state?.token]); // Only run this effect when token changes

    return (
        <UserContext.Provider value={[state, setState]}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
