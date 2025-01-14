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
    <div class="content">
    <div class="window">
      <div id="login">Add your restaurant</div>
      <div class="container">
        <div>Restaurant name</div>
        <input
          class="input"
          type="text"
          placeholder="Restaurant name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div class="container">
        <div>Restaurant address</div>
        <input
          type="text"
          class="input"
          placeholder="Restaurant address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div class="container">
        <div>Restaurants cuisine</div>
        <input
          type="text"
          class="input"
          placeholder="Choose cuisine"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        />
      </div>
      <div class="buttonContainer">
        <button
        class="button"
        onClick={onClick}>Add Restaurant</button>
      </div>
    </div>
    </div>
  );
}
