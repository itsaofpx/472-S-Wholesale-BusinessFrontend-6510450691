"use client";
import Navbar from "../../components/Navbar";
import Image from 'next/image';
import QuantityForm from "../../components/QuantityForm";
import productData from '../../product.json'; // Adjust the path as needed
import Link from "next/link";



export default function Cart({ searchParams }: {
    searchParams: {
        id: number
        qty: number
    }
}) {
    const product = productData.find((item) => item.p_id == searchParams.id);

    return (
        <div className="bg-gray-50 min-h-screen"> {/* Background */}
            {/* Navbar */}
            <header className="fixed w-full z-10">
                <Navbar />
            </header>

            {/* Main */}
            <main className="pt-24 lg:pt-32 pb-8 lg:pb-16 lg:px-8 px-4 space-y-8">
                
                {/* Container */}
                <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-8">
                    
                    {/* Flex​ ซ้าย */}
                    <div className="flex flex-col w-full lg:w-2/3 space-y-4">
                        
                        {/* Home > Cart งับ */}
                        <nav className="pl-3 text-lg mb-2">
                            <ol className="flex items-center space-x-2">
                                <li>
                                    <Link href="/user/landing" className="text-gray-500 hover:text-black font-semibold">
                                        Home
                                    </Link>
                                </li>
                                <li>
                                    <span className="text-gray-400">{'>'}</span>
                                </li>
                                <li>
                                    <span className="text-black font-bold">Cart</span>
                                </li>
                            </ol>
                        </nav>

                        {/* Left Section: Cart Items */}
                        <div className="flex flex-col bg-white border border-gray-300 rounded-lg p-6 shadow-xl flex-grow"> 
                            <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
                            {/* n::Items */}
                            {[1].map((item, index) => (
                                <article key={index} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
                                    <div className="bg-gray-200 p-2 rounded-lg shadow">
                                        <Image
                                            src='https://markprolighting.com/wp-content/uploads/2016/10/WQSL1326.jpg'
                                            width={155}
                                            height={155}
                                            alt={`Thumbnail ${item}`}
                                            className="rounded-lg"
                                        />
                                    </div>
                                    <div className="text-gray-800 font-medium text-sm lg:text-base p-4">
                                        LUNAR ballast 1x36W (40W) L36.800.1
                                    </div>
                                    <div className="ml-4">
                                        <QuantityForm />
                                    </div>
                                </article>
                            ))}
                        </div>

                    </div>

                    {/* Flex ขวา */}
                    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-xl w-full lg:w-1/3 mt-[3.25rem]"> 
                        <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                        <div className="flex flex-col space-y-4">
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span>Subtotal</span>
                                <span>$565</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span>Discount</span>
                                <span>-$112</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span>Total</span>
                                <span>$453</span>
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <select className="border border-gray-300 rounded-lg p-2 w-2/3 mr-2 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                    <option value="">Select Promo Code</option>
                                    <option value="PROMO10">PROMO10 - 10% off</option>
                                    <option value="PROMO20">PROMO20 - 20% off</option>
                                </select>
                                <button className="bg-gray-800 text-white font-medium rounded-lg py-2 px-4 hover:bg-gray-700 transition-colors duration-300">
                                    Apply
                                </button>
                            </div>
                            <Link href="/user/invoice">
                                <div className="mt-4">
                                    <button className="w-full bg-gray-800 text-white font-medium rounded-lg py-2 hover:bg-gray-700 transition-colors duration-300">
                                        สั่งซื้อ
                                    </button>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
