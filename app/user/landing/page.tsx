"use client";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../../components/Loading";
import { LuMessageCircleQuestion } from "react-icons/lu";
import ChatButton from "@/app/components/ChatButton";

interface Product {
  id: string;
  image_url_1: string;
  p_name: string;
  p_price: number;
}

export default function Landing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState();
  const [name, setName] = useState("");
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(29999);
  const [showChat, setShowChat] = useState(false);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products");
        setProducts(response.data);
        setFilteredProducts(response.data);

        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching the products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserID(user.id || "Guest");
    }
  }, []);

  const handleSearch = () => {
    console.log("Searching with:", { name, minPrice, maxPrice });

    const filtered = products.filter((product) => {
      const matchesName = name ? product.p_name.toLowerCase().includes(name.toLowerCase()) : true;
      const matchesMinPrice = product.p_price >= minPrice;
      const matchesMaxPrice = product.p_price <= maxPrice;

      // ถ้าไม่มีชื่อ ให้เช็คเฉพาะช่วงราคา
      if (!name) {
        return matchesMinPrice && matchesMaxPrice;
      }

      // ถ้ามีชื่อก็ต้องเช็คชื่อด้วย
      return matchesName && matchesMinPrice && matchesMaxPrice;
    });

    setFilteredProducts(filtered);
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div className="fixed w-full z-10">
        <Navbar />
      </div>

      <div className="pt-20 lg:pt-24 flex flex-col lg:flex-row h-screen px-5 lg:px-10 py-5 space-y-5 lg:space-y-0 lg:space-x-10 relative">
        {/* Sidebar - Filters */}
        <div className="space-y-6 xs:w-full justify-center items-center">
          <div>
            <h2 className="font-semibold text-lg">Search</h2>
            <div className="mt-2">
              <input
                type="text"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 hover:border-slate-300 shadow-sm"
                placeholder="Type here..."
                aria-label="Search"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

          </div>
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">Price</h2>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                className="w-full bg-white text-sm border rounded-md px-3 py-2 focus:outline-none"
                placeholder="฿ 0.00"
                value={minPrice}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setMinPrice(value);
                }}

              />
              <div className="h-1 w-full bg-black" />
              <input
                type="number"
                className="w-full bg-white text-sm border rounded-md px-3 py-2 focus:outline-none"
                placeholder="฿ 0.00"
                value={maxPrice}

                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setMaxPrice(value);
                }}
              />
            </div>
          </div>
          <div>
            <button
              onClick={handleSearch}
              className="w-full px-4 py-2 bg-black text-white rounded-lg transition"
            >
              ค้นหาสินค้า
            </button>
          </div>

        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-auto ">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(filteredProducts) && filteredProducts.length === 0 ? (
              <div className="bg-red-white mt-[300px] col-span-full text-center text-gray-500">
                ไม่มีสินค้าที่ตรงกับการค้นหา
              </div>
            ) : (
              Array.isArray(filteredProducts) && filteredProducts.map(
                (product: {
                  id: string;
                  image_url_1: string;
                  p_name: string;
                }) => (
                  <Link key={product.id} href={`landing/details/${product.id}`}>
                    <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center space-y-3">
                      <Image
                        src={product.image_url_1}
                        width={200}
                        height={200}
                        alt={product.p_name}
                        className="rounded-md"
                      />
                      <div className="text-center">{product.p_name}</div>
                    </div>
                  </Link>
                )

              )
            )}
          </div>
        </div>

        <ChatButton />
      </div>
    </div>
  );
}
