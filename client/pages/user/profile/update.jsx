import React, { useState, useEffect, useContext } from 'react';
import logo from '../../../public/connXblack.png';
import defaultProfileImage from '../../../public/connxprofile.png'; // Import the default profile image
import Image from 'next/image';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal, Avatar } from 'antd';
import Link from 'next/link';
import Button from '@mui/material/Button';
import AuthForm from '../../../components/forms/AuthForm';
import { UserContext } from '../../../context';
import { LoadingOutlined, CameraOutlined } from '@ant-design/icons';

const ProfileUpdate = () => {
  // useState hooks
  const [username, setUsername] = useState('');
  const [about, setAbout] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmPassword] = useState('');
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useContext(UserContext);

  // Image Upload state
  const [image, setImage] = useState({ url: defaultProfileImage.src }); // Set default profile image
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (state && state.user) {
      setUsername(state.user.username);
      setAbout(state.user.about);
      setName(state.user.name);
      setEmail(state.user.email);
      setImage(state.user.image || { url: defaultProfileImage.src }); // Use default image if none
    }
  }, [state && state.user]);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.put(`/profile-update`, {
        username,
        about,
        name,
        email,
        password,
        image,
      });
      // Update local storage
      let auth = JSON.parse(localStorage.getItem('auth'));
      auth.user = data;
      localStorage.setItem('auth', JSON.stringify(auth));

      // Update context
      setState({ ...state, user: data });

      setOk(true);
      setLoading(false);
    } catch (err) {
      if (err.response) {
        // If there's a response from the server
        toast.error(err.response.data);
      } else {
        // If there's no response (e.g., network error)
        toast.error('Network Error: Unable to update profile. Please try again later.');
      }
      setLoading(false);
    }
  };

  // Upload Image Function
  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append('images', file);
    setUploading(true); // Set uploading to true when the upload starts
    try {
      const { data } = await axios.post('/upload-image', formData);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
      setUploading(false); // Reset uploading when the upload finishes
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full md:w-1/3">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center items-center mt-3">
            <Image src={logo} alt="Logo" className="w-20 h-6" />
          </div>

          <div className="px-8 py-2">
            <h1 className="text-3xl font-semibold text-center mb-2">Update Profile</h1>
            {/* Upload Image */}
            <label className="d-flex justify-content-center h5">
              {image && image.url ? (
                <Avatar size={100} src={image.url} className="mt-1" />
              ) : uploading ? (
                <LoadingOutlined className="mt-2" />
              ) : (
                <CameraOutlined className="mt-2" />
              )}
              <input
                onChange={handleImage}
                type="file"
                accept="image/*"
                hidden
              />
            </label>

            {/* Registration Form */}
            <AuthForm
              profileUpdate={true}
              handleSubmit={handleSubmit}
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmpassword={confirmpassword}
              setConfirmPassword={setConfirmPassword}
              loading={loading}
              username={username}
              setUsername={setUsername}
              about={about}
              setAbout={setAbout}
              page="register" // Pass the page prop here
            />
          </div>
        </div>
      </div>

      {/* Successfully Login */}
      <div className="row">
        <div className="col">
          <Modal
            title="You have successfully updated your profile"
            open={ok}
            onCancel={() => setOk(false)}
            footer={null}
          >
            <Link href="/login">
              <Button variant="contained" style={{ backgroundColor: 'black', color: 'white' }}>
                Back To Home
              </Button>
            </Link>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default ProfileUpdate;
