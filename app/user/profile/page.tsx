"use client";
import Navbar from "@/app/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";

interface User {
  id: number;
  credential_id: string;
  f_name: string;
  l_name: string;
  phone_number: string;
  email: string;
  tier_rank: number;
  address: string;
}

export default function Profile() {
  const [userID, setUserID] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userString = sessionStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      setUserID(user.id || null);
      if (user.id) fetchUser(user.id);
    }
  }, []);


  const fetchUser = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/users/${id}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleLogout = () => {
    if (sessionStorage.getItem("user")) {
      sessionStorage.removeItem("user");
    }
    router.push("/");
  };

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <div className="flex flex-col items-center mt-10 p-8 bg-white shadow-lg rounded-lg max-w-lg mx-auto">
        <FaUserCircle size={200} className="text-gray-500 mb-6" />
        {user ? (
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-semibold text-gray-800">
              {user.f_name} {user.l_name}
            </h1>
            <p className="text-lg text-gray-600">{user.email}</p>
            <p className="text-gray-600">เบอร์โทรศัพท์: {user.phone_number}</p>
            <p className="text-gray-600">ที่อยู่: {user.address}</p>
            <p className="text-gray-600">ระดับผู้ใช้: {user.tier_rank}</p>
            <button
              onClick={handleLogout}
              className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-600">Loading user details...</p>
            <button
              onClick={handleLogout}
              className="mt-6 px-6 py-2 w-full bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
