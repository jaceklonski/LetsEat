"use client";
import { useState } from "react";

export default function AddRestaurant() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cuisine, setCuisine] = useState("");

  const onClick = async () => {
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          address: address,
          cuisine: cuisine,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Registration failed:", errorData.error || "Unknown error");
        return;
      }

      const data = await res.json();
      console.log("Restaurant added:", data);
      alert("Restaurant successfuly added");
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div>
      <div>Add your restaurant</div>
      <div>
        <div>Restaurant name</div>
        <input
          type="text"
          placeholder="Restaurant name"
          value={email}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <div>Restaurant address:</div>
        <input
          type="text"
          placeholder="Restaurant address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div>Add your restaurant</div>
      <div>
        <div>Restaurants cuisine</div>
        <input
          type="text"
          placeholder="Chose restaurants cuisine"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        />
      </div>
      <div>
        <button onClick={onClick}>Add Restaurant</button>
      </div>
    </div>
  );
}
