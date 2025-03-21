"use client";
import AdminNavbar from "@/app/components/AdminNavbar";
import { useEffect, useState } from "react";

interface SupplierOrderListInterface {
    id: number;
    supplier_id: number;
    price: number;
    product_id: number;
    quantity: number;
}

export default function Expense() {
    const [supplierOrderLists, setSupplierOrderLists] = useState<SupplierOrderListInterface[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSupplierOrderLists = async () => {
            try {
                const url = "http://localhost:8000/supplierOrderLists";
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const supplierOrderLists = await response.json();
                setSupplierOrderLists(supplierOrderLists);
            } catch (error) {
                setError((error as Error).message);
            }
        };
        fetchSupplierOrderLists();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
                <header><AdminNavbar /></header>
                <h1 className="text-red-500 font-semibold mt-4">Error: {error}</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header><AdminNavbar /></header>
            <ul className="space-y-4">
                {Array.isArray(supplierOrderLists) && supplierOrderLists.length > 0 &&
                supplierOrderLists.map((item) => (
                    <li
                        key={item.id}
                        className="bg-white shadow-md rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="text-lg font-medium">Order ID: {item.id}</div>
                        <div className="text-sm text-gray-600">Supplier ID: {item.supplier_id}</div>
                        <div className="text-sm text-gray-600">Product ID: {item.product_id}</div>
                        <div className="text-sm text-gray-600">Quantity: {item.quantity}</div>
                        <div className="text-sm text-gray-600">Price: {item.price.toFixed(2)} บาท</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
