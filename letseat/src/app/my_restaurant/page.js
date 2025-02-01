"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";

export default function MyRestaurant() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const fetchRestaurants = async (query = "") => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch(`/api/restaurants${query ? `?search=${encodeURIComponent(query)}` : ""}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Fetch Error");
      }

      const data = await res.json();
      setRestaurants(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);


  if (loading) return <div>Ładowanie Twoich restauracji...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="content">
      <h1>Moja Restauracja</h1>
      {restaurants.length > 0 ? (
        restaurants.map((restaurant) => (
          <div key={restaurant.id} className="restaurant-card">
            <h2>{restaurant.name}</h2>
            <p><strong>Kuchnia:</strong> {restaurant.cuisine}</p>
            <p><strong>Adres:</strong> {restaurant.address || "Brak adresu"}</p>
            <h3>Menu</h3>
            {restaurant.dishes.length > 0 ? (
              <ul>
                {restaurant.dishes.map((dish) => (
                  <li key={dish.id} className="dish-item">
                    <strong>{dish.name}</strong> - ${dish.price.toFixed(2)}
                    {dish.description && <p>{dish.description}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Brak dań w menu.</p>
            )}
            <div className="restaurant-actions">
              <Link href={`/my_restaurant/${restaurant.id}/edit`} className="action-link">Edit Restaurant</Link>
              <Link href={`/my_restaurant/${restaurant.id}/edit-menu`} className="action-link">Edit Menu</Link>
              <Link href={`/my_restaurant/${restaurant.id}/orders`} className="action-link">Orders</Link>
            </div>
          </div>
        ))
      ) : (
        <p>Nie posiadasz żadnych restauracji.</p>
      )}
    </div>
  );
}
