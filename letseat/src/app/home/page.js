"use client";

import { useEffect } from "react";
import OrderNotifications from "@/components/OrderNotifications";
import RestaurantsList from "@/components/restaurantlist";
import NavigationClient from "@/components/NavigationClient";

export default function Home() {
  useEffect(() => {
    fetch("/api/socket")
      .then(() => console.log("Socket.io endpoint called"))
      .catch((err) => console.error("Error calling /api/socket", err));
  }, []);

  return (
    <div className="home-container">
      <NavigationClient />
      
      <div className="content">
        <div className="window" style={{ paddingBottom: 30 }}>
          <OrderNotifications />
          <RestaurantsList />
        </div>
      </div>
    </div>
  );
}