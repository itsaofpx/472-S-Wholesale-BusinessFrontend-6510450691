"use client";

import AdminNavbar from "@/app/components/AdminNavbar";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Order {
  id: number;
  o_status: string;
  o_total_price: number;
  o_timestamp: string;
  userID: number;
}

const statusMapping: { [key: string]: string } = {
  P: "Pending",
  PD: "Paid",
  C: "Confirmed",
  S: "Shipping",
  X: "Canceled",
};

const statuses = Object.keys(statusMapping); // Get all status keys

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>(""); // State for selected status
  const router = useRouter();
  useEffect(() => {
    async function fetchData() {
      try {
        const url = `http://localhost:8000/orders`;
        const response = await axios.get(url);
        setOrders(response.data); // Sets the orders data to state
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    }
    fetchData();
  }, []); // Added an empty dependency array to avoid repeated calls

  // Filter orders based on selected status
  const filteredOrders = selectedStatus
    ? orders.filter((order) => order.o_status === selectedStatus)
    : orders;

  return (
    <div>
      <header>
        <AdminNavbar />
      </header>
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-4">Orders</h1>

        <div className="mb-4">
          <label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700"
          >
            Filter by Status:
          </label>
          <select
            id="status-filter"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusMapping[status]}
              </option>
            ))}
          </select>
        </div>

        {filteredOrders.length > 0 ? (
          <ul className="space-y-4">
            {filteredOrders.map((order) => (
              <li
                key={order.id}
                onClick={() => router.push(`/admin/orders/${order.id}`)}
                className="p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm cursor-pointer"
              >
                <h2 className="text-lg font-bold">Order ID: {order.id}</h2>
                <p>
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      order.o_status === "X"
                        ? "text-red-500"
                        : order.o_status === "S"
                        ? "text-blue-500"
                        : "text-green-500"
                    }`}
                  >
                    {statusMapping[order.o_status] || "Unknown"}
                  </span>
                </p>
                <p>Total Price: {order.o_total_price} บาท</p>
                <p>Timestamp: {new Date(order.o_timestamp).toLocaleString()}</p>
                <p>User ID: {order.userID}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
}
