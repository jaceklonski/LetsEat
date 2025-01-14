"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RestaurantsList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch("/api/restaurants");
        if (!res.ok) {
          throw new Error("Fetch Error");
        }
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div class="content">
      <h1>Restaurants:</h1>
      {restaurants.map((restaurant) => (
        <div
          class="restaurant"
          key={restaurant.id}
          onClick={() => router.push(`/home/${restaurant.id}`)}>
          <div class="top">
            <div><strong>{restaurant.name}</strong></div>
            <div>{restaurant.cuisine}</div>
          </div>
          <div>{restaurant.address}</div>
        </div>
      ))}
    </div>
  );
}
