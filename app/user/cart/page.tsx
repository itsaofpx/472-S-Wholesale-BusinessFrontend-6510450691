"use client";
import Navbar from "../../components/Navbar";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { notify } from "../../components/Toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  p_name: string;
  p_location: string;
  p_amount: number;
  p_price: number;
  image_url_1: string;
  quantity: number;
}

interface OrderLine {
  product_id: number;
  order_id: number;
  quantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>();
  const [discount, setDiscount] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
    calculateTotal(storedCart);
  }, []);

  useEffect(() => {
    async function fetchData() {
      const userString = sessionStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        try {
          const url = `http://localhost:8000/discount/${user.id}`;
          const response = await axios.get(url);
          const discountPercent =
            (100 - Number.parseFloat(response.data.discount_percent)) / 100;
          console.log(discountPercent);
          setDiscountPercent(discountPercent);
        } catch (error) {
          console.log(error);
        }
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (total && discountPercent !== undefined) {
      const totalDiscount = total - total * discountPercent;
      setDiscount(totalDiscount);
      console.log("DISCOUNT", totalDiscount);
    }
  }, [total, discountPercent]);

  const calculateTotal = (cart: CartItem[]) => {
    const newTotal = cart.reduce(
      (acc, item) => acc + item.p_price * item.quantity,
      0
    );
    setTotal(newTotal);
    console.log(newTotal);
  };

  const handleQuantityChange = (id: number, newQuantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    calculateTotal(updatedCart);
    notify("Quantity updated");
  };

  const handleCreateOrder = async () => {
    try {
        const userString = sessionStorage.getItem("user");
        if (userString) {
            const user = JSON.parse(userString);
            if (user && user.id) {
                // First, create the order and get the order ID
                const orderUrl = `http://localhost:8000/order`;
                const orderResponse = await axios.post(orderUrl, { userID: user.id });
                const orderID = orderResponse.data.id;
                console.log("Order ID:", orderID);

                console.log("Order Response", orderResponse.data);

                // Log cart items to check if p_id exists
                console.log("Cart items:", cart);
                cart.forEach((item, index) => {
                  console.log(`Item ${index + 1}: p_id = ${item.id}, quantity = ${item.quantity}`);
              });
              
                // Transform cart items into order lines
                const orderLines: OrderLine[] = cart.map(item => ({
                
                    product_id: item.id,   
                    order_id: orderID,
                    quantity: item.quantity
                }));

                console.log("Mapped OrderLines:", orderLines);

                // Send order lines to the server
                const orderLineUrl = `http://localhost:8000/orderlines`;
                const orderLineResponse = await axios.post(orderLineUrl, orderLines);
                
                console.log("Order lines created:", orderLineResponse.data);

                //  clear the cart and navigate to orders page
                localStorage.removeItem("cart");
                router.push("orders");
            } else {
                console.error("User ID not found.");
            }
        } else {
            console.error("No user data in sessionStorage.");
        }
    } catch (error) {
        console.error("Error in API request:", error);
    }
};
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Background */}
      {/* Navbar */}
      <header className="fixed w-full z-10">
        <Navbar />
      </header>
      {/* Main */}
      <main className="pt-24 lg:pt-32 pb-8 lg:pb-16 lg:px-8 px-4 space-y-8">
        {/* Container */}
        <div className="flex flex-col lg:flex-row justify-center items-start lg:space-x-8">
          {/* Left Section: Cart Items */}
          <div className="flex flex-col w-full lg:w-2/3 space-y-4">
            <nav className="pl-3 text-lg mb-2">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link
                    href="/user/landing"
                    className="text-gray-500 hover:text-black font-semibold"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <span className="text-gray-400">{">"}</span>
                </li>
                <li>
                  <span className="text-black font-bold">Cart</span>
                </li>
              </ol>
            </nav>
            <div className="flex flex-col bg-white border border-gray-300 rounded-lg p-6 shadow-xl flex-grow">
              <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
              {cart.map((item, index) => (
                <article
                  key={index}
                  className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0"
                >
                  <div className="bg-gray-200 p-2 rounded-lg shadow">
                    <Image
                      src={item.image_url_1}
                      width={155}
                      height={155}
                      alt={`Thumbnail ${item}`}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="text-gray-800 font-medium text-sm lg:text-base p-4">
                    {item.p_name}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            Math.max(1, item.quantity - 1)
                          )
                        }
                        className="text-gray-600 px-2 py-1 rounded-lg bg-gray-200"
                      >
                        -
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.id, item.quantity + 1)
                        }
                        className="text-gray-600 px-2 py-1 rounded-lg bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Section: Order Summary */}
          <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-xl w-full lg:w-1/3 mt-[3.25rem]">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>Subtotal</span>
                <span>{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>Discount</span>
                <span>-{discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span>Total</span>
                <span>{(total - discount).toFixed(2)}</span>
              </div>

              <div className="mt-4">
                <button
                  className="w-full bg-gray-800 text-white font-medium rounded-lg py-2 hover:bg-gray-700 transition-colors duration-300"
                  onClick={handleCreateOrder}
                >
                  สั่งซื้อ
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
