"use client";

import AdminNavbar from "@/app/components/AdminNavbar";
import BackButton from "@/app/components/BackButton";
import Loading from "@/app/components/Loading";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  f_name: string;
  l_name: string;
  email: string;
  address: string;
  phone_number: string;
  tier_rank: number;
}

interface TierList {
  tier: number;
  discount_percent: number;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [tierlist, setTierlist] = useState<TierList[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleLogout = () => {
    if (sessionStorage.getItem("user")) {
      sessionStorage.removeItem("user");
    }
    router.push("/");
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const urlUsers = `http://localhost:8000/users`; // API endpoint for users
        const urlTierlist = `http://localhost:8000/tierlist`; // API endpoint for tierlist
  
        // Fetch data for users and tierlist in parallel
        const [usersResponse, tierlistResponse] = await Promise.all([
          axios.get(urlUsers),
          axios.get(urlTierlist),
        ]);
  
        console.log("Users Data:", usersResponse.data);
        console.log("Tierlist Data:", tierlistResponse.data);
  
        // Ensure response data for users is an array before setting it to users state
        if (Array.isArray(usersResponse.data)) {
          setUsers(usersResponse.data);
        } else {
          console.error("Unexpected users response format:", usersResponse.data);
          setUsers([]); // Set to an empty array if the response is not an array
        }
  
        // Ensure response data for tierlist is an array before setting it to tierlist state
        if (Array.isArray(tierlistResponse.data)) {
          setTierlist(tierlistResponse.data);
        } else {
          console.error("Unexpected tierlist response format:", tierlistResponse.data);
          setTierlist([]); // Set to an empty array if the response is not an array
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, []);

  const updateUserTier = async (userId: number, newTier: number) => {
    try {
      const response = await axios.put("http://localhost:8000/users/tier", {
        id: userId,
        tier_rank: newTier,
      });
      console.log("Tier updated successfully:", response.data);
      // Optionally, you can update the state here to reflect the change
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, tier_rank: newTier } : user
        )
      );
    } catch (error) {
      console.error("Error updating tier:", error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <header>
        <AdminNavbar />
        <div className="flex flex-row justify-between p-5">
          <BackButton />
          <button
            onClick={handleLogout}
            className="mt-6 px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </header>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Users</h1>

        {loading ? (
          <p>Loading...</p>
        ) : users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">ID</th>
                <th className="py-2 px-4 border-b">First Name</th>
                <th className="py-2 px-4 border-b">Last Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Address</th>
                <th className="py-2 px-4 border-b">Phone Number</th>
                <th className="py-2 px-4 border-b">Tier</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="py-2 px-4 border-b">{user.id}</td>
                  <td className="py-2 px-4 border-b">{user.f_name}</td>
                  <td className="py-2 px-4 border-b">{user.l_name}</td>
                  <td className="py-2 px-4 border-b">{user.email}</td>
                  <td className="py-2 px-4 border-b">{user.address}</td>
                  <td className="py-2 px-4 border-b">{user.phone_number}</td>
                  <td className="py-2 px-4 border-b">
                    <select
                      value={user.tier_rank}
                      onChange={(e) =>
                        updateUserTier(user.id, parseInt(e.target.value))
                      }
                      className="border rounded-md p-2"
                    >
                      {tierlist.map((tier) => (
                        <option key={tier.tier} value={tier.tier}>
                          Tier {tier.tier} - {tier.discount_percent}% Discount
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
