import { FaShoppingCart, FaRegFileAlt, FaUserCircle } from "react-icons/fa";
import Link from "next/link";
import { PiShoppingBagOpenFill } from "react-icons/pi";

export default function Navbar2() {
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
        <div className="flex space-x-6 items-center">
          {/* Shopping Cart */}
          <button className="hover:text-gray-300">
            <Link href="/">
              <FaShoppingCart size={24} />
            </Link>
          </button>

          {/* Notifications */}
          <button className="hover:text-gray-300">
            <Link href="/">
              <FaRegFileAlt size={24} />
            </Link>
          </button>

          {/* Profile */}
          <button className="hover:text-gray-300">
            <Link href="/">
              <FaUserCircle size={24} />
            </Link>
          </button>

          {/* Login Button */}
          <button className="px-10 py-2 bg-white font-bold text-black rounded-md hover:bg-black hover:text-white transition duration-300">
            <Link href="/">Login</Link>
          </button>
        </div>
      </div>
    </nav>
  );
}
