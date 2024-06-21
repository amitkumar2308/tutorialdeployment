import { useState, createContext, useEffect } from "react";
import { useRouter } from 'next/router';
import axios from "axios";

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [state, setState] = useState({
        user: {},
        token: "",
    });

    useEffect(() => {
        const storedAuth = JSON.parse(window.localStorage.getItem('auth'));
        if (storedAuth) {
            setState(storedAuth);
        }
    }, []);

    const router = useRouter();

    // Adding token in the config
    const token = state && state.token ? state.token : "";
    axios.defaults.baseURL = 'https://connxserver.vercel.app/api';
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

    // Adding axios interceptor to handle response errors
    axios.interceptors.response.use(
        function (response) {
            return response;
        },
        function (error) {
            if (error.response) {
                console.log("Response status:", error.response.status);
                console.log("Response data:", error.response.data);
                console.log("Response headers:", error.response.headers);
                if (error.response.status === 401) {
                    setState({ user: {}, token: "" });
                    window.localStorage.removeItem("auth");
                    router.push('/login');
                }
            } else if (error.request) {
                console.log("No response received:", error.request);
            } else {
                console.log("Error:", error.message);
            }
            return Promise.reject(error);
        }
    );

    return (
        <UserContext.Provider value={[state, setState]}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
