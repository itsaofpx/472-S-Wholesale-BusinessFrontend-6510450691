"use client";

import { useCallback, useEffect, useState } from "react";
import AdminNavbar from "@/app/components/AdminNavbar";
import axios from "axios";

interface tier {
  tier: number;
  discount_percent: number;
}

export default function Tier() {
  const [tiers, setTiers] = useState<tier[]>([]);
  const [newDiscountPercent, setNewDiscountPercent] = useState(0);

  // Fetch tiers from the API
  const fetchTiers = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/tierlist");
      if (response.ok) {
        const data = await response.json();
        setTiers(data);
      } else {
        console.error("Failed to fetch tiers.");
      }
    } catch (error) {
      console.error("Error fetching tiers:", error);
    }
  }, []);

  useEffect(() => {
    fetchTiers();
  }, [fetchTiers]);


  const addTier = async () => {
    if (tiers.length > 0) {
      const newTier = tiers[tiers.length - 1].tier + 1;
      const discountPercent = Number(newDiscountPercent);
      try {
        const response = await axios.post("http://localhost:8000/tierlist", {
          "tier": newTier,
          "discount_percent": discountPercent,
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (response.status === 200) { // Updated condition to check response status
          setNewDiscountPercent(0); // Clear input after adding
          fetchTiers(); // Fetch updated list of tiers
        } else {
          console.error("Failed to add new tier.");
        }
      } catch (error) {
        console.error("Error adding new tier:", error);
      }
    }
  };
  

  return (
    <div className="min-h-screen bg-gray-100">
      <header>
        <AdminNavbar />
      </header>
      <div className="max-w-3xl mx-auto p-6 mt-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Discount Tiers
        </h1>

        {tiers ? (
          <div className="grid grid-cols-1 gap-4 mb-6">
            {tiers.map((tier) => (
              <div
                key={tier.tier}
                className="flex justify-between items-center p-4 border border-gray-300 rounded-lg bg-gray-50"
              >
                <p className="text-lg font-medium text-gray-700">
                  Tier: {tier.tier}
                </p>
                <p className="text-lg font-semibold text-blue-600">
                  Discount: {tier.discount_percent}%
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 mb-6">
            No tiers available. Add a new tier to get started.
          </p>
        )}

        <div className="flex gap-4 mb-4">
          <input
            type="number"
            value={newDiscountPercent}
            onChange={(e) => setNewDiscountPercent(e.target.value)}
            placeholder="Enter discount %"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addTier}
            className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Add New Tier
          </button>
        </div>
      </div>
    </div>
  );
}
