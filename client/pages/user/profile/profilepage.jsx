import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const Profile = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <div>
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        {/* Add other user details here */}
      </div>
    </div>
  );
};

export default Profile;
