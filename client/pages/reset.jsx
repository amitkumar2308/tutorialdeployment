// pages/reset-password.js

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const reset = () => {
    const router = useRouter();
    const { token, redirect } = router.query;

    useEffect(() => {
        // Function to redirect to the forgot password page
        const redirectToForgotPassword = () => {
            // If the redirect parameter exists, redirect the user to the specified URL
            if (redirect) {
                router.push(redirect);
            } else {
                // If no redirect parameter is found, you can redirect the user to a default URL
                router.push('/forgot-password');
            }
        };

        if (token) {
            redirectToForgotPassword();
        }
    }, [token, redirect]);

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: 'background.paper',
            }}
        >
            <CircularProgress />
            <p style={{ marginLeft: '10px' }}>Redirecting...</p>
        </Box>
    );
};

export default reset;
