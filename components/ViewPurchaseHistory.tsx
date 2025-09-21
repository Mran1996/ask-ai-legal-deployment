"use client";

import { useEffect, useState } from "react";

type Purchase = {
  id: string;
  document_name: string;
  price: number;
  created_at: string;
};

export default function ViewPurchaseHistory() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const res = await fetch("/api/purchase-history");
        const data = await res.json();
        setPurchases(data.purchases || []);
      } catch (error) {
        console.error("Failed to load purchase history", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchases();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!purchases.length) return <p>No purchases found.</p>;

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => (
        <div
          key={purchase.id}
          className="border p-4 rounded-md shadow-sm bg-white"
        >
          <div><strong>Document:</strong> {purchase.document_name}</div>
          <div><strong>Price:</strong> ${purchase.price}</div>
          <div><strong>Purchased:</strong> {new Date(purchase.created_at).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
} 