"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditDish() {

  const { id, dish_Id } = useParams();
  const router = useRouter();
  console.log('Params:', { id, dish_Id });

  const [dish, setDish] = useState({
    name: "",
    price: 0,
    description: "",
  });
  const [error, setError] = useState("");


  useEffect(() => {
    if (!id || !dish_Id) return;

    async function fetchDish() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth/login");
          return;
        }

        const res = await fetch(`/api/restaurants/${id}/menu/${dish_Id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Error fetching dish details");
        }

        const data = await res.json();
        setDish(data);
      } catch (err) {
        setError(err.message);
      }
    }

    fetchDish();
  }, [id, dish_Id, router]);

  const handleChange = (e) => {
    setDish((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const res = await fetch(`/api/restaurants/${id}/menu/${dish_Id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dish),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error updating dish");
      }

      alert("Dish updated successfully!");
      router.push(`/my_restaurant/${id}/edit-menu`);
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div className="content">
      <div className="window">
        <h1>Edit Dish</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={dish.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Price:</label>
            <input
              type="number"
              name="price"
              value={dish.price}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Description:</label>
            <input
              type="text"
              name="description"
              value={dish.description}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
