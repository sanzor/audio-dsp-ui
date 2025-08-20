import { useAuth } from "@/Auth/UseAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate(); // ✅ must be called here

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [loading, user, navigate]); // ✅ include navigate in dependencies

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}