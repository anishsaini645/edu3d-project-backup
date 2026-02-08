import { useEffect, useState } from "react";
import { Plus, BookOpen, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import CreateAssignment from "./CreateAssignment";
import { Link } from "react-router-dom";

interface Assignment {
  id: number;
  title: string;
  description: string;
  due_date: string;
  model_obj: { title: string };
  teacher: { username: string };
  my_submission?: { status: string };
}

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const role = localStorage.getItem("role");

  const [newAssignments, setNewAssignments] = useState<Assignment[]>([]);
  const [draftAssignments, setDraftAssignments] = useState<Assignment[]>([]);

  const fetchAssignments = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://127.0.0.1:8000/api/assignments/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        let all: Assignment[] = [];
        if (Array.isArray(data)) {
          all = data;
        } else if (data.results && Array.isArray(data.results)) {
          all = data.results;
        } else {
          console.error("Invalid data format", data);
        }
        setAssignments(all);

        // Split for students
        if (role === 'student') {
          setDraftAssignments(all.filter(a => a.my_submission?.status === 'draft'));
          // Show new and submitted in main list? Or just new? 
          // User asked for "Assigments" and "Drafts". 
          // Let's put everything else in "Assignments" for now.
          setNewAssignments(all.filter(a => a.my_submission?.status !== 'draft'));
        } else {
          setNewAssignments(all);
        }
      })
      .catch(err => {
        console.error(err);
        setAssignments([]);
      });
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Assignments</h1>
          <p className="text-muted-foreground">
            {role === 'teacher' ? 'Manage class tasks' : 'Complete your tasks'}
          </p>
        </div>

        {role === 'teacher' && (
          <Button
            onClick={() => setShowCreate(!showCreate)}
            className="bg-primary hover:bg-primary/90"
          >
            {showCreate ? "View All Assignments" : "Create New Assignment"}
          </Button>
        )}
      </div>

      {showCreate ? (
        <CreateAssignment onSuccess={() => {
          setShowCreate(false);
          fetchAssignments();
        }} />
      ) : (
        <div className="space-y-10">
          {/* Drafts Section - Only for students */}
          {role === 'student' && draftAssignments.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-yellow-500" />
                Drafts ({draftAssignments.length})
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {draftAssignments.map((a) => (
                  <AssignmentCard key={a.id} assignment={a} role={role} isDraft={true} />
                ))}
              </div>
            </div>
          )}

          {/* Main Assignments Section */}
          <div>
            {role === 'student' && draftAssignments.length > 0 && (
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Assignments
              </h2>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {newAssignments.length === 0 && draftAssignments.length === 0 ? (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>No assignments found.</p>
                </div>
              ) : (
                newAssignments.map((a) => (
                  <AssignmentCard key={a.id} assignment={a} role={role} />
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for rendering cards
const AssignmentCard = ({ assignment: a, role, isDraft }: { assignment: Assignment, role: string | null, isDraft?: boolean }) => (
  <Card className={`glass border-primary/10 hover:border-primary/30 transition-all ${isDraft ? 'border-yellow-500/30 bg-yellow-500/5' : ''}`}>
    <CardHeader>
      <CardTitle className="truncate" title={a.title}>{a.title}</CardTitle>
      <CardDescription className="flex items-center gap-2">
        <span className="text-primary font-semibold text-xs uppercase px-2 py-0.5 rounded bg-primary/10">
          {a.model_obj?.title || "No Model"}
        </span>
        {isDraft && <span className="text-yellow-500 text-xs border border-yellow-500/30 px-2 py-0.5 rounded">Draft</span>}
        {a.my_submission?.status === 'submitted' && <span className="text-green-500 text-xs border border-green-500/30 px-2 py-0.5 rounded">Submitted</span>}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
        {a.description}
      </p>
      <div className="flex items-center text-xs text-muted-foreground gap-4">
        <div className="flex items-center">
          <Clock className="w-3 h-3 mr-1" />
          Due: {format(new Date(a.due_date), "MMM d, h:mm a")}
        </div>
      </div>
    </CardContent>
    <CardFooter>
      {role === 'student' ? (
        <Link to={`/dashboard/assignments/${a.id}`} className="w-full">
          <Button className={`w-full ${isDraft ? 'bg-yellow-600 hover:bg-yellow-700' : (a.my_submission?.status === 'submitted' ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-primary to-accent')}`}>
            {isDraft ? "Continue Draft" : (a.my_submission?.status === 'submitted' ? "View Submission" : "Start Assignment")}
          </Button>
        </Link>
      ) : (
        <Link to={`/dashboard/assignments/${a.id}/submissions`} className="w-full">
          <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/10">
            View Submissions
          </Button>
        </Link>
      )}
    </CardFooter>
  </Card>
);

export default Assignments;
