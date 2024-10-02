"use client";
import Navbar from "../components/Navbar";
import Image from 'next/image';
import QuantityForm from "../components/QuantityForm";
import productData from '../product.json'; // Adjust the path as needed


export default function Cart({ searchParams }: {
    searchParams: {
        id: number
        qty: number
    }
}) {
    const product = productData.find((item) => item.p_id == searchParams.id);

    return (
        <div className="bg-gray-50 min-h-screen"> {/* Background */}
            <Navbar />
            <div className="flex flex-col lg:flex-row h-full justify-center items-start p-4 lg:p-8"> {/* Container ของ flex */}

                {/* Flex​ ซ้าย */}
                <div className="flex flex-col bg-white border border-gray-300 rounded-lg p-4 shadow-lg w-full lg:w-1/2 mb-4 lg:mb-0">
                    {/* Item n ตัว */}
                    {[1, 2, 3].map((item, index) => (
                        <div key={index} className="flex flex-row justify-between items-center p-4 border-b border-gray-200 last:border-b-0">
                            <div className="bg-gray-200 p-2 rounded-lg shadow">
                                <Image
                                    src='https://markprolighting.com/wp-content/uploads/2016/10/WQSL1326.jpg'
                                    width={155}
                                    height={155}
                                    alt={`Thumbnail ${item}`}
                                    className='rounded-lg'
                                />
                            </div>
                            <div className="text-gray-800 font-medium text-sm lg:text-base p-4">{`LUNAR ballast 1x36W (40W) L36.800.1`}</div>
                            <div className="ml-4">
                                <QuantityForm />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Flex ขวา */}
                <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-lg w-full lg:w-1/3 lg:ml-8">
                    <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                    <div className='flex flex-col'>
                        <div className='flex flex-row justify-between py-2 border-b border-gray-200'>
                            <div>Subtotal</div>
                            <div>$565</div>
                        </div>
                        <div className='flex flex-row justify-between py-2 border-b border-gray-200'>
                            <div>Discount</div>
                            <div>-$112</div>
                        </div>
                        <div className='flex flex-row justify-between py-2 border-b border-gray-200'>
                            <div>Total</div>
                            <div>$453</div>
                        </div>
                        <div className="mt-4 flex flex-row items-center justify-between">
                            <select className="border border-gray-300 rounded-lg p-2 w-2/3 mr-2">
                                <option value="">Select Promo Code</option>
                                <option value="PROMO10">PROMO10 - 10% off</option>
                                <option value="PROMO20">PROMO20 - 20% off</option>
                            </select>
                            <button className="bg-gray-800 text-white font-medium rounded-lg py-2 px-4 hover:bg-gray-700">
                                Apply
                            </button>
                        </div>
                        <div className="mt-4">
                            <button className="w-full bg-gray-800 text-white font-medium rounded-lg py-2 hover:bg-gray-700">
                                สั่งซื้อ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
