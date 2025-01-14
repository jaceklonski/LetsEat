"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function RegisterForm({role}) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const router = useRouter();

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
      router.push("/login");
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  return (
    <div class="content">
    <div class="window">
      <div id="login">Create account</div>
      <div class="container">
        <div>Email address</div>
        <input
          type="text"
          class="input"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div class="container">
        <div>Password</div>
        <input
          type="password"
          class="input"
          placeholder="Password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
        />
      </div>
      <div class="buttonContainer">
        <button 
        class="button"
        onClick={onClick}>Register</button>
      </div>
    </div>
    </div>
  );
}


// return (
//   <div class="content">
//   <div class="window">
//     <div id="login">Log in</div>
//     <div class="container">
//       <div>Email address</div>
//       <input
//         type="text"
//         class="input"
//         placeholder="Email address"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//     </div>
//     <div class="container">
//       <div>Password</div>
//       <input
//         type="password"
//         class="input"
//         placeholder="Password"
//         value={pass}
//         onChange={(e) => setPass(e.target.value)}
//       />
//     </div>
//     <div class="buttonContainer">
//       <button 
//       class="button"
//       onClick={onClick}>Log in</button>
//     </div>
//   </div>
//   </div>
// );