import { FaShoppingCart, FaRegFileAlt, FaUserCircle } from 'react-icons/fa';

import Link from "next/link";
export default function AdminNavbar() {
  return (
    <nav className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Left side: Logo */}
        <div>
          <a href="" className="text-2xl font-bold tracking-wide text-white hover:text-gray-300">
            ADMIN
          </a>
        </div>

        {/* Right side: Icons */}
        <div className="flex space-x-6">
          
          {/* Shopping Cart */}
          <button className="hover:text-gray-300">
            <Link href= '/admin/products'>
            <FaShoppingCart size={24} />
            </Link>
          </button>

          {/* Notifications */}
          <button className="hover:text-gray-300">
            <Link href = "/admin/orders">
              <FaRegFileAlt size={24} />
            </Link>
          </button>

          {/* Profile */}
          <button className="hover:text-gray-300">
            <Link href = "/admin/users">
              <FaUserCircle size={24} />
            </Link>
          </button>
        </div>
      </div>
    </nav>
  );
}
