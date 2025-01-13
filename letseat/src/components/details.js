"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function RestaurantDetails() {
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params  = useParams()

  useEffect(() => {
    async function fetchData() {
      try {
        const resRestaurant = await fetch(`/api/restaurants/${params.id}`);
        if (!resRestaurant.ok) {
          throw new Error("Błąd podczas pobierania danych restauracji");
        }
        const restaurantData = await resRestaurant.json();
        setRestaurant(restaurantData);

        const resMenu = await fetch(`/api/restaurants/${params.id}/menu`);
        if (!resMenu.ok) {
          throw new Error("Błąd podczas pobierania menu");
        }
        const menuData = await resMenu.json();
        setMenu(menuData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{restaurant ? restaurant.name : "Name"}</h1>
      <p>address: {restaurant ? restaurant.address : "no data"}</p>
      <p>cuisine: {restaurant ? restaurant.cuisine : "no data"}</p>
      <h2>Menu</h2>
      {menu.length > 0 ? (
        <ul>
          {menu.map((dish) => (
            <li key={dish.id}>
              <div><strong>{dish.name}</strong></div>
              <div>Cena: {dish.price}</div>
              <div>Opis: {dish.description}</div>
            </li>
          ))}
        </ul>
      ) : (
        <div>No dishes in menu.</div>
      )}
    </div>
  );
}
