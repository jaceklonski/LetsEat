"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  const onClick = async () => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: pass,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Log in failed:", errorData.error || "Unknown error");
        return;
      }

      const data = await res.json();
      console.log("login success:", data);
      localStorage.setItem("token", data.token);
      router.push("/home");

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div>
      <div>Log in</div>
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
        <button onClick={onClick}>Log in</button>
      </div>
    </div>
  );
}
