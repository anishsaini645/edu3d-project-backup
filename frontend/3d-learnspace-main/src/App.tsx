import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/register";

import ProtectedRoute from "@/routes/ProtectedRoute";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

// Teacher dashboard components
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import UploadModel from "@/components/dashboard/UploadModel";
import MyModels from "@/components/dashboard/MyModels";
import Assignments from "@/components/dashboard/Assignments";
import AssignmentDetail from "@/components/dashboard/AssignmentDetail";
import AssignmentSubmissions from "@/components/dashboard/AssignmentSubmissions";
import Students from "@/components/dashboard/Students";
import Settings from "@/components/dashboard/Settings";
import { DashboardHome } from "@/components/dashboard/DashboardLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default dashboard */}
          <Route index element={<DashboardHome />} />

          {/* Teacher routes */}
          <Route path="upload" element={<UploadModel />} />
          <Route path="models" element={<MyModels />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="assignments/:id" element={<AssignmentDetail />} />
          <Route path="assignments/:id/submissions" element={<AssignmentSubmissions />} />
          <Route path="students" element={<Students />} />
        </Route>

        {/* Settings route (outside dashboard layout to avoid nested sidebar) */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <div className="min-h-screen flex bg-background">
                <DashboardSidebar />
                <main className="flex-1 ml-[280px] p-8">
                  <Settings />
                </main>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
