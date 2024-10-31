"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/app/components/Navbar";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { QRCode } from "react-qrcode-logo";
import { useRouter } from "next/navigation";
import BackButton from "@/app/components/BackButton";

const InvoiceRecord = ({
  service,
  qty,
  rate,
  lineTotal,
}: {
  service: string;
  qty: number;
  rate: string;
  lineTotal: string;
}) => (
  <div className="flex flex-col md:flex-row justify-between py-4 border-b border-gray-200 text-sm md:text-base">
    <div className="w-full md:w-2/5 text-left">{service}</div>
    <div className="w-full md:w-1/5 text-center md:text-right mt-2 md:mt-0">
      {qty}
    </div>
    <div className="w-full md:w-1/5 text-center md:text-right mt-2 md:mt-0">
      {rate}
    </div>
    <div className="w-full md:w-1/5 text-right mt-2 md:mt-0">{lineTotal}</div>
  </div>
);

interface orderDataInterface {
  orderline_id: number;
  id: number;
  oder_id: number;
  pice: number;
  product_amount: number;
  product_id: number;
  product_img: string;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface productDataInterface {
  product_id: number;
  quantity: number;
}

export default function Invoice() {
  const searchParams = useSearchParams();
  const o_id = searchParams.get("o_id");
  const [orderData, setOrderData] = useState<orderDataInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const date = Date.now();
  const invoiceDate = new Date(date);
  const dueDate = new Date();
  dueDate.setDate(invoiceDate.getDate() + 15);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [productData, setProductData] = useState<productDataInterface[]>([]);
  const [receiptUrl, setReceiptUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (!o_id) return;

      try {
        setLoading(true);
        const orderLineUrl = `http://localhost:8000/orders/${o_id}/orderlines`;
        const orderLineResponse = await axios.get(orderLineUrl);
        setOrderData(orderLineResponse.data);
        const products = (orderLineResponse.data || []).map(
          (order: { product_id: number; quantity: number }) => ({
            product_id: order.product_id,
            quantity: order.quantity,
          })
        );
        setProductData(products.length > 0 ? products : null);

        console.log("orderline Response : ", orderLineResponse.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [o_id]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <header className="fixed w-full z-10">
          <Navbar />
        </header>
        <div className="pt-[6rem] p-4 text-center">Loading invoice data...</div>
      </div>
    );
  }

  if (!o_id) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <header className="fixed w-full z-10">
          <Navbar />
        </header>
        <div className="pt-[6rem] p-4 text-center text-red-600">
          Invalid order ID
        </div>
      </div>
    );
  }

  // Transform orderData to match InvoiceRecord requirements
  const records =
    orderData && orderData.length > 0
      ? orderData.map((order) => ({
          service: order.product_name,
          qty: order.quantity,
          rate: `$${order.product_price.toFixed(2)}`, // Format product price as string
          lineTotal: `$${(order.product_price * order.quantity).toFixed(2)}`, // Calculate line total
        }))
      : null;

  // Calculate subtotal from line totals in records
  const subtotal = records?.reduce(
    (acc: number, record) =>
      acc + parseFloat(record.lineTotal.replace("$", "").replace(",", "")),
    0
  );

  // Retrieve discount from session storage
  const discount = parseFloat(sessionStorage.getItem("discount") || "0");
  const discountedSubtotal = subtotal! - discount;

  const taxRate = 0.1;
  const taxAmount = discountedSubtotal * taxRate;
  const total = discountedSubtotal + taxAmount;

