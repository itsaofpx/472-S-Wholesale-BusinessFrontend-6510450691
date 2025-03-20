import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <div className="container mx-auto flex justify-between items-center px-10">
        {/* Left Section */}
        <div className="flex flex-col space-y-2">
          <h2 className="text-2xl font-semibold">Wholesale</h2>
          <p className="text-sm">© 2025 All rights reserved.</p>
        </div>

        {/* Middle Section - Links */}
        <div className="flex space-x-8">
          <div className="flex flex-col space-y-2">
            <a href="#" className="text-sm hover:text-gray-400">About Us</a>
            <a href="#" className="text-sm hover:text-gray-400">Careers</a>
            <a href="#" className="text-sm hover:text-gray-400">Privacy Policy</a>
            <a href="#" className="text-sm hover:text-gray-400">Terms of Service</a>
          </div>
        </div>

        {/* Right Section - Social Media */}
        <div className="flex space-x-6">
          <a href="#" className="text-xl hover:text-gray-400">
            <FaFacebook />
          </a>
          <a href="#" className="text-xl hover:text-gray-400">
            <FaTwitter />
          </a>
          <a href="#" className="text-xl hover:text-gray-400">
            <FaInstagram />
          </a>
          <a href="#" className="text-xl hover:text-gray-400">
            <FaLinkedin />
          </a>
        </div>
      </div>
    </footer>
  );
}
