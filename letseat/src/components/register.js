"use client";
import { useState } from "react";

export default function RegisterForm({role}) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const onClick = async () => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: pass,
          role: role,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Registration failed:", errorData.error || "Unknown error");
        return;
      }

      const data = await res.json();
      console.log("Registration success:", data);
      alert("Konto zostało utworzone!");
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div>
      <div>Create account</div>
      <div>
        <div>Email address</div>
        <input
          type="text"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <div>Password</div>
        <input
          type="password"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
      </div>
      <div>
        <button onClick={onClick}>Register</button>
      </div>
    </div>
  );
}
