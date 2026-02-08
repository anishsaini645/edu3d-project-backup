import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Send, UploadCloud, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ModelViewer from "@/components/3d/ModelViewer";

interface Task {
    id: number;
    question: string;
}

interface AssignmentDetail {
    id: number;
    title: string;
    description: string;
    model_obj: { file: string; title: string };
    tasks: string[]; // It's stored as JSON list of strings in backend
    teacher: { username: string };
}

const AssignmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
    const [answers, setAnswers] = useState<string[]>([]);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [showExitDialog, setShowExitDialog] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`http://127.0.0.1:8000/api/assignments/${id}/`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => {
                // Ensure tasks is an array of strings
                if (data.tasks) {
                    if (typeof data.tasks === 'string') {
                        data.tasks = [data.tasks];
                    } else if (!Array.isArray(data.tasks)) {
                        // If it's an object like {task: "do checks"}, try to extract values
                        data.tasks = Object.values(data.tasks);
                    }
                } else {
                    data.tasks = [];
                }

                setAssignment(data);

                // Pre-fill answers if draft exists
                if (data.my_submission) {
                    // Assuming content is a list of {question, answer}
                    // But backend simplified it to JSON. Let's parse if string or use as is.
                    let content = data.my_submission.content;
                    if (typeof content === 'string') {
                        try { content = JSON.parse(content); } catch (e) { }
                    }

                    if (Array.isArray(content)) {
                        const loadedAnswers = content.map((c: any) => c.answer || "");
                        setAnswers(loadedAnswers);
                    } else {
                        setAnswers(new Array(data.tasks.length).fill(""));
                    }
                } else {
                    setAnswers(new Array(data.tasks.length).fill(""));
                }

                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id]);

    const handleAnswerChange = (index: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[index] = value;
        setAnswers(newAnswers);
        setHasUnsavedChanges(true); // Mark as dirty
    };

    // Prompt before unload
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [hasUnsavedChanges]);

    // Custom back navigation handler (needs to be hooked into router or manually added to a back button)
    // Since we rely on browser back or sidebar, handling internal React Router navigation blocking is complex in v6 without data routers.
    // For now, let's implement the logic for the "Save as Draft" and "Submit" buttons, and maybe a manual "Back" button in UI.

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setScreenshot(e.target.files[0]);
            setHasUnsavedChanges(true);
        }
    };

    const handleSave = async (status: 'draft' | 'submitted') => {
        if (!assignment) return;
        setSubmitting(true);

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("assignment", assignment.id.toString());

        // Structure content
        const content = assignment.tasks.map((task, index) => ({
            question: task,
            answer: answers[index]
        }));
        formData.append("content", JSON.stringify(content));
        formData.append("status", status); // 'draft' or 'submitted'

        if (screenshot) {
            formData.append("screenshot", screenshot);
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/api/submissions/", {
                method: "POST", // Backend needs to be smart to update if exists, or we use PUT
                // Current backend logic in perform_create handles blocking unless we modify it to "update if exists"
                // My plan changed SubmissionViewSet to raise error if exists.
                // Wait, if I'm saving draft, and draft exists, I need to UPDATE (PUT), not POST.
                // I need to fetch the submission ID if it exists?
                // The assignment object now has `my_submission`.

                // Let's refactor: check assignment.my_submission
            });

            // Actually, let's fix the logic below
        } catch (err) { }
    };

    // Refined Submit Logic
    const saveOrSubmit = async (status: 'draft' | 'submitted') => {
        if (!assignment) return;
        setSubmitting(true);

        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("assignment", assignment.id.toString());

        const content = assignment.tasks.map((task, index) => ({
            question: task,
            answer: answers[index]
        }));
        formData.append("content", JSON.stringify(content));
        formData.append("status", status);

        if (screenshot) {
            formData.append("screenshot", screenshot);
        }

        try {
            let url = "http://127.0.0.1:8000/api/submissions/";
            let method = "POST";

            // Check if we have a submission content from `my_submission` loaded in `assignment`
            // But `assignment.my_submission` is from the GET load.
            // If we previously saved a draft, `assignment.my_submission` should be populated.
            // However, `AssignmentDetail` interface needs `my_submission`.

            if ((assignment as any).my_submission) {
                const subId = (assignment as any).my_submission.id;
                url = `http://127.0.0.1:8000/api/submissions/${subId}/`;
                method = "PATCH"; // Use PATCH for partial updates (file upload etc)
            }

            const res = await fetch(url, {
                method: method,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (res.ok) {
                setHasUnsavedChanges(false);
                if (status === 'submitted') {
                    alert("Assignment submitted successfully!");
                    navigate("/dashboard/assignments");
                } else {
                    alert("Draft saved successfully!");
                    // Optionally refresh data to get new submission ID if it was a POST
                    if (method === "POST") {
                        // reload page or fetch again
                        // easiest is to navigate or reload
                        window.location.reload();
                    }
                }
            } else {
                const error = await res.json();
                console.error(error);
                alert("Failed to save/submit assignment");
            }
        } catch (err) {
            console.error(err);
            alert("Error processing assignment");
        } finally {
            setSubmitting(false);
        }
    };


    if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin w-8 h-8" /></div>;
    if (!assignment) return <div>Assignment not found</div>;

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-2/3 h-full rounded-2xl overflow-hidden glass border-primary/20 shadow-2xl relative flex flex-col">
                <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded text-sm text-white border border-white/10">
                    Model: <span className="font-bold text-primary">{assignment.model_obj.title}</span>
                </div>
                <div className="flex-1 bg-black/40">
                    <ModelViewer url={assignment.model_obj.file} />
                </div>
                <div className="p-4 bg-background/80 backdrop-blur-md border-t border-white/5 text-sm text-muted-foreground">
                    <p>💡 Tip: Rotate the model to find the best angle for measurements.</p>
                </div>
            </div>

            <Card className="w-full md:w-1/3 h-full overflow-y-auto glass border-primary/20 flex flex-col">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl gradient-text">{assignment.title}</CardTitle>
                            <CardDescription>{assignment.description}</CardDescription>
                        </div>
                        {/* Status Badge */}
                        {(assignment as any).my_submission?.status === 'draft' && <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded">Draft</span>}
                        {(assignment as any).my_submission?.status === 'submitted' && <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">Submitted</span>}
                    </div>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                    <div className="space-y-4">
                        <h3 className="font-semibold flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-primary" />
                            Your Tasks
                        </h3>
                        {assignment.tasks.map((task, index) => (
                            <div key={index} className="space-y-2 p-3 rounded-lg bg-muted/50 border border-white/5">
                                <Label className="text-sm font-medium leading-relaxed">
                                    {index + 1}. {task}
                                </Label>
                                <Input
                                    placeholder="Enter your answer/measurement..."
                                    value={answers[index]}
                                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                                    className="bg-background/50 border-primary/10 focus:border-primary/50"
                                    disabled={submitting || (assignment as any).my_submission?.status === 'submitted'}
                                />
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2 pt-4 border-t border-border/50">
                        <Label>Attach Screenshot (Optional)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="bg-background/50 cursor-pointer file:text-primary file:font-semibold"
                                disabled={submitting || (assignment as any).my_submission?.status === 'submitted'}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border/50 bg-background/40 flex gap-2">
                    {/* Draft Button */}
                    <Button
                        variant="outline"
                        onClick={() => saveOrSubmit('draft')}
                        disabled={submitting || (assignment as any).my_submission?.status === 'submitted'}
                        className="flex-1 hover:bg-yellow-500/10 hover:text-yellow-500 hover:border-yellow-500/50"
                    >
                        Save Draft
                    </Button>

                    {/* Submit Button */}
                    <Button
                        onClick={() => saveOrSubmit('submitted')}
                        disabled={submitting || (assignment as any).my_submission?.status === 'submitted'}
                        className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-lg shadow-primary/20"
                    >
                        {submitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                        Submit
                    </Button>
                </CardFooter>
            </Card>

            {/* Unsaved Changes Dialog Check (Manual implementation via navigation interception is hard, so we rely on beforeUnload and manual back button if added) */}
            {/* The user requested a popup when closing the form without saving. 
                "if student opens a assigment and he do nothing in the form and just close the form and do nothing but if students open the form and he adds some value in it and close the form without saving it then make a popup"
                Browsers handle 'close tab' prompts.
                For in-app navigation (clicking sidebar), we need to handle that.
                We can add a custom 'Back' button to the UI that checks this state.
            */}
            <div className="absolute top-4 right-4 md:hidden">
                <Button size="sm" variant="ghost" onClick={() => {
                    if (hasUnsavedChanges) {
                        if (window.confirm("You have unsaved changes. Do you want to save as draft?")) {
                            saveOrSubmit('draft');
                        } else {
                            navigate("/dashboard/assignments");
                        }
                    } else {
                        navigate("/dashboard/assignments");
                    }
                }}>
                    Close
                </Button>
            </div>
        </div>
    );
};

export default AssignmentDetail;
