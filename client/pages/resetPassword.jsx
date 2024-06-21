import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter(); // Initialize the router
    const { token } = router.query; // Extract the token from the URL

    useEffect(() => {
        // Validate the token (you can implement your own validation logic here)
        const isValidToken = token && typeof token === 'string' && token.length > 0;

        // If the token is not valid, handle the error (e.g., show an error message)
        if (!isValidToken) {
            console.error('Invalid token');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`/resetpassword`, {
                email,
            });

            if (data.error) {
                toast.error(data.error);
            } else if (data.success) {
                toast.success(data.success);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error while sending password reset link:', error);
            toast.error("Something went wrong. Please try again later.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <div className="w-full md:w-1/3">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-8 py-2">
                        <h1 className="text-3xl font-semibold text-center mb-6">Forgot Password</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input value={email} onChange={e => setEmail(e.target.value)} type="email" id="email" name="email" className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500" />
                            </div>
                            <div className="flex justify-center">
                                <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 focus:outline-none focus:bg-gray-900">
                                    {loading ? "Sending..." : "Send Password Reset Link"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
