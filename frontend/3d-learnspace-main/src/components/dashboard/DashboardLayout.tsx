import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import TeacherDashboard from "./TeacherDashboard";
import StudentDashboard from "./StudentDashboard";

const DashboardHome = () => {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  if (!role) {
    return <div>Loading...</div>;
  }

  return role === "teacher" ? <TeacherDashboard /> : <StudentDashboard />;
};

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar />
      <main className="flex-1 ml-[280px] p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
export { DashboardHome };
