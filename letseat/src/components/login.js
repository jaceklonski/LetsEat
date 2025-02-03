"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  // Funkcja do dekodowania tokena JWT
  function parseJwt(token) {
    // Jeśli token jest tablicą, łączymy go w jeden ciąg znaków
    if (Array.isArray(token)) {
      token = token.join('.');
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }
  
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
      console.log("Login success:", data);

      // Pobieramy token i sprawdzamy, czy jest tablicą
      let token = data.token;
      if (Array.isArray(token)) {
        token = token.join('.');
      }
      
      // Zapisujemy token jako pojedynczy ciąg znaków
      localStorage.setItem("token", token);

      // Dekodujemy token, aby uzyskać rolę użytkownika
      const decodedToken = parseJwt(token);
      const userRole = decodedToken.role; 

      // Przekierowujemy w zależności od roli
      if (userRole === "RESTAURANT") {
        router.push("/my_restaurant");
      } else {
        router.push("/home");
      }

    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div className="content">
      <div className="window">
        <div id="login">Log in</div>
        <div className="container">
          <div>Email address</div>
          <input
            type="text"
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
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>
        <div className="buttonContainer">
          <button className="button" onClick={onClick}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
