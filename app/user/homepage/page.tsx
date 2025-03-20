"use client";
import Navbar2 from "../../components/Navbar2";
import { FaShoppingCart, FaBoxOpen, FaTruck, FaCreditCard, FaShieldAlt, FaHeadphones } from "react-icons/fa";
import Footer from "../../components/Footer";

export default function Homepage() {
  return (
    <div>
      <Navbar2 />
      <div className="h-[600px] w-screen flex items-center justify-between px-10">
        {/* Text Section */}
        <div className="h-[700px] w-full md:w-1/2 flex items-center justify-center text-center">
          <div className="space-y-6">
            <h2 className="text-black font-light text-[22px]">
              Exclusive Offers
            </h2>
            <h2 className="text-black text-4xl font-semibold">
              Welcome to Wholesale
            </h2>
            <h2 className="text-black font-light text-[22px]">Top up to 50%</h2>
          </div>
        </div>

        {/* Image Section */}
        <div className="h-[200px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[600px] w-full md:w-1/2">
          <img
            src="https://media.ldlc.com/r1600/ld/products/00/06/00/78/LD0006007884_0006008370.jpg"
            className="object-cover w-full h-full"
            alt="Background"
            loading="lazy"
          />
        </div>
      </div>

      {/* Price Range Section with Scrollable Row */}
      <div className="h-[200px] flex justify-evenly space-x-6 bg-white">
        <div className="h-[200px] w-52 bg-white flex flex-col items-center justify-center space-y-4">
          <FaShoppingCart className="text-black text-5xl" />
          <span className="text-black text-lg">Easy Purchase</span>
        </div>
        <div className="h-[200px] w-52 bg-white flex flex-col items-center justify-center space-y-4">
          <FaBoxOpen className="text-black text-5xl" />
          <span className="text-black text-lg">Wide Range of Products</span>
        </div>
        <div className="h-[200px] w-52 bg-white flex flex-col items-center justify-center space-y-4">
          <FaTruck className="text-black text-5xl" />
          <span className="text-black text-lg">Free Delivery</span>
        </div>
        {/* New Features */}
        <div className="h-[200px] w-52 bg-white flex flex-col items-center justify-center space-y-4">
          <FaCreditCard className="text-black text-5xl" />
          <span className="text-black text-lg">Secure Payment</span>
        </div>
        <div className="h-[200px] w-52 bg-white flex flex-col items-center justify-center space-y-4">
          <FaShieldAlt className="text-black text-5xl" />
          <span className="text-black text-lg">100% Protection</span>
        </div>
        <div className="h-[200px] w-52 bg-white flex flex-col items-center justify-center space-y-4">
          <FaHeadphones className="text-black text-5xl" />
          <span className="text-black text-lg">24/7 Support</span>
        </div>
      </div>

      {/* <div className="h-[200px] bg-white-500"></div> */}
      <Footer />
    </div>
  );
}
