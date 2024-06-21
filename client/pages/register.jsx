import React, { useState, useContext, useEffect } from 'react';
import logo from '../public/connXblack.png';
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import {toast} from "react-toastify";
import {Modal} from "antd";
import Link from "next/link";
import Button from '@mui/material/Button';
import AuthForm from '../components/forms/AuthForm.jsx';
import { UserContext } from '../context/index.jsx';


const Register = () => {
  
//useState hooks

const [username, setUserName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [confirmpassword, setConfirmPassword] = useState("");
const [ok, setOk] = useState(false);
const [loading, setLoading] = useState(false);
const [state, setState] = useContext(UserContext); // Context state
//this function is called when we submit the form


const router = useRouter();
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // console.log(name, email, password, secret);
    setLoading(true);
    const { data } = await axios.post(
      `/register`,
      {
        username,
        email,
        password,
        confirmpassword,
      }
    );
    setUserName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setOk(data.ok);
    setLoading(false);
    
  } catch (err) {
    toast.error(err.response.data.error);
    setLoading(false);
  }
};




  if(state && state.token) router.push("/");

  
  


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full md:w-1/3">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center items-center mt-3">
            <Image src={logo} alt="Logo" className="w-20 h-6" />
          </div>

          <div className="px-8 py-2">
            <h1 className="text-3xl font-semibold text-center mb-6">Create New Account</h1>

          {/* Registration Form */}
          <AuthForm
            handleSubmit={handleSubmit}
            username={username}
            setUserName={setUserName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmpassword={confirmpassword}
            setConfirmPassword={setConfirmPassword}
            loading={loading}
            page="register" // Pass the page prop here
            
          />
        </div>
      </div>
      </div>
      
      {/*Succesfully Login*/}
   
      <div className='row'>
        <div className='col'>
          <Modal
            title = 'Congratulations! Your ConnX account is Ready'
            open={ok}
            onCancel={()=> setOk(false)}
            footer = {null}
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

export default Register;