  const handlePayButton = () => {
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      setReceiptUrl(URL.createObjectURL(file));
    }
    console.log("Receipt URL : ", receiptUrl);
  };

  const handleSubmit = async () => {
    if (receipt) {
      const userString = sessionStorage.getItem("user");
      if (userString) {
        const user = JSON.parse(userString);
        const updatedOrder = {
          o_status: "PD",
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

          const buyProductsUrl = `http://localhost:8000/products/buy`;
          const buyProductsResponse = await axios.put(
            buyProductsUrl,
            productData
          );

          setMessage("Order status updated successfully.");

          const transactionUrl = `http://localhost:8000/transaction`;
          const transactionResponse = await axios.post(transactionUrl, {
            t_net_price: total,
            t_image_url: receiptUrl.toString(),
            order_id: Number(o_id), // Convert o_id to integer
          });

          console.log("Transaction Response:", transactionResponse.data);

          sessionStorage.removeItem("discount");
          alert("ชำระเงินสำเร็จ");
          router.push(`orders/${o_id}`);

          setIsModalOpen(false); // Close the modal after submission
        } catch (error) {
          console.error("Error updating order:", error);
          setMessage("Failed to update the order.");
        }
      } else {
        alert("can't find user");
      }
    } else {
      setMessage("Please upload a receipt first.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="fixed w-full z-10">
        <Navbar />
        <BackButton />
      </header>
      <div className="pt-[6rem] p-4 bg-white shadow-md rounded-lg text-gray-800 max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4 md:mb-0">
              INVOICE
            </h1>
            <div className="text-right">
              <p className="text-gray-500">50 Ngamwongwan Rd, Lat Yao,  Chatuchak</p>
              <p className="text-gray-500">Bangkok, TH - 10900</p>
              <p className="text-gray-500">TAX ID 1102004040502</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between text-gray-700">
            {/* Billed To */}
            <div className="mb-4 md:mb-0">
              {/* <h2 className="font-semibold text-lg">Billed to</h2>
              <p className="text-gray-600">Company Name</p>
              <p className="text-gray-600">Company address</p>
              <p className="text-gray-600">City, Country - 00000</p>
              <h2 className="font-semibold text-lg">Tracking Number</h2>
              <p className="text-gray-600">SPX: TH-42190</p> */}
            </div>

            {/* Invoice Details */}
            <div className="space-y-2 text-right">
              <div>
                <h3 className="font-semibold text-sm">Invoice #</h3>
                <p className="text-gray-600">AB2324-01</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Invoice date</h3>
                <p className="text-gray-600">{invoiceDate.toDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Reference</h3>
                <p className="text-gray-600">Order # {o_id}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm">Due date</h3>
                <p className="text-gray-600">{dueDate.toDateString()}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Table Headers */}
        <div className="hidden md:flex justify-between bg-gray-100 py-3 text-sm font-semibold text-gray-600 border-b border-gray-200">
          <div className="w-2/5 text-left">Services</div>
          <div className="w-1/5 text-center">Qty</div>
          <div className="w-1/5 text-right">Rate</div>
          <div className="w-1/5 text-right">Line total</div>
        </div>

        {/* Invoice Records */}

        {records && records.length > 0 ? (
          records.map((record, index) => (
            <InvoiceRecord
              key={index}
              service={record.service}
              qty={record.qty}
              rate={record.rate}
              lineTotal={record.lineTotal}
            />
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No invoice records available.
          </div>
        )}

        {/* Payment Summary */}
        <div className="mt-6 text-right text-gray-700">
          <div className="flex justify-between py-2">
            <div>Subtotal + Discount</div>
            <div className="font-medium">${discountedSubtotal.toFixed(2)}</div>
          </div>

          <div className="flex justify-between py-2">
            <div>Tax (10%)</div>
            <div className="font-medium">${taxAmount.toFixed(2)}</div>
          </div>

          <div className="flex justify-between py-4 border-t border-gray-200 font-bold text-lg">
            <div>Total due</div>
            <div className="text-gray-900">${total.toFixed(2)}</div>
          </div>
        </div>

        <footer className="flex justify-end mt-8">
          <button
            onClick={handlePayButton}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transition duration-200 w-full md:w-auto"
          >
            Pay Now
          </button>
        </footer>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md">
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>

              <div className="mb-4 flex flex-col items-center text-center">
                <QRCode value="https://example.com" size={150} />
                <p className="text-gray-500 text-sm mt-2">
                  แสกน QR Code นี้เพื่อทำการชำระ และ อัพโหลดหลักฐานการชำระเงิน
                </p>
                {/* Total Price */}
                <p className="text-lg font-semibold text-gray-900 mt-4">
                  Total Due: ${total.toFixed(2)}
                </p>
              </div>

              <div className="mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100"
                  title="อัพโหลดหลักฐานการชำระเงิน"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg w-full"
              >
                Submit
              </button>

              {message && (
                <p className="mt-4 text-center text-lg font-semibold">
                  {message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
