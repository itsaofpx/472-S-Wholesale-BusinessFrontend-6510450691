"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/app/components/AdminNavbar";
import BackButton from "@/app/components/BackButton";

// ...

export default function AddProduct() {
  const [pName, setPName] = useState("");
  const [pDescription, setPDescription] = useState("");
  const [pLocation, setPLocation] = useState("");
  const [pAmount, setPAmount] = useState(0);
  const [pPrice, setPPrice] = useState(0);
  const [images, setImages] = useState(["", "", ""]);
  const [supplierId, setSupplierId] = useState(""); // เก็บ supplier ที่เลือก
  const [suppliers, setSuppliers] = useState([]); // เก็บรายชื่อ supplier ที่โหลดมา
  const [supplierPrice, setSupplierPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/suppliers");
        setSuppliers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };

    fetchSuppliers();
  }, []);

  const handleImageChange = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!pName || !pDescription || !pLocation || !pAmount || !pPrice || !images[0] || !supplierId) {
      if (!pPrice) {
        alert("กรุณากรอก ราคา ให้สมเหตุสมผล")
        setLoading(false);
        return;
      }
      if (!pAmount) {
        alert("กรุณากรอก จำนวน ให้สมเหตุสมผล")
        setLoading(false);
        return;
      }
      alert("กรุณากรอกข้อมูลทุกช่องให้ครบถ้วน");
      setLoading(false);
      return;
    }
    const formData = {
      p_name: pName,
      p_description: pDescription,
      p_location: pLocation,
      p_amount: pAmount,
      p_price: pPrice,
      image_url_1: images[0],
      image_url_2: images[1],
      image_url_3: images[2],
    };

    try {
      console.log(formData);
      const response = await axios.post(
        "http://localhost:8000/product",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // เข้าถึงข้อมูลที่ return มา
      const data = response.data;
      console.log(formData);
      console.log("Data ที่ได้จากการเพิ่มสินค้า:", data);
      postSupplierOrderList(data.id);
      alert("สินค้าเพิ่มสำเร็จแล้ว")
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const postSupplierOrderList = async (product_id: string) => {
    var supplierIdInt = parseInt(supplierId);
    var product_idInt = parseInt(product_id);
    const payload = {
      supplier_id: supplierIdInt,
      price: supplierPrice,
      product_id: product_idInt,
      quantity: pAmount,
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

  return (
    <div>
      <header>
        <AdminNavbar />
        <div className="bg-gray-100">
          <BackButton />
        </div>
      </header>
      <div className="p-10 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-4">เพิ่มสินค้าใหม่</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-gray-700">ผู้จัดจำหน่าย</label>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              required
              className="border border-gray-300 rounded w-full px-4 py-2"
            >
              <option value="">เลือกผู้จัดจำหน่าย</option>
              {Array.isArray(suppliers) && suppliers.length > 0 &&
              suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.name}
                </option>
              ))}
            </select>
          </div>

          {/* ส่วนฟอร์มอื่นๆ จะแสดงก็ต่อเมื่อมีการเลือก supplier แล้วเท่านั้น */}
          {supplierId && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700">
                  ราคาที่ซื้อมาจาก ผู้จัดจำหน่าย
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={supplierPrice}
                  onChange={(e) => setSupplierPrice(Number(e.target.value))}
                  required
                  className="border border-gray-300 rounded w-full px-4 py-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">จำนวน</label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={pAmount}
                  onChange={(e) => setPAmount(Number(e.target.value))}
                  required
                  className="border border-gray-300 rounded w-full px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">ชื่อสินค้า</label>
                <input
                  type="text"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  required
                  className="border border-gray-300 rounded w-full px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">รายละเอียดสินค้า</label>
                <textarea
                  value={pDescription}
                  onChange={(e) => setPDescription(e.target.value)}
                  required
                  className="border border-gray-300 rounded w-full px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">ที่อยู่</label>
                <input
                  type="text"
                  value={pLocation}
                  onChange={(e) => setPLocation(e.target.value)}
                  required
                  className="border border-gray-300 rounded w-full px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">ราคา</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={pPrice}
                  onChange={(e) => setPPrice(Number(e.target.value))}
                  required
                  className="border border-gray-300 rounded w-full px-4 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">
                  ลิงค์รูปภาพ (สูงสุด 3 ลิงค์)
                </label>
                {images.map((image, index) => (
                  <input
                    key={index}
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(index, e.target.value)}
                    placeholder={`ลิงค์รูปภาพ ${index + 1}`}
                    className="border border-gray-300 rounded w-full px-4 py-2 mb-2"
                  />
                ))}
              </div>

              <button
                type="submit"
                className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "กำลังเพิ่ม..." : "เพิ่มสินค้าใหม่"}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
