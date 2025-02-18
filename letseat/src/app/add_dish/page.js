"use client"
import AddDish from "@/components/addDish"
import useRequireRole from "@/lib/checkpermit";

export default function Register(){

    const { authorized, loading } = useRequireRole("RESTAURANT");
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (!authorized) {
      return null;
    }

  return (
  <div>
    <AddDish/>
  </div>)
}