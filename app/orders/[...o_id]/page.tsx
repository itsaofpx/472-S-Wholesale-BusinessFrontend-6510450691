import Navbar from "@/app/components/Navbar";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";

export default function OrderDetail() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="fixed w-full z-10">
                <Navbar />
            </header>
            <main>
            <div className="flex flex-col items-center justify-start flex-grow p-5 space-y-6 pt-24 "> {/* Adjust padding here */}
                <div className="w-full max-w-4xl">
                    <div className="flex flex-row items-center text-sm space-x-2">
                        <a href="/landing" className="opacity-70">Home</a>
                        <IoIosArrowForward className="opacity-70" />
                        <a href="/orders" className="opacity-70">Orders</a> 
                        <IoIosArrowForward className="opacity-70" />
                        <p className="font-bold">Orders_ID</p>
                    </div>

                    <div className="w-full bg-white shadow-md rounded-xl p-5 mt-5">
                        <p className="font-bold text-lg mb-2">ORDER: OR19292ASNV</p>
                        <p>From Quote : Q52MASJVLASD</p>
                        <div className="flex flex-row justify-between mt-3">
                            <p>Status: Shipping</p>
                            <p>Tracking Number : TH123179581</p>
                        </div>
                    </div>

                    <div className="w-full space-y-5 mt-5">
                        {[...Array(5)].map((_, index) => (
                            <div className="flex flex-row justify-between items-center border p-5 rounded-xl shadow-md" key={index}>
                                <div className="flex flex-row items-center">
                                    <Image src='https://down-th.img.susercontent.com/file/th-11134207-7qul5-lhh53ds822eb48.webp' width={100} height={100} alt="Product Image" />
                                    <p className="">GO Product 1</p>
                                </div>
                                <div className="text-lg font-medium">จำนวน 25 ชิ้น</div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <div className="flex flex-row justify-end w-full border p-5 rounded-xl">
                <div>
                    <button type="button" className="text-black bg-write focus:outline-none focus:ring-4 border border-black font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">ยกเลิกคำสั่งซื้อ</button>
                </div>
                <div>
                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">ชำระเงิน</button>
                </div>

            </div>
            </main>
            
        </div>
    )
}
