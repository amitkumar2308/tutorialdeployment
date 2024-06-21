import { SyncOutlined } from "@ant-design/icons";
import { useRouter } from 'next/router';

const ForgetPasswordForm = ({
    handleSubmit,
    email,
    setEmail,
    newpassword, // corrected prop name
    setNewPassword, // corrected prop name
    confirmpassword,
    setConfirmPassword,
    loading,
}) => {
    const router = useRouter();

    const handleNavigationClick = () => {
        router.push('/login');
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="email" id="email" name="email" className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500" />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">New Password</label>
                    <input value={newpassword} onChange={e => setNewPassword(e.target.value)} type="password" id="password" name="password" className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500" />
                </div>
              
                    <div className="mb-6">
                        <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                        <input value={confirmpassword} onChange={e => setConfirmPassword(e.target.value)} type="password" id="confirmPassword" name="confirmPassword" className="w-full px-3 py-1 border rounded-md focus:outline-none focus:border-blue-500" />
                    </div>
             
                <div className="flex justify-center">
                    <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900 focus:outline-none focus:bg-gray-900">
                        {loading ? <SyncOutlined spin className='py-1' /> : "Reset Password"}
                    </button>
                </div>
            </form>
            {/* Navigation button */}
            <div className="flex flex-col justify-center mt-4">
                <button onClick={handleNavigationClick} className="text-black hover:underline focus:outline-none">
                    Already have an account? Login
                </button>
            </div>
        </>
    );
};

export default ForgetPasswordForm;
