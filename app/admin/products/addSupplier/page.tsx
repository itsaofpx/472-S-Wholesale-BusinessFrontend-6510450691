"use client";

import AdminNavbar from "@/app/components/AdminNavbar";
import BackButton from "@/app/components/BackButton";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddSupplier() {
  const [supplierName, setSupplierName] = useState("");
  const [supplierContactPerson, setSupplierContactPerson] = useState("");
  const [supplierEmail, setSupplierEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    postSupplier();
  };

  const postSupplier = async () => {
    const payload = {
      name: supplierName,
      contract_person: supplierContactPerson,
      email: supplierEmail,
    };

    try {
      const response = await axios.post(
        "http://localhost:8000/suppliers",
        payload,    
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Supplier added successfully:", response.data);
      setErrorMessage(""); // Clear any previous error message
      router.push("/admin/products");
    } catch (error) {
      console.error("Error adding supplier:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while adding the supplier. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header>
        <AdminNavbar />
        <BackButton />
      </header>
      <main className="flex-grow flex items-center justify-center py-8">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add New Supplier
          </h2>
          {errorMessage && (
            <p className="text-red-600 mb-4 font-medium">{errorMessage}</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="supplierName"
              >
                Supplier Name
              </label>
              <input
                type="text"
                id="supplierName"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Enter supplier name"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="supplierContactPerson"
              >
                Contact Person
              </label>
              <input
                type="text"
                id="supplierContactPerson"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                value={supplierContactPerson}
                onChange={(e) => setSupplierContactPerson(e.target.value)}
                placeholder="Enter contact person"
              />
            </div>
            <div>
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="supplierEmail"
              >
                Supplier Email
              </label>
              <input
                type="email"
                id="supplierEmail"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                value={supplierEmail}
                onChange={(e) => setSupplierEmail(e.target.value)}
                placeholder="Enter supplier email"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Add Supplier
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
