"use client";
import { useParams } from "next/navigation";
import RestaurantDetails from "@/components/details";

export default function Register(){
  const params  = useParams()

  return (
  <div>
    <RestaurantDetails params = {params}/>
  </div>)
}