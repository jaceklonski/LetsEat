"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
} // source: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library



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

      localStorage.setItem("token", data.token);

      const decodedToken = parseJwt(data.token);
      const userRole = decodedToken.role; 

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
          <button 
            className="button"
            onClick={onClick}>
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
