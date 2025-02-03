"use client";
import Navigation from "@/components/Navigation";
import OrderNotifications from "@/components/OrderNotifications";
import RestaurantsList from "@/components/restaurantlist";

export default function Home() {
  return (
    <div className="home-container">
      <Navigation />
      <h1>Home Page</h1>
      <OrderNotifications />
      <RestaurantsList />
    </div>
  );
}