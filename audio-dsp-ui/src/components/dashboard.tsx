import { useAuth } from "@/Auth/UseAuth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "./ui/sidebar"; // Adjust path if needed
import { SidebarProvider } from "./ui/sidebar-provider";
import { SidebarContent } from "./sidebar-content";
import { dummyData } from "@/DummyData";


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
      <SidebarProvider> {/* ✅ Provide context here */}
      <div className="flex">
        <Sidebar>
          <SidebarContent tracks={dummyData}></SidebarContent>
        </Sidebar>
        <main className="flex-1">Main content here</main>
      </div>
    </SidebarProvider>
  );
}