'use client'
import Navbar from "@/app/components/Navbar";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

interface Params {
    o_id: number;
}

export default function OrderDetail({ params }: { params: Params }) {
    const {o_id} = params
    const [orderLines, setOrdersLines] = useState([])
    const [order, setOrder] = useState("")

    useEffect(() => {
        async function fetchData() {
          try {
              const url = `http://localhost:8000/orders/${o_id}/orderLines`;
              const response = await axios.get(url);
              setOrdersLines(response.data)
          } catch (error) {
            console.error("Error fetching orders:", error);
          }
        }
        fetchData();
      }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <header className="fixed w-full z-10">
                <Navbar />
            </header>
            <main>
                <div className="flex flex-col items-center justify-start flex-grow p-5 space-y-6 pt-24 pb-24 "> {/* Adjust padding here */}
                    <div className="w-full max-w-4xl">
                        <div className="flex flex-row items-center text-sm space-x-2">
                            <a href="../landing" className="opacity-70">Home</a>
                            <IoIosArrowForward className="opacity-70" />
                            <a href="../orders" className="opacity-70">Orders</a>
                            <IoIosArrowForward className="opacity-70" />
                            <p className="font-bold">Orders_ID</p>
                        </div>

                        <div className="w-full bg-white shadow-md rounded-xl p-5 mt-5">
                            <p className="font-bold text-lg mb-2">ORDER: OR19292ASNV</p>
                            <div className="flex flex-row justify-between mt-3">
                                <p>Status: Shipping</p>
                                <p>Tracking Number : TH123179581</p>
                            </div>
                        </div>

                        <div className="w-full space-y-5 mt-5">
                            {orderLines.map((orderLine, index) => (
                                <div className="flex flex-row justify-between items-center border p-5 rounded-xl shadow-md" key={index}>
                                    <div className="flex flex-row items-center">
                                        <Image src={orderLine.product_img} width={100} height={100} alt="Product Image" />
                                        <p className="">{orderLine.product_name}</p>
                                    </div>
                                    <div className="text-lg font-medium">{orderLine.quantity}</div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
                <div className="fixed bottom-0 w-full bg-white z-10"> {/* Apply fixed position and bottom-0 */}
                    <div className="flex flex-row justify-end border p-5 rounded-xl">
                        <div>
                            <button type="button" className="text-black bg-white focus:outline-none focus:ring-4 border border-black font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
                                ยกเลิกคำสั่งซื้อ
                            </button>
                        </div>
                        <div>
                            <Link href={`/user/invoice`}>
                            <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                ชำระเงิน
                            </button>
                            </Link>
                        </div>
                    </div>
                </div>

            </main>

        </div>
    )
}
