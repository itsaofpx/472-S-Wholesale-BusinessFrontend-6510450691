"use client";
import BackButton from "@/app/components/BackButton";
import Navbar from "@/app/components/Navbar";
import axios from "axios";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

interface Params {
  o_id: number;
}
interface OrderLine {
  product_id: number;
  product_name: string;
  product_img: string;
  quantity: number;
}

export default function OrderDetail({ params }: { params: Params }) {
  const { o_id } = params;
  const [orderLines, setOrdersLines] = useState<OrderLine[]>([]);
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const router = useRouter();

  const statusMapping = {
    P: "รอชำระเงิน",
    PD: "ชำระเงินเรียบร้อย",
    C: "ยืนยัน",
    S: "กำลังจัดส่ง",
    X: "ยกเลิกคำสั่งซื้อ",
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const orderLineUrl = `http://localhost:8000/orders/${o_id}/orderlines`;
        const orderLineResponse = await axios.get(orderLineUrl);
        setOrdersLines(orderLineResponse.data);
        console.log("Order Lines:", orderLineResponse.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchData();
  }, [o_id]);

  useEffect(() => {
    async function fetchData() {
      try {
        const orderUrl = `http://localhost:8000/order/${o_id}`;
        const orderResponse = await axios.get(orderUrl);
        setOrderStatus(orderResponse.data.o_status);
        setTrackingNumber(orderResponse.data.tracking_number);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handleCheckout = () => {
    router.push(`/user/invoice?o_id=${o_id}`);
  };

  const submitCancelOrder = async () => {
    const updatedOrder = {
      o_status: "X", // Set the status to "X" for cancellation
      id: Number(o_id), // Ensure o_id is an integer
    };

    try {
      const updateStatusUrl = `http://localhost:8000/order/status/update`;
      const updateStatusResponse = await axios.put(
        updateStatusUrl,
        updatedOrder,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (updateStatusResponse.status === 200) {
        setOrderStatus("X"); // Update the order status locally to "Canceled"
        alert("Order has been successfully canceled.");
        router.push("/user/orders");
      } else {
        alert("Failed to cancel the order. Please try again.");
      }
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed w-full z-10">
        <Navbar />
        <BackButton />
      </header>
      <main>
        <div className="flex flex-col items-center justify-start flex-grow p-5 space-y-6 pt-24 pb-24 ">
          {" "}
          {/* Adjust padding here */}
          <div className="w-full max-w-4xl">
            <div className="flex flex-row items-center text-sm space-x-2">
              <a href="../landing" className="opacity-70">
                Home
              </a>
              <IoIosArrowForward className="opacity-70" />
              <a href="../orders" className="opacity-70">
                Orders
              </a>
              <IoIosArrowForward className="opacity-70" />
              <p className="font-bold">Orders_ID</p>
            </div>

            <div className="w-full bg-white shadow-md rounded-xl p-5 mt-5">
              <p className="font-bold text-lg mb-2">ORDER: OR19292ASNV</p>
              <div className="flex flex-row justify-between mt-3">
                <p>
                  Status :{" "}
                  {statusMapping[orderStatus as keyof typeof statusMapping]}
                </p>
                <p>
                  Tracking Number : {trackingNumber || "No Tracking Number"}
                </p>
              </div>
            </div>

            <div className="w-full space-y-5 mt-5">
              {orderLines && orderLines.length > 0 ? (
                orderLines.map((orderLine, index) => (
                  <div
                    className="flex flex-row justify-between items-center border p-5 rounded-xl shadow-md"
                    key={index}
                  >
                    <div className="flex flex-row items-center">
                      <Image
                        src={orderLine.product_img}
                        width={100}
                        height={100}
                        alt="Product Image"
                      />
                      <p className="ml-4">{orderLine.product_name}</p>
                    </div>
                    <div className="text-lg font-medium">
                      {orderLine.quantity}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No order lines found.</p>
              )}
            </div>
          </div>
        </div>
        <div className="fixed bottom-0 w-full bg-white z-10">
          {" "}
          {/* Apply fixed position and bottom-0 */}
          <div className="flex flex-row justify-end border p-5 rounded-xl">
            {orderStatus !== "PD" && orderStatus !== "X" && (
              <div>
                <button
                  onClick={submitCancelOrder}
                  type="button"
                  className="text-black bg-white focus:outline-none focus:ring-4 border border-black font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2"
                >
                  ยกเลิกคำสั่งซื้อ
                </button>
              </div>
            )}

            <div>
              {orderStatus !== "X" && (
                <button
                  onClick={handleCheckout}
                  type="button"
                  className={`text-white ${
                    orderStatus === "PD"
                      ? "bg-gray-500"
                      : "bg-blue-700 hover:bg-blue-800"
                  } focus:outline-none focus:ring-4 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2`}
                  disabled={orderStatus === "PD"} // Disable button if status is PD
                >
                  {orderStatus === "PD" ? "ชำระเรียบร้อย" : "ชำระเงิน"}
                </button>
              )}
            </div>

            
          </div>
        </div>
      </main>
    </div>
  );
}
