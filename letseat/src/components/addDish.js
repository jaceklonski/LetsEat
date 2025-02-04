"use client";
import { useState } from "react";

export default function AddDish({ restaurantId, onDishAdded }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const onClick = async () => {
    try {
      const res = await fetch(`/api/restaurants/${restaurantId}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          price: parseFloat(price),
          description,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Add dish failed:", errorData.error || "Unknown error");
        alert(errorData.error || "Nie udało się dodać dania");
        return;
      }

      const data = await res.json();
      console.log("Dish added:", data);
      alert("Dish successfully added");

      setName("");
      setPrice(0);
      setDescription("");
      if (onDishAdded) onDishAdded();
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Błąd podczas dodawania dania");
    }
  };

  return (
    <div className="add-dish">
      <h2>Add Dish</h2>
      <div>
        <label>Name</label>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>Price</label>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Description</label>
        <input
          type="text"
          placeholder="Item description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <button className="button2" onClick={onClick}>Add Dish</button>
      </div>
    </div>
  );
}
