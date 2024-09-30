import { FaShoppingCart, FaBell, FaUserCircle } from 'react-icons/fa';

export default function Navbar() {
  return (
    <nav className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Left side: Logo */}
        <div>
          <a href="/" className="text-2xl font-bold tracking-wide text-white hover:text-gray-300">
            LOGO
          </a>
        </div>

        {/* Right side: Icons */}
        <div className="flex space-x-6">
          
          {/* Shopping Cart */}
          <button className="hover:text-gray-300">
            <FaShoppingCart size={24} />
          </button>

          {/* Notifications */}
          <button className="hover:text-gray-300">
            <FaBell size={24} />
          </button>

          {/* Profile */}
          <button className="hover:text-gray-300">
            <FaUserCircle size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
}
