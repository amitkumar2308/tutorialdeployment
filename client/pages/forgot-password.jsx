import React, { useState } from 'react';
import logo from '../public/connXblack.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from "react-toastify";
import { Modal } from "antd";
import Link from "next/link";
import Button from '@mui/material/Button';
import ForgetPasswordForm from '../components/forms/ForgotPasswordform';
import { UserContext } from '../context';
import { useContext } from 'react';

const ForgotPassword = () => {
  
  // useState hooks
  const [email, setEmail] = useState('');
  const [newpassword, setNewPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(`/forgot-password`, {
        email,
        newpassword,
        confirmpassword,
      });

      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      }

      if (data.success) {
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setOk(data.ok);
        setLoading(false);
        // Display success message when password is changed
        toast.success(data.success);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
      setLoading(false);
    }
  };

  if (state && state.token) router.push("/");

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full md:w-1/3">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center items-center mt-3">
            <Image src={logo} alt="Logo" className="w-20 h-6" />
          </div>

          <div className="px-8 py-2">
            <h1 className="text-3xl font-semibold text-center mb-6">Forgot Password</h1>

            {/* Registration Form */}
            <ForgetPasswordForm
              handleSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              newpassword={newpassword}
              setNewPassword={setNewPassword}
              confirmpassword={confirmpassword}
              setConfirmPassword={setConfirmPassword}
              loading={loading}
              page="register" // Pass the page prop here
            />
          </div>
        </div>
      </div>
      
      {/* Success Modal */}
      <div className='row'>
        <div className='col'>
          <Modal
            title='Congratulations! Your ConnX account is Ready'
            open={ok}
            onCancel={() => setOk(false)}
            footer={null}
          >
            <Link href='/login'>
              <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }}>Back to Login</Button>
            </Link>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
 