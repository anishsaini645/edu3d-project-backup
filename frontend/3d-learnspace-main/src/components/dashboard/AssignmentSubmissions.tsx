import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Clock, FileEdit, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format } from "date-fns";

interface Student {
    id: number;
    username: string;
    email: string;
}

interface SubmissionStatus {
    student: Student;
    status: 'submitted' | 'draft' | 'pending';
    submitted_at: string | null;
    submission_id: number | null;
}

interface SubmissionDetail {
    id: number;
    content: Array<{ question: string; answer: string }>;
    screenshot: string | null;
    status: string;
    submitted_at: string;
}

interface Assignment {
    id: number;
    title: string;
    description: string;
    due_date: string;
    model_obj: { title: string };
}

const AssignmentSubmissions = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState<Assignment | null>(null);
    const [submissions, setSubmissions] = useState<SubmissionStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetail | null>(null);
    const [loadingSubmission, setLoadingSubmission] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        // Fetch assignment details
        Promise.all([
            fetch(`http://127.0.0.1:8000/api/assignments/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
            fetch(`http://127.0.0.1:8000/api/assignments/${id}/submissions_status/`, {
                headers: { Authorization: `Bearer ${token}` },
            }),
        ])
            .then(([assignmentRes, submissionsRes]) =>
                Promise.all([assignmentRes.json(), submissionsRes.json()])
            )
            .then(([assignmentData, submissionsData]) => {
                setAssignment(assignmentData);
                setSubmissions(submissionsData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleViewSubmission = async (submissionId: number) => {
        if (!submissionId) return;

        setLoadingSubmission(true);
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/submissions/${submissionId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            // Parse content if it's a string
            if (typeof data.content === 'string') {
                try {
                    data.content = JSON.parse(data.content);
                } catch (e) {
                    console.error("Failed to parse content", e);
                }
            }

            setSelectedSubmission(data);
        } catch (err) {
            console.error("Failed to fetch submission", err);
        } finally {
            setLoadingSubmission(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'submitted':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-500 border border-green-500/30">
                        <CheckCircle className="w-3 h-3" />
                        Submitted
                    </span>
                );
            case 'draft':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-500 border border-yellow-500/30">
                        <FileEdit className="w-3 h-3" />
                        Draft
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                        <Clock className="w-3 h-3" />
                        Pending
                    </span>
                );
        }
    };

    const stats = {
        submitted: submissions.filter(s => s.status === 'submitted').length,
        draft: submissions.filter(s => s.status === 'draft').length,
        pending: submissions.filter(s => s.status === 'pending').length,
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground animate-pulse">Loading submissions...</p>
            </div>
        );
    }

    if (!assignment) {
        return <div>Assignment not found</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/dashboard/assignments")}
                    className="hover:bg-primary/10"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex-1">
                    <h1 className="text-3xl font-bold gradient-text">{assignment.title}</h1>
                    <p className="text-muted-foreground">View student submissions</p>
                </div>
            </div>

            {/* Assignment Info Card */}
            <Card className="glass border-primary/20">
                <CardHeader>
                    <CardTitle className="text-lg">Assignment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Model:</span>
                        <span className="font-semibold text-primary">{assignment.model_obj.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Due:</span>
                        <span>{format(new Date(assignment.due_date), "MMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{assignment.description}</p>
                </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="glass border-green-500/20 bg-green-500/5">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-green-500">Submitted</CardDescription>
                        <CardTitle className="text-3xl text-green-500">{stats.submitted}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="glass border-yellow-500/20 bg-yellow-500/5">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-yellow-500">Draft</CardDescription>
                        <CardTitle className="text-3xl text-yellow-500">{stats.draft}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="glass border-gray-500/20 bg-gray-500/5">
                    <CardHeader className="pb-2">
                        <CardDescription className="text-gray-400">Pending</CardDescription>
                        <CardTitle className="text-3xl text-gray-400">{stats.pending}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Students List */}
            <Card className="glass border-primary/20">
                <CardHeader>
                    <CardTitle>Student Submissions ({submissions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {submissions.length === 0 ? (
                            <p className="text-center py-8 text-muted-foreground">No students found</p>
                        ) : (
                            submissions.map((submission) => (
                                <div
                                    key={submission.student.id}
                                    className={`flex items-center justify-between p-4 rounded-lg border border-white/5 bg-white/5 transition-colors ${submission.submission_id ? 'hover:bg-white/10 cursor-pointer' : 'opacity-60'
                                        }`}
                                    onClick={() => submission.submission_id && handleViewSubmission(submission.submission_id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {submission.student.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{submission.student.username}</div>
                                            <div className="text-xs text-muted-foreground">{submission.student.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {submission.submitted_at && (
                                            <div className="text-xs text-muted-foreground">
                                                {format(new Date(submission.submitted_at), "MMM d, h:mm a")}
                                            </div>
                                        )}
                                        {getStatusBadge(submission.status)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Submission Detail Dialog */}
            <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto glass border-primary/20">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Submission Details</DialogTitle>
                    </DialogHeader>

                    {selectedSubmission && (
                        <div className="space-y-6 py-4">
                            {/* Student Info */}
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">Submitted:</span>
                                <span>{format(new Date(selectedSubmission.submitted_at), "MMM d, yyyy 'at' h:mm a")}</span>
                            </div>

                            {/* Answers */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg">Answers</h3>
                                {Array.isArray(selectedSubmission.content) && selectedSubmission.content.length > 0 ? (
                                    selectedSubmission.content.map((item, index) => (
                                        <div key={index} className="p-4 rounded-lg bg-white/5 border border-white/5 space-y-2">
                                            <div className="text-sm font-medium text-muted-foreground">
                                                Question {index + 1}: {item.question}
                                            </div>
                                            <div className="text-base font-semibold">
                                                {item.answer || <span className="text-muted-foreground italic">No answer provided</span>}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted-foreground">No answers recorded</p>
                                )}
                            </div>

                            {/* Screenshot */}
                            {selectedSubmission.screenshot && (
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg">Screenshot</h3>
                                    <img
                                        src={selectedSubmission.screenshot}
                                        alt="Submission screenshot"
                                        className="w-full rounded-lg border border-white/10"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AssignmentSubmissions;
