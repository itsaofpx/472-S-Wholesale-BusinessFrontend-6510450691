"use client";
import Navbar from "../components/Navbar";
import Image from 'next/image';


import Link from "next/link";
import { useEffect, useState } from "react";
import { ImInsertTemplate } from "react-icons/im";
import { notify } from "../components/Toast";

interface CartItem {
    id: number;
    p_name: string;
    p_location: string;
    p_amount: number;
    p_price: number;
    image_url_1: string;
    quantity: number;
  }

export default function Cart() {

    const [cart, setCart] = useState<CartItem[]>([]);
    const [total, setTotal] = useState<number>(0);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
        setCart(storedCart)
        calculateTotal(storedCart)
   
    }, [])

    const calculateTotal = (cart : CartItem[]) => {
        const newTotal = cart.reduce((acc, item) => acc + item.p_price * item.quantity, 0);
        setTotal(newTotal)
        console.log(newTotal)
    }
    const handleQuantityChange = (id: number, newQuantity: number) => {
        const updatedCart = cart.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        );
    
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        calculateTotal(updatedCart);
        notify("Quantity updated");
      };

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
                                    <Link href="/landing" className="text-gray-500 hover:text-black font-semibold">
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
                            {cart.map((item, index) => (
                                <article key={index} className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
                                    <div className="bg-gray-200 p-2 rounded-lg shadow">
                                        <Image
                                            src={item.image_url_1}
                                            width={155}
                                            height={155}
                                            alt={`Thumbnail ${item}`}
                                            className="rounded-lg"
                                        />
                                    </div>
                                    <div className="text-gray-800 font-medium text-sm lg:text-base p-4">
                                        {item.p_name}
                                    </div>
                                    <div className="ml-4">
                                      {/* Quantity Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleQuantityChange(
                      item.id,
                      Math.max(1, item.quantity - 1)
                    )
                  }
                  className="text-gray-600 px-2 py-1 rounded-lg bg-gray-200"
                >
                  -
                </button>
                <span className="px-2">{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.id, item.quantity + 1)
                  }
                  className="text-gray-600 px-2 py-1 rounded-lg bg-gray-200"
                >
                  +
                </button>
              </div>
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
                                <span>{total}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span>Discount</span>
                                {/* TODO :   */}
                                <span>NEEDED TO GET FROM USER'S TIER</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-200">
                                <span>Total</span>
                                <span>$453</span>
                            </div>


                            <div className="mt-4">
                                <button className="w-full bg-gray-800 text-white font-medium rounded-lg py-2 hover:bg-gray-700 transition-colors duration-300">
                                    สั่งซื้อ
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}