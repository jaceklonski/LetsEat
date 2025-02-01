import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";



export default function useRequireRole(requiredRole) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
} // source: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library


  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token)

    if (!token) {
      router.push("/login");
      return;
    }

    let decoded;
    try {
      decoded = parseJwt(token)
    } catch (error) {
      console.error("Błąd dekodowania tokenu:", error);
      setAuthorized(false);
      return;
    }

    if (!decoded.role || decoded.role !== requiredRole || decoded.role === "ADMIN") {
      setAuthorized(false);
      return;
    }

    setAuthorized(true);
    setLoading(false);
  }, [requiredRole, router]);

  return { authorized, loading };
}
