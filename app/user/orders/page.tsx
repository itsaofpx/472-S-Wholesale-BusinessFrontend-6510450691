"use client";
import Navbar from "../../components/Navbar";
import { IoIosArrowForward } from "react-icons/io";
import { FaRegFileAlt } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

// Define the order type
type Order = {
  id: string; // or 'number' if 'id' is a number
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]); // State to store order objects with ID

  useEffect(() => {
    async function fetchData() {
      try {
        const userString = sessionStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          const url = `http://localhost:8000/order/user/${user.id}`;
          const response = await axios.get(url);
          setOrders(response.data); // Assuming response.data is an array of orders
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-start flex-grow p-5 space-y-6 pt-24 ">
        <div className="flex flex-col space-y-4 w-full max-w-2xl">
          <div className="flex flex-row items-center text-sm space-x-2 self-start">
            <a href="landing" className="opacity-70">
              Home
            </a>
            <IoIosArrowForward className="opacity-70" />
            <p className="font-bold">Orders</p>
          </div>

          <div className="self-start">
            <p className="text-2xl font-bold">Your Order</p>
          </div>

          <div className="flex flex-col space-y-3 w-full">
            {orders.map((order) => (
              <div
                className="flex flex-row justify-between border items-center p-4 rounded-lg"
                key={order.id}
              >
                <div className="flex flex-row items-center space-x-3">
                  <FaRegFileAlt size={40} />
                  <p className="text-lg font-bold">ID: {order.id}</p>
                </div>
                <Link href={`orders/${order.id}`}>
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
  );
}
