import { SyncOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router';
import Link from 'next/link';


const AuthForm = ({
    handleSubmit,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmpassword,
    setConfirmPassword,
    loading,
    page,
    username,
    setUserName,
    about,
    setAbout,
    profileUpdate,
}) => {
    const router = useRouter();

    const handleNavigationClick = (path) => {
        router.push(path);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
            {profileUpdate && 
            <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} type="text" id="name" name="name" className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500" />
                    </div>
}
                {profileUpdate && 
                <div className="mb-4">
                    <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                    <input value={username} onChange={e => setUserName(e.target.value)} type="text" id="username" name="username" className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500" />
                </div>
                }
                
                {profileUpdate && (
                    <div className="mb-4">
                        <label htmlFor="about" className="block text-gray-700 text-sm font-bold mb-2">About</label>
                        <input value={about} onChange={e => setAbout(e.target.value)} type="text" id="about" name="about" className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500" />
                    </div>
                )}

                {page !== "login" && !profileUpdate && (
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input value={username} onChange={e => setUserName(e.target.value)} type="text" id="name" name="name" className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500" />
                    </div>
                )}
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value) } type="email" id="email" name="email" className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500" disabled={profileUpdate} />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" id="password" name="password" className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500" />
                </div>
                {page !== "login" && !profileUpdate && (
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                        <input value={confirmpassword} onChange={e => setConfirmPassword(e.target.value)} type="password" id="confirmPassword" name="confirmPassword" disabled={profileUpdate} className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500" />
                    </div>
                )}
                <div className="flex justify-center">
                    <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 focus:outline-none focus:bg-gray-900">
                        {loading ? <SyncOutlined spin className='py-1' /> : (profileUpdate ? "Update Profile" : (page === "register" ? "Register" : "Login"))}
                    </button>
                </div>
            </form>
            {/* Navigation buttons */}
            {page === "login" && !profileUpdate && (
                <div className="flex flex-col justify-center mt-4">
                    {/* Use onClick event to handle navigation */}
                    <button onClick={() => handleNavigationClick('/resetPassword')} className="text-sm text-gray-500 hover:underline focus:outline-none mb-2">
                        Forgot password
                    </button>
                    <button disabled={!email || !password} type="button" onClick={() => handleNavigationClick('/register')} className="text-black hover:underline focus:outline-none">
                        Don't have an account? Register
                    </button>
                </div>
            )}
            {page === "register" && !profileUpdate && (
                <div className="flex justify-center mt-4">
                    <button type="button" onClick={() => handleNavigationClick('/login')} className="text-black hover:underline focus:outline-none">
                        Already have an account? Login
                    </button>
                </div>
            )}
        </>
    );
};

export default AuthForm;
