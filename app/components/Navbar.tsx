import {
  FaShoppingCart,
  FaBell,
  FaUserCircle,
  FaRegFileAlt,
} from "react-icons/fa";
import Link from "next/link";
import { HiMiniCreditCard } from "react-icons/hi2";
import { PiShoppingBagOpenFill } from "react-icons/pi";


export default function Navbar() {
  return (
    <nav className="bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Left side: Logo */}
        <div className="flex items-center ">
          <div className="mr-3">
            <PiShoppingBagOpenFill className="size-7" />
          </div>
          <a
            href="/user/landing"
            className="text-2xl font-bold tracking-wide text-white hover:text-gray-300"
          >
            Wholesale
          </a>
        </div>
        {/* Right side: Icons */}
        <div className="flex space-x-6">
          {/* Shopping Cart */}
          <button className="hover:text-gray-300">
            <Link href="/user/mycreditcard">
              <HiMiniCreditCard size={30} />          
            </Link>
          </button>

          {/* Shopping Cart */}
          <button className="hover:text-gray-300">
            <Link href="/user/cart">
              <FaShoppingCart size={24} />
            </Link>
          </button>

          {/* Notifications */}
          <button className="hover:text-gray-300">
            <Link href="/user/orders">
              <FaRegFileAlt size={24} />
            </Link>
          </button>

          {/* Profile */}
          <button className="hover:text-gray-300">
            <Link href="/user/profile">
              <FaUserCircle size={24} />
            </Link>
          </button>
        </div>
      </div>
    </nav>
  );
}
