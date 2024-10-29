"use client";
import AdminNavbar from "@/app/components/AdminNavbar";
import Loading from "@/app/components/Loading";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: number;
  p_description: string;
  p_name: string;
  p_location: string;
  p_amount: number;
  p_price: number;
  image_url_1: string;
  image_url_2: string;
  image_url_3: string;
}

export default function AddAmount() {
  const { id } = useParams();

  const [supplierId, setSupplierId] = useState(""); // เก็บ supplier ที่เลือก
  const [suppliers, setSuppliers] = useState([]); // เก็บรายชื่อ supplier ที่โหลดมา
  const [amount, setAmount] = useState(0); // เก็บจำนวนสินค้า
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/product/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/suppliers");
        setSuppliers(response.data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleAddAmount = async () => {
    if (!product) {
      alert("ไม่พบสินค้า");
      return;
    }
    if (!supplierId || amount <= 0 || !price) {
      alert("บันทึกข้อมูลไม่สำเร็จ");
      router.push(`/admin/products/${product.id}`);
      return;
    }
    const updatedProduct = {
      ...product,
      p_amount: product.p_amount + Number(amount),
    };
    setProduct(updatedProduct);
    console.log(product);
    try {
      await axios.put(
        `http://localhost:8000/products/${id}`,
        {
          ...updatedProduct,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      postSupplierOrderList();
      alert("เพิ่มจำนวนสินค้าสําเร็จ");
      router.push(`/admin/products/${product.id}`);
    } catch (err) {
      console.error("Error adding amount:", err);
    }
  };

  const postSupplierOrderList = async () => {
    if (!product?.id) {
      return;
    }
    var supplierIdInt = parseInt(supplierId);
    const payload = {
      supplier_id: supplierIdInt,
      price: Number(price),
      product_id: product?.id,
      quantity: Number(amount),
    };

    console.log("Payload being sent:", payload); // Log the payload for debugging

    try {
      const response = await axios.post(
        `http://localhost:8000/supplierOrderLists`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Success:", response.data);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message);
      setError("เกิดข้อผิดพลาดในการเพิ่มรายการสั่งซื้อจากซัพพลายเออร์");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  console.log(product);

  return (
    <div>
      <header>
        <AdminNavbar />
      </header>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            เพิ่มจำนวนสินค้า
          </h2>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">ผู้จัดจำหน่าย</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
              className="border border-gray-300 rounded w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">เลือกผู้จัดจำหน่าย</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-row justify-between mb-6">
            <div className="w-1/2 mr-2">
              <label className="block text-gray-700 mb-2">จำนวน</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="กรอกจำนวน"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="w-1/2 ml-2">
              <label className="block text-gray-700 mb-2">ราคา</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="กรอกราคา"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <button
            onClick={handleAddAmount}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors duration-200"
          >
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
}
