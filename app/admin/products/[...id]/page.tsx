"use client";

import Loading from "@/app/components/Loading";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AdminNavbar from "@/app/components/AdminNavbar";
import BackButton from "@/app/components/BackButton";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    p_name: "",
    p_description: "",
    p_location: "",
    p_amount: 0,
    p_price: 0,
    image_url_1: "",
    image_url_2: "",
    image_url_3: "",
  });

  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/product/${id}`);
        if (response.data) {
          console.log(response.data);
          setProduct(response.data);
          setFormData({
            p_name: response.data.p_name,
            p_description: response.data.p_description,
            p_location: response.data.p_location,
            p_amount: response.data.p_amount,
            p_price: response.data.p_price,
            image_url_1: response.data.image_url_1,
            image_url_2: response.data.image_url_2,
            image_url_3: response.data.image_url_3,
          });
        } else {
          console.warn("No product data found");
          setProduct(null); // set to null if no product data
        }
      } catch (error) {
        console.error("Error fetching the product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleAddToggle = () => {
    router.push(`/admin/products/addAmount/${id}`);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:8000/products/${id}`, formData);
      setProduct({ ...product, ...formData });
      setIsEditing(false);
      alert("Product details updated successfully.");
    } catch (error) {
      console.error("Error updating the product:", error);
      alert("Failed to update product details.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <p>Product not found or data is unavailable.</p>
      </div>
    );
  }

  return (
    <div>
      <header>
        <AdminNavbar />
        <div className="bg-gray-100"><BackButton /></div>
        
      </header>
      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          รายละเอียดสินค้า
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-lg max-w-3xl mx-auto">
          {/* Image */}
          <div className="flex justify-center mb-6">
            <Image
              src={product.image_url_1}
              width={300}
              height={300}
              alt={product.p_name}
              className="rounded-lg shadow-md"
            />
          </div>

          {/* Product Information */}
          {isEditing ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <label className="whitespace-nowrap">ชื่อสินค้า:</label>
                <input
                  type="text"
                  name="p_name"
                  value={formData.p_name}
                  onChange={handleInputChange}
                  placeholder="Product Name"
                  className="flex-1 p-2 border rounded-lg"
                />
              </div>

              {/* Product Description */}
              <div className="flex items-start space-x-3">
                <label className="whitespace-nowrap">คำอธิบายสินค้า:</label>
                <textarea
                  name="p_description"
                  value={formData.p_description}
                  onChange={handleInputChange}
                  placeholder="Description"
                  className="flex-1 p-2 border rounded-lg"
                />
              </div>

              {/* Storage Location */}
              <div className="flex items-center space-x-3">
                <label className="whitespace-nowrap">ที่เก็บ:</label>
                <input
                  type="text"
                  name="p_location"
                  value={formData.p_location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className="flex-1 p-2 border rounded-lg"
                />
              </div>

              {/* Amount */}
              <div className="flex items-center space-x-3">
                <label className="whitespace-nowrap">คงเหลือ:</label>
                <input
                  type="number"
                  name="p_amount"
                  value={formData.p_amount}
                  readOnly
                  onChange={handleInputChange}
                  placeholder="Amount"
                  className="flex-1 p-2 border rounded-lg"
                />
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3">
                <label className="whitespace-nowrap">ราคา:</label>
                <input
                  type="number"
                  name="p_price"
                  value={formData.p_price}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="flex-1 p-2 border rounded-lg"
                />
              </div>

              <div className="flex flex-row space-x-3 items-start">
                <div>Image 1 URL:</div>
                <textarea
                  name="image_url_1"
                  value={formData.image_url_1}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex flex-row space-x-3 items-start">
                <div>Image 2 URL:</div>
                <textarea
                  name="image_url_2"
                  value={formData.image_url_2}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div className="flex flex-row space-x-3 items-start">
                <div>Image 3 URL:</div>
                <textarea
                  name="image_url_3"
                  value={formData.image_url_3}
                  onChange={handleInputChange}
                  placeholder="Price"
                  className="w-full p-2 border rounded-lg"
                />
              </div>

              <button
                onClick={handleSaveChanges}
                className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="space-y-2 text-gray-700">
              <h2 className="text-2xl font-semibold">{product.p_name}</h2>
              <p>{product.p_description}</p>
              <p className="text-sm text-gray-500 italic">
                ที่เก็บ: {product.p_location}
              </p>
              <div className="flex justify-between mt-4">
                <span>คงเหลือ: {product.p_amount}</span>
                <span className="text-lg font-semibold text-indigo-600">
                  {product.p_price} บาท
                </span>
              </div>
            </div>
          )}

          {/* Edit Button */}
          <button
            onClick={handleEditToggle}
            className={`w-full mt-6 px-4 py-2 rounded-lg text-white ${
              isEditing ? "bg-gray-500" : "bg-indigo-500"
            }  hover:bg-indigo-600 transition-colors duration-300`}
          >
            {isEditing ? "Cancel" : "แก้ไขสินค้า"}
          </button>
          <button
            onClick={handleAddToggle}
            className={`w-full mt-6 px-4 py-2 rounded-lg text-white ${
              isEditing ? "" : "bg-indigo-500"
            } hover:bg-indigo-600 transition-colors duration-300`}
          >
            {isEditing ? "" : "เพิ่มจำนวนสินค้า"}
          </button>
        </div>
      </div>
    </div>
  );
}
