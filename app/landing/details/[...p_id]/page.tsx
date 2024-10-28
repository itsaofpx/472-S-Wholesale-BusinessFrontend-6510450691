"use client";

import Image from "next/image";
import Navbar from "../../../components/Navbar";
import { useEffect, useState } from "react";
import Toast, { notify } from "../../../components/Toast"
import Loading from "@/app/components/Loading";

interface Params {
  p_id: number;
}

interface Product {
  id: number;
  p_name: string;
  p_location: string;
  p_amount: number;
  p_price: number;
  image_url_1: string;
  image_url_2: string;
  image_url_3: string;
}

interface CartItem extends Product {
  quantity: number;
}



export default function ProductDetail({ params }: { params: Params }) {
  const { p_id } = params;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const [countQuantity, setCountQuantity] = useState<number>(1);
  const [mainImage, setMainImage] = useState("");


  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/product/${p_id}`);
        const data = await response.json();
        setProduct(data);
        setMainImage(data.image_url_1);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [p_id]);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }



  const handleMainImage = (image_url: string) => {
    setMainImage(image_url);

  };

  const addToCart = () => {
    if (!product) {
      return ;
    }

     // Get current cart from localStorage
     const cart = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];

     // Check if the item is already in the cart
     const existingItemIndex = cart.findIndex(item => item.id === product.id);
 
     if (existingItemIndex !== -1) {
       // If the item exists, update the quantity
       cart[existingItemIndex].quantity += 1;
     } else {
       // If the item doesn't exist, add it with quantity 1
       cart.push({ ...product, quantity: 1 });
     }
 
     // Save the updated cart back to localStorage
     localStorage.setItem("cart", JSON.stringify(cart));
 
     // Show notification
     notify("Product added to cart!");
  }




  return (
    <div>
      <Navbar />
      <Toast />
      <div className="flex h-screen items-center justify-center px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:mx-10 border border-gray-300 shadow-lg rounded-lg p-4">
          {/* Left Side: Image Thumbnails and Main Image */}
          <div className="flex flex-col-reverse md:flex-row space-x-2 items-center">
            <div className="flex flex-row md:flex-col scale-75 md:scale-100 md:space-y-4 md:opacity-100">
              {/* Thumbnails */}
              {[
                product.image_url_1,
                product.image_url_2,
                product.image_url_3,
              ].map((url, index) => (
                <button onClick={() => handleMainImage(url)} key={index}>
                  <Image
                    src={url}
                    width={155}
                    height={155}
                    alt={`Thumbnail ${index + 1}`}
                    className="rounded-lg cursor-pointer hover:scale-105 transition-transform duration-200"
                  />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-grow md:ml-4">
              <Image
                src={mainImage} // Use the first image as the main image
                width={500}
                height={500}
                alt="Main product image"
                className="rounded-lg object-contain shadow-lg"
                priority
              />
            </div>
          </div>

          {/* Right Side: Product Description */}
          <div className="flex flex-col justify-between flex-grow ml-4 mt-4 md:mt-0 md:ml-10 p-2 text-center md:text-left">
            <div className="font-bold text-3xl md:text-5xl">
              {product.p_name}
            </div>

            <div className="mt-4 text-gray-600">
              Location: {product.p_location}
            </div>

            <div className="mt-4 text-2xl font-semibold text-green-600">
              {product.p_price} บาท
            </div>

            <div className="flex flex-row mt-4 space-x-4">
              
                <button
                onClick={addToCart}
                  type="button"
                  className="
      text-white bg-gray-800 
      hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 
      font-medium rounded-full text-sm px-5 py-2.5 
      transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  Add to Cart
                </button>
        
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
