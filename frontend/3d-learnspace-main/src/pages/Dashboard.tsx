import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";

const Dashboard = () => {
  const role = localStorage.getItem("role");

  if (role === "teacher") {
    return <TeacherDashboard />;
  }

  return <StudentDashboard />;
};

export default Dashboard;
