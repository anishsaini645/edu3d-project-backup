import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, Mail, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Student {
  id: number;
  username: string;
  email: string;
  role: string;
  date_joined: string;
}

const Students = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch("http://127.0.0.1:8000/api/users/students/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // Handle DRF pagination or direct list
        const results = Array.isArray(data) ? data : (data.results || []);
        setStudents(results);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-muted-foreground animate-pulse">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Students</h1>
          <p className="text-muted-foreground">Manage and view your students</p>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="text-center py-12 border rounded-xl bg-muted/20">
          <User className="w-12 h-12 mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">No students found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card
              key={student.id}
              className="glass border-primary/10 hover:border-primary/30 transition-all cursor-pointer hover:shadow-lg group"
              onClick={() => setSelectedStudent(student)}
            >
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {student.username.substring(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <CardTitle className="truncate">{student.username}</CardTitle>
                  <CardDescription className="truncate">{student.email}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full text-xs mt-2 h-8">View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Student Details Popup */}
      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="sm:max-w-md glass border-primary/20">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                Student Details
              </DialogTitle>
              {/* Cross option is typically handled by DialogClose or the X icon in DialogContent default, but we can add explicit if needed */}
            </div>
            <DialogDescription>
              Full profile information
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-center mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-4xl font-bold text-white shadow-xl">
                  {selectedStudent.username.substring(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="space-y-4">
                <div className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Username</label>
                  <div className="flex items-center gap-2 text-lg">
                    <User className="w-4 h-4 opacity-50" />
                    {selectedStudent.username}
                  </div>
                </div>

                <div className="group p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <label className="text-xs text-muted-foreground uppercase font-semibold">Email Address</label>
                  <div className="flex items-center gap-2 text-lg">
                    <Mail className="w-4 h-4 opacity-50" />
                    {selectedStudent.email}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <label className="text-xs text-muted-foreground uppercase font-semibold">Role</label>
                    <div className="capitalize">{selectedStudent.role || 'Student'}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/5">
                    <label className="text-xs text-muted-foreground uppercase font-semibold">Joined</label>
                    <div>{new Date(selectedStudent.date_joined).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setSelectedStudent(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Students;
