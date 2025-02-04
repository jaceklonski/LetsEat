"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }
        
        const res = await fetch("/api/orders", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch orders");
        }
        
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [router]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <div><strong>Order ID:</strong> {order.id}</div>
              <div><strong>Status:</strong> {order.status}</div>
              <div>
                <strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}
              </div>
              {order.updatedAt && (
                <div>
                  <strong>Updated:</strong> {new Date(order.updatedAt).toLocaleString()}
                </div>
              )}
              {order.items && order.items.length > 0 && (
                <div>
                  <strong>Items:</strong>
                  <ul>
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.dish.name} - Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}
