import Image from 'next/image';
import connexFounderImage from "../public/connxfounder.png";

const About = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-center pt-20 sm:pt-0">
      {/* Image section with background color */}
      <div className="w-full sm:w-1/3 flex justify-center mb-6 sm:mb-0" style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}>
        <Image
          src={connexFounderImage}
          alt="Connx Founder"
          width={2900}
          height={2900}
          className="object-contain sm:object-cover sm:w-full sm:h-auto"
        />
      </div>
      {/* Text section */}
      <div className="w-full sm:w-1/2 px-8 py-6">
        <h1 className="text-3xl font-semibold mb-4">Our Vision</h1>
        <hr className="mb-4" />
        <p className="text-justify">
          I'm Amit Kumar Gupta, founder of ConnX, a platform driven by a vision to empower individuals by keeping them at the forefront of the ever-evolving technological landscape. ConnX doesn't just deliver daily updates on the latest trends and developments in the tech world; it fosters a vibrant and collaborative community.

          ConnX recognizes that learning goes beyond passively consuming information. Our platform provides a space where users can not only stay informed but also actively engage with their peers. They can troubleshoot coding challenges by seeking and offering solutions from a network of fellow users. This interactive environment fosters a spirit of mutual support, allowing everyone to learn from each other's experiences and accelerate their technical growth.

          At ConnX, we believe that collaboration is the key to unlocking true potential. By working together, sharing knowledge, and supporting one another, our user community can achieve far greater things than any individual could alone. ConnX is more than just a platform; it's a springboard for collective innovation and advancement in the exciting world of technology.
        </p>
        <br />
        <p className="font-bold">Amit Kumar Gupta</p>
        <p className="text-sm text-gray-500">Founder of ConnX</p>
      </div>
    </div>
  );
};

export default About;
