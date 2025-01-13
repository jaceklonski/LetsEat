"use client";
import RestaurantsList from "@/components/restaurantlist"
import useRequireRole from "@/lib/checkpermit";

export default function Register(){

  const { authorized, loading } = useRequireRole("USER");

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authorized) {
    return null;
  }

  return (
  <div>
    <RestaurantsList/>
  </div>)
}