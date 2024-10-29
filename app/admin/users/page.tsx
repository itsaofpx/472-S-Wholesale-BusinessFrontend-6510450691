"use client";

import AdminNavbar from "@/app/components/AdminNavbar";
import BackButton from "@/app/components/BackButton";
import axios from "axios";
import { useEffect, useState } from "react";

interface User {
    id: number;
    f_name: string;
    l_name: string;
    email: string;
    address: string;
    phone_number: string;
}

export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `http://localhost:8000/users`; // Replace with your API endpoint
                const response = await axios.get(url);
                console.log(response.data);
                // Ensure response data is an array before setting it to users state
                if (Array.isArray(response.data)) {
                    setUsers(response.data);
                } else {
                    console.error("Unexpected response format:", response.data);
                    setUsers([]); // Set to an empty array if the response is not an array
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    
    if (loading) {
        return <p>Loading...</p>;
    }
    
    return (
        <div>
            <header>
                <AdminNavbar />
                <BackButton />
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
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="py-2 px-4 border-b">{user.id}</td>
                                    <td className="py-2 px-4 border-b">{user.f_name}</td>
                                    <td className="py-2 px-4 border-b">{user.l_name}</td>
                                    <td className="py-2 px-4 border-b">{user.email}</td>
                                    <td className="py-2 px-4 border-b">{user.address}</td>
                                    <td className="py-2 px-4 border-b">{user.phone_number}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
}
