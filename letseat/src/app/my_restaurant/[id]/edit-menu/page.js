"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AddDish from "@/components/addDish";

export default function EditMenu() {
  const router = useRouter();
  const { id } = useParams(); 
  const restaurantId = id; 

  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDishes = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      const res = await fetch(
        `/api/restaurants/${restaurantId}/menu`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Fetch Error");
      }
      const data = await res.json();
      setDishes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchDishes();
    }
  }, [restaurantId]);

  if (loading) return <div>Loading menu...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div>
      <h1>Edit Menu</h1>
      <AddDish restaurantId={restaurantId} onDishAdded={fetchDishes} />
      {dishes.length > 0 ? (
        <ul>
          {dishes.map((dish) => (
            <li key={dish.id}>
              <strong>{dish.name}</strong> - ${dish.price.toFixed(2)}
              {dish.description && <p>{dish.description}</p>}
              <Link href={`/my_restaurant/${restaurantId}/edit-dish/${dish.id}`}>
                Edit Dish
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No dishes found.</p>
      )}
    </div>
  );
}
