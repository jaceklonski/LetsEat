"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RestaurantsList() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Brak tokena – użytkownik nie jest zalogowany.");
        }
  
        const res = await fetch("/api/restaurants", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          throw new Error("Fetch Error");
        }
        const data = await res.json();
        setRestaurants(data);
        setFilteredRestaurants(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchRestaurants();
  }, []); 

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredRestaurants(restaurants);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(lowercasedTerm) ||
        restaurant.cuisine.toLowerCase().includes(lowercasedTerm) ||
        restaurant.address.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredRestaurants(filtered);
    }
  }, [searchTerm, restaurants]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Restaurants:</h1>
      <input
        type="text"
        placeholder="Search restaurants..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredRestaurants.map((restaurant) => (
        <div
          key={restaurant.id}
          onClick={() => router.push(`/home/${restaurant.id}`)}
        >
          <div>
            <div><strong>{restaurant.name}</strong></div>
            <div>{restaurant.cuisine}</div>
          </div>
          <div>{restaurant.address}</div>
        </div>
      ))}
    </div>
  );
}
