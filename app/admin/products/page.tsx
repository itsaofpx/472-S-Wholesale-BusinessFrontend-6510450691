"use client";

import Loading from "@/app/components/Loading";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/AdminNavbar";
import BackButton from "@/app/components/BackButton";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [notFound, setNotFound] = useState(false); // state เพื่อเช็คการไม่พบสินค้า
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const response = await axios.get("http://localhost:8000/products");
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching the products:", error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchProducts();
      return;
    }

    setLoading(true);
    setNotFound(false);
    try {
      const response = await axios.post(
        "http://localhost:8000/products/filter",
        { name: searchTerm },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.length === 0) {
        // ถ้าไม่พบสินค้า
        setNotFound(true);
      } else {
        setProducts(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching the filtered products:", error);
      setLoading(false);
    }
  };

  const handleAddProduct = () => {
    router.push("products/addProduct");
  };
  const handleAddSupplier = () => {
    router.push("products/addSupplier");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <header>
        <AdminNavbar />
        <div className="bg-gray-100">
        <BackButton />
        </div>
      </header>
      <div className="p-10 bg-gray-100 min-h-screen">
        {/* Search Input and Button */}
        <div className="flex flex-row justify-between items-center mb-6">
          <div className="flex flex-grow justify-center">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for a product..."
              className="px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none flex-grow"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition"
            >
              Search
            </button>
          </div>
          <div className="ml-4 space-x-3">
            <button
              onClick={handleAddProduct}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              เพิ่มสินค้า
            </button>
            <button
              onClick={handleAddSupplier}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              เพิ่มผู้จำหน่าย
            </button>
          </div>
        </div>

        {notFound ? (
          <div className="text-center text-gray-500">ไม่พบสินค้าที่ค้นหา</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.isArray(products) && products.length > 0 &&
              products.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`products/${product.id}`)}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col items-center space-y-4 transform hover:-translate-y-2 cursor-pointer"
              >
                {/* Image */}
                <div className="w-full h-64 rounded-lg overflow-hidden shadow-inner mb-4">
                  <Image
                    src={product.image_url_1}
                    width={300}
                    height={250}
                    alt={product.p_name}
                    className="object-contain w-full h-full"
                  />
                </div>

                {/* Product Name */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                  {product.p_name}
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-sm text-center px-2 mb-4">
                  {product.p_description}
                </p>

                {/* Location */}
                <p className="text-xs text-gray-500 italic">
                  Location: {product.p_location}
                </p>

                {/* Price and Quantity */}
                <div className="flex justify-between w-full mt-4">
                  <span className="text-gray-700 font-medium">
                    Quantity: {product.p_amount}
                  </span>
                  <span className="text-indigo-600 font-bold text-lg">
                    {product.p_price} บาท
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
