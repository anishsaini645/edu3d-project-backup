import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle, Clock, TrendingUp, Award, Users, Settings } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import TeacherProfileSettings from "./TeacherProfileSettings";

interface TopStudent {
  student: string;
  submitted: number;
  pending: number;
}

interface DashboardStats {
  role: string;
  today_tasks: number;
  pending_count: number;
  submitted_count: number;
  weekly_data: Array<{ date: string; day: string; count: number }>;
  top_students: TopStudent[];
  recent_assignments: Array<{
    id: number;
    title: string;
    description: string;
    due_date: string;
    created_at: string;
  }>;
}

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/api/dashboard/stats/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch dashboard stats", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return <div>Failed to load dashboard</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Manage your assignments and track student progress</p>
        </div>
        <Button
          onClick={() => setSettingsOpen(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass border-blue-500/20 bg-blue-500/5">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-blue-500">
              <Calendar className="w-4 h-4" />
              Today's Tasks
            </CardDescription>
            <CardTitle className="text-3xl text-blue-500">{stats.today_tasks}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass border-orange-500/20 bg-orange-500/5">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-orange-500">
              <Clock className="w-4 h-4" />
              Pending
            </CardDescription>
            <CardTitle className="text-3xl text-orange-500">{stats.pending_count}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="glass border-green-500/20 bg-green-500/5">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2 text-green-500">
              <CheckCircle className="w-4 h-4" />
              Submitted
            </CardDescription>
            <CardTitle className="text-3xl text-green-500">{stats.submitted_count}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Weekly Chart */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Tasks Created (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.weekly_data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Students */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Top 3 Student Performance
            </CardTitle>
            <CardDescription>Students with most submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.top_students.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground">No student data yet</p>
              ) : (
                stats.top_students.map((student, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-white/5 bg-white/5"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-500' :
                        index === 1 ? 'bg-gray-400/20 text-gray-400' :
                          'bg-orange-500/20 text-orange-500'
                        }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          {student.student}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.submitted} submitted, {student.pending} pending
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-500">{student.submitted}</div>
                      <div className="text-xs text-muted-foreground">completed</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Assignments */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle>Recent Assignments</CardTitle>
          <CardDescription>Your latest 5 assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recent_assignments.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No assignments created yet</p>
            ) : (
              stats.recent_assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-4 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => navigate(`/dashboard/assignments/${assignment.id}/submissions`)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{assignment.description}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Due: {format(new Date(assignment.due_date), "MMM d")}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Settings Modal */}
      <TeacherProfileSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </div>
  );
};

export default TeacherDashboard;
