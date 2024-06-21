import React from 'react';
import { Mail, WhatsApp } from '@mui/icons-material';
import Image from 'next/image';

const Community = () => {
  const handleMailClick = () => {
    window.location.href = 'mailto:amitkgupta2308@gmail.com';
  };

  const handleJoinClick = () => {
    // Add functionality for joining the community
    window.open('https://chat.whatsapp.com/LnH7GvcK3sV541KWMtr5RY', '_blank'); // Open WhatsApp group link in a new tab
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-8"> {/* First Box: Co-founder */}
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <Image
              className="h-48 w-full object-cover md:w-48 rounded-md"
              src="/connxprofile.png"
              alt="Community Image"
              width={900} // Specify the width of the image
              height={900} // Specify the height of the image
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Join Our Team
            </div>
            <p className="block mt-1 text-lg leading-tight font-medium text-black">
              Looking for a Co-founder for Connx
            </p>
            <p className="mt-2 text-gray-600">
              We are seeking a highly motivated and experienced individual to join us as a co-founder for Connx. If you are passionate about building innovative solutions and driving growth in the tech industry, we'd love to hear from you.
            </p>
            <div className="mt-4">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-black hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                onClick={handleMailClick}
              >
                <Mail className="h-5 w-5 mr-2" />
                Connect via Email
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl mt-8"> {/* Second Box: Joining Community */}
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <Image
              className="h-48 w-full object-cover md:w-48 rounded-md"
              src="/connxprofile.png"
              alt="Community Image"
              width={900} // Specify the width of the image
              height={900} // Specify the height of the image
            />
          </div>
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
              Join Our Community
            </div>
            <p className="block mt-1 text-lg leading-tight font-medium text-black">
              Join our community of passionate individuals
            </p>
            <p className="mt-2 text-gray-600">
              Connx is a vibrant community of professionals who are dedicated to fostering innovation and collaboration. Join us to connect with like-minded individuals and explore exciting opportunities.
            </p>
            <div className="mt-4">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-black hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
                onClick={handleJoinClick}
              >
                <WhatsApp  className="h-5 w-5 mr-2"/>
                Join Community
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
