import Navbar from "../components/Navbar";
import { IoIosArrowForward } from "react-icons/io";
import { FaRegFileAlt } from "react-icons/fa";
import Link from "next/link";

export default function Orders() {
    return (
        <div>
            <Navbar />
            <div className="flex flex-col items-center justify-start flex-grow p-5 space-y-6 pt-24 ">
                <div className="flex flex-col space-y-4 w-full max-w-2xl">
                    <div className="flex flex-row items-center text-sm space-x-2 self-start">
                        <a href="/landing" className="opacity-70">Home</a>
                        <IoIosArrowForward className="opacity-70" />
                        <p className="font-bold">Orders</p>
                    </div>

                    <div className="self-start">
                        <p className="text-2xl font-bold">Your Order</p>
                    </div>

                    <div className="flex flex-col space-y-3 w-full">
                        {[...Array(5)].map((_, index) => (
                            <div className="flex flex-row justify-between border items-center p-4 rounded-lg" key={index}>
                                <div className="flex flex-row items-center space-x-3">
                                    <FaRegFileAlt size={40} />
                                    <p className="text-lg font-bold">ID:OR19292ASNV</p>
                                </div>
                                <Link href={`/orders/${index}`} key={index}>
                                <div className="underline opacity-50 cursor-pointer">
                                    Details
                                </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
