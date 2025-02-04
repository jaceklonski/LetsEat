"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function RestaurantDetails() {
  const params = useParams();
  const restaurantId = params.id;
  const router = useRouter();

  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cart, setCart] = useState([]);


  useEffect(() => {
    async function fetchData() {
      try {
        const resRestaurant = await fetch(`/api/restaurants/${restaurantId}`);
        if (!resRestaurant.ok) {
          throw new Error("Błąd podczas pobierania danych restauracji");
        }
        const restaurantData = await resRestaurant.json();
        setRestaurant(restaurantData);

        const resMenu = await fetch(`/api/restaurants/${restaurantId}/menu`);
        if (!resMenu.ok) {
          throw new Error("Błąd podczas pobierania menu");
        }
        const menuData = await resMenu.json();
        setMenu(menuData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (restaurantId) {
      fetchData();
    }
  }, [restaurantId]);

  const handleAddToCart = (dish) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === dish.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { id: dish.id, name: dish.name, price: dish.price, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (dishId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== dishId));
  };

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }
      const orderItems = cart.map((item) => ({
        dishId: item.id,
        quantity: item.quantity,
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId,
          items: orderItems,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Błąd przy składaniu zamówienia");
      }

      const orderData = await res.json();
      alert("Zamówienie złożone pomyślnie!");

      setCart([]);
    } catch (err) {
      console.error("Place Order error:", err);
      alert("Błąd przy składaniu zamówienia: " + err.message);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="content">
      <div className="window">
        <h1>{restaurant ? restaurant.name : "Brak danych"}</h1>
        <p>Address: {restaurant ? restaurant.address : "no data"}</p>
        <p>Cuisine: {restaurant ? restaurant.cuisine : "no data"}</p>
        
        <h2>Menu</h2>
        {menu.length > 0 ? (
          <ul>
            {menu.map((dish) => (
              <li key={dish.id}>
                <div><strong>{dish.name}</strong></div>
                <div>Cena: {dish.price}</div>
                <div>Opis: {dish.description}</div>
                <button onClick={() => handleAddToCart(dish)}>Add to Cart</button>
              </li>
            ))}
          </ul>
        ) : (
          <div>No dishes in menu.</div>
        )}
        <div className="space">
        <h2>Your Cart</h2>
        {cart.length > 0 ? (
          <ul>
            {cart.map((item) => (
              <li key={item.id} className="item" onClick={() => handleRemoveFromCart(item.id)}>
                <div><strong>{item.name}</strong></div>
                <div>Cena: ${item.price.toFixed(2)}</div>
                <div>Ilość: {item.quantity}</div>
              </li>
            ))}
          </ul>
        ) : (
          <div>Your cart is empty.</div>
        )}
        
        <button className="button" onClick={placeOrder} disabled={cart.length === 0}>
          Place Order
        </button>
        </div>
      </div>
    </div>
  );
}
