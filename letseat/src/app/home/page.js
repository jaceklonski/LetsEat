"use client";
import Navigation from "@/components/Navigation";
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
    <Navigation/>
    <RestaurantsList/>
  </div>)
}