"use client";
import { useState, useEffect } from "react";

export default function RestaurantsList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch("/api/restaurants");
        if (!res.ok) {
          throw new Error("Błąd podczas pobierania restauracji");
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

  if (loading) return <div>Ładowanie restauracji...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Lista Restauracji</h1>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            {restaurant.name} - {restaurant.cuisine}
          </li>
        ))}
      </ul>
    </div>
  );
}
