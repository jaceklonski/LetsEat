"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditRestaurant({ params }) {
  // Odpakowujemy obiekt params przed dostępem do jego właściwości
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const router = useRouter();

  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    cuisine: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const res = await fetch(`/api/restaurants/${id}`);
        if (!res.ok) {
          throw new Error("Błąd podczas pobierania danych restauracji.");
        }
        const data = await res.json();
        setRestaurant(data);
      } catch (err) {
        setError(err.message);
      }
    }
    
    if (id) {
      fetchRestaurant();
    }
  }, [id]);

  const handleChange = (e) => {
    setRestaurant({ ...restaurant, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/restaurants/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restaurant),
      });

      if (!res.ok) {
        throw new Error("Błąd podczas aktualizacji restauracji.");
      }

      alert("Dane restauracji zostały zaktualizowane.");
      router.push("/my_restaurant");

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="content">
      <div className="window">
        <h1>Edytuj restaurację</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nazwa</label>
            <input
              type="text"
              name="name"
              value={restaurant.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Adres</label>
            <input
              type="text"
              name="address"
              value={restaurant.address}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Kuchnia</label>
            <input
              type="text"
              name="cuisine"
              value={restaurant.cuisine}
              onChange={handleChange}
            />
          </div>
          <button className="button" type="submit">Zapisz zmiany</button>
        </form>
      </div>
    </div>
  );
}
