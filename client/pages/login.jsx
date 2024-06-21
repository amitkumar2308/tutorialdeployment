import { useContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Link from "next/link";
import AuthForm from "../components/forms/AuthForm";
import { useRouter } from "next/router";
import { UserContext } from "../context";
import logo from "../public/connXblack.png";
import Image from "next/image";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const[state, setState] = useContext(UserContext);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // console.log(name, email, password, secret);
      setLoading(true);
      const { data } = await axios.post(
        `/login`,
        {
          email,
          password,
        }
      );
      // console.log(data);
      // using context - update context
      setState({
        user: data.user,
        token: data.token
      });
      // save in local storage
      window.localStorage.setItem('auth',JSON.stringify(data));
      router.push("/");
    } catch (err) {
      if (err.response && err.response.data) {
        
 
        // Check if err.response exists and has data property
        toast.error(err.response.data);
      } else {
        // Handle the error if err.response or err.response.data is undefined
        toast.error("An error occurred");
      }
      setLoading(false);
    }
  };
  // If user is already authenticated, redirect to the homepage
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
            <h1 className="text-3xl font-semibold text-center mb-6">Welcome Back!</h1>

            {/* Login Form */}
            <AuthForm
              handleSubmit={handleSubmit}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              page="login"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
