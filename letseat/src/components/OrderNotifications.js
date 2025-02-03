// components/OrderNotifications.js
"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";

let socket;

export default function OrderNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Inicjalizacja połączenia z Socket.io
    socket = io("http://localhost:3000", {
      path: "/api/socket",
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("testEvent", (data) => {
      console.log("Test event received:", data);
    });

    socket.on("orderStatusChanged", (updatedOrder) => {
      console.log("Received orderStatusChanged event:", updatedOrder);
      setNotifications((prev) => [
        ...prev,
        {
          type: "statusChange",
          orderId: updatedOrder.id,
          status: updatedOrder.status,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socket.on("newOrder", (newOrder) => {
      console.log("Received newOrder event:", newOrder);
      setNotifications((prev) => [
        ...prev,
        {
          type: "newOrder",
          orderId: newOrder.id,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  return (
    <div className="order-notifications">
      <h2>Order Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((notif, index) => (
            <li key={index}>
              {notif.type === "statusChange" && (
                <span>
                  Order <strong>{notif.orderId}</strong> status changed to{" "}
                  <strong>{notif.status}</strong> at{" "}
                  {new Date(notif.timestamp).toLocaleTimeString()}
                </span>
              )}
              {notif.type === "newOrder" && (
                <span>
                  New order received: <strong>{notif.orderId}</strong> at{" "}
                  {new Date(notif.timestamp).toLocaleTimeString()}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications</p>
      )}
    </div>
  );
}