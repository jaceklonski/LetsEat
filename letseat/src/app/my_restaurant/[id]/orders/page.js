"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RestaurantOrders() {
  const { id: restaurantId } = useParams(); // dynamiczny parametr [id]
  const router = useRouter();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /**
   * Pobiera zamówienia z /api/orders, filtrując po restaurantId
   */
  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      // Kluczowa zmiana: używamy endpointu /api/orders?restaurantId=...
      const res = await fetch(`/api/orders?restaurantId=${restaurantId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
  };

  /**
   * Aktualizuje status zamówienia (PUT /api/orders/[orderId])
   */
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update order status");
      }
      const updatedOrder = await res.json();

      // Aktualizujemy stan zamówień – znajdujemy zamówienie i aktualizujemy jego status w liście
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: updatedOrder.status } : order
        )
      );
      alert("Order status updated successfully!");
    } catch (err) {
      alert("Error updating order: " + err.message);
    }
  };

  // Przy pierwszym załadowaniu (i zmianie restaurantId) – pobierz zamówienia
  useEffect(() => {
    if (restaurantId) {
      fetchOrders();
    }
  }, [restaurantId]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className="orders-page">
      <h1>Orders for restaurant: {restaurantId}</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li
              key={order.id}
              style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}
            >
              <div>
                <strong>Order ID:</strong> {order.id}
              </div>
              <div>
                <strong>Status:</strong> {order.status}
              </div>
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
                        {item.dish?.name} - Quantity: {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Dropdown do zmiany statusu */}
              <div>
                <label htmlFor={`status-${order.id}`}>Change status: </label>
                <select
                  id={`status-${order.id}`}
                  defaultValue={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                >
                  <option value="NEW">NEW</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found for this restaurant.</p>
      )}
    </div>
  );
}
