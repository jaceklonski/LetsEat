"use client";
import { useState } from "react";

export default function AddDish() {
  const id = "07e2bafb-be3a-4287-9399-8aba1fff96cd";

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");

  const onClick = async () => {
    try {
      const res = await fetch(`/api/restaurants/${id}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          price: parseFloat(price),
          description: description,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Registration failed:", errorData.error || "Unknown error");
        return;
      }

      const data = await res.json();
      console.log("Dish added:", data);
      alert("Dish successfully added");
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div>
      <div>Add dish to your menu</div>
      <div>
        <div>Name</div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <div>Price</div>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <div>Description</div>
        <input
          type="text"
          placeholder="Item description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <button onClick={onClick}>Add dish</button>
      </div>
    </div>
  );
}
