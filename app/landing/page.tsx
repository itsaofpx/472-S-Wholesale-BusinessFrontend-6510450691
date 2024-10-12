"use client"
import Link from "next/link";
import Navbar from "../components/Navbar";
import Image from "next/image";
import productData from '../product.json';
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";

export default function Landing() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch product data from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/products");
        setProducts(response.data);  // assuming the response data is an array of products
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  console.log(products)

  if (loading) {
    return <div><Loading /></div>;
}

  return (
    <div>
      {/* Navbar */}
      <div className="fixed w-full z-10">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="pt-20 lg:pt-24 flex flex-col lg:flex-row h-screen px-5 lg:px-10 py-5 space-y-5 lg:space-y-0 lg:space-x-10">

        {/* Sidebar - Filters */}
        <div className="space-y-6 xs:w-full justify-center items-center">

          {/* Search Section */}
          <div>
            <h2 className="font-semibold text-lg">Search</h2>
            <div className="mt-2">
              <input
                type="text"
                className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 hover:border-slate-300 shadow-sm"
                placeholder="Type here..."
                aria-label="Search"
              />
            </div>
          </div>

          {/* Price Range Section */}
          <div className="space-y-2">
            <h2 className="font-semibold text-lg">Price</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 hover:border-slate-300 shadow-sm"
                placeholder="฿ 0.00"
              />
              <div className="h-1 w-full bg-black" />
              <input
                type="text"
                className="w-full bg-white placeholder:text-slate-400 text-slate-700 text-sm border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 hover:border-slate-300 shadow-sm"
                placeholder="฿ 0.00"
              />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {/* Map through the products */}
            {products.map((product: { id: string; image_url_1: string; p_name: string }) => (
              <Link key={product.id} href={`/landing/details/${product.id}`}>
                <div
                  className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center space-y-3"
                >
                  <Image
                    src={product.image_url_1}
                    width={200}
                    height={200}
                    alt={product.p_name}
                    className="rounded-md"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
