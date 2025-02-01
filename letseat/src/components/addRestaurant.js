"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddRestaurant() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [error, setError] = useState("");

  const onClick = async () => {
    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          address,
          cuisine,
          email,
          password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Adding restaurant failed:", errorData.error || "Unknown error");
        setError(errorData.error || "Unknown error");
        return;
      }

      const data = await res.json();
      console.log("Restaurant added:", data);
      alert("Restaurant successfully added");
      router.push("/login");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="content">
      <div className="window">
        <div id="login">Add Your Restaurant</div>
        <div className="container">
          <div>Restaurant Name</div>
          <input
            className="input"
            type="text"
            placeholder="Restaurant name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="container">
          <div>Restaurant Address</div>
          <input
            type="text"
            className="input"
            placeholder="Restaurant address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="container">
          <div>Restaurant Cuisine</div>
          <input
            type="text"
            className="input"
            placeholder="Choose cuisine"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </div>
        <div className="container">
          <div>Email Address</div>
          <input
            type="email"
            className="input"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="container">
          <div>Password</div>
          <input
            type="password"
            className="input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <div className="error">{error}</div>}
        <div className="buttonContainer">
          <button className="button" onClick={onClick}>Add Restaurant</button>
        </div>
      </div>
    </div>
  );
}
