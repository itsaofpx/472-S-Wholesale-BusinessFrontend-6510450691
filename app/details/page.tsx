"use client";

import Image from 'next/image'
import Navbar from '../components/Navbar'
import { useState } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa6";

export default function ProductDetail() {
  const [countQuantity, setCountQuantity] = useState<number>(1);

  const handleIncrement = () => {
    setCountQuantity(countQuantity + 1);
  };

  const handleDecrement = () => {
    if (countQuantity > 1) {
      setCountQuantity(countQuantity - 1);
    }
  };


  return (
    <div>
      <Navbar />
      <div className='flex h-screen items-center justify-center px-4'>
        <div className="flex flex-col md:flex-row justify-between items-center md:mx-10 border border-gray-300 shadow-lg rounded-lg p-4">
          {/* Left Side: Image Thumbnails and Main Image */}
          <div className="flex flex-col-reverse md:flex-row space-x-2 items-center">
            <div className='flex flex-row md:flex-col scale-75 md:scale-100 md:space-y-4 md:opacity-100'>
              {/* Thumbnails */}
              <Image
                src='https://markprolighting.com/wp-content/uploads/2016/10/WQSL1326.jpg'
                width={155}
                height={155}
                alt='Thumbnail 1'
                className='rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200'
              />
              <Image
                src='https://markprolighting.com/wp-content/uploads/2016/10/WQSL1326.jpg'
                width={155}
                height={155}
                alt='Thumbnail 2'
                className='rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200'
              />
              <Image
                src='https://markprolighting.com/wp-content/uploads/2016/10/WQSL1326.jpg'
                width={155}
                height={155}
                alt='Thumbnail 3'
                className='rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200'
              />
            </div>

            {/* Main Image */}
            <div className="flex-grow md:ml-4">
              <Image
                src='https://markprolighting.com/wp-content/uploads/2016/10/WQSL1326.jpg'
                width={500}
                height={500}
                alt='Main product image'
                className='rounded-lg object-contain shadow-lg'
                priority
              />
            </div>
          </div>

          {/* Right Side: Product Description */}
          <div className="flex flex-col justify-between flex-grow ml-4 mt-4 md:mt-0 md:ml-10 p-2 text-center md:text-left">
            <div className="font-bold text-3xl md:text-5xl">
              LUNAR ballast 1x36W (40W) L36.800.1
            </div>

            <div className="mt-4 text-gray-600">
              This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
            </div>

            <div className="mt-4 text-2xl font-semibold text-green-600">
              550 บาท
            </div>

            <div className="flex flex-row mt-4 space-x-4">
              <div className="flex flex-row items-center gap-x-4 
            text-gray-800 border border-gray-800 
            font-medium rounded-full text-sm px-5 py-2.5">
                <div><button onClick={handleDecrement} > <FaMinus /> </button></div>
                <div className='text-xl'>{countQuantity}</div>
                <div><button onClick={handleIncrement}><FaPlus /></button></div>
              </div>

              <button type="button" className="
            text-white bg-gray-800 
            hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 
            font-medium rounded-full text-sm px-5 py-2.5 
            transition-all duration-300 ease-in-out transform hover:scale-105">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}