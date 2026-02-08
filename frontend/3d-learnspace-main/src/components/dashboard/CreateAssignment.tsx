import { useState, useEffect } from "react";
import { Plus, Save, Loader2, Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface Model3D {
    id: number;
    title: string;
}

interface Student {
    id: number;
    username: string;
    email: string;
}

interface CreateAssignmentProps {
    onSuccess: () => void;
}

const CreateAssignment = ({ onSuccess }: CreateAssignmentProps) => {
    const [models, setModels] = useState<Model3D[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    const [selectedModel, setSelectedModel] = useState<string>("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState<string>("23:59");
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

    const [tasks, setTasks] = useState<{ id: number; question: string }[]>([{ id: 1, question: "" }]);
    const [loading, setLoading] = useState(false);
    const [openCombobox, setOpenCombobox] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        fetch("http://127.0.0.1:8000/api/models/", { headers })
            .then((res) => res.json())
            .then((data) => setModels(data));

        fetch("http://127.0.0.1:8000/api/users/students/", { headers })
            .then((res) => res.json())
            .then((data) => setStudents(data));
    }, []);

    const handleAddTask = () => {
        setTasks([...tasks, { id: Date.now(), question: "" }]);
    };

    const handleTaskChange = (id: number, value: string) => {
        setTasks(tasks.map((t) => (t.id === id ? { ...t, question: value } : t)));
    };

    const toggleStudent = (studentId: number) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");
        if (!title || !selectedModel || !date) {
            alert("Please fill all required fields (Title, Model, Due Date)");
            return;
        }

        setLoading(true);

        // Combine date and time
        const [hours, minutes] = time.split(':').map(Number);
        const dueDate = new Date(date);
        dueDate.setHours(hours, minutes);

        const payload = {
            title,
            description,
            model: selectedModel,
            due_date: dueDate.toISOString(),
            tasks: tasks.map(t => t.question).filter(q => q.trim() !== ""),
            assigned_students: selectedStudents,
        };

        try {
            const res = await fetch("http://127.0.0.1:8000/api/assignments/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                alert("Assignment created successfully!");
                onSuccess();
            } else {
                const error = await res.json();
                console.error(error);
                alert("Failed to create assignment");
            }
        } catch (err) {
            console.error(err);
            alert("Error creating assignment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <Card className="glass border-primary/20">
                <CardHeader>
                    <CardTitle className="text-2xl gradient-text">Create New Assignment</CardTitle>
                    <CardDescription>Assign tasks based on 3D models to your students.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Assignment Title</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Chair Ergonomics Analysis"
                            className="bg-background/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Instructions for the students..."
                            className="bg-background/50 min-h-[100px]"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Select 3D Model</Label>
                            <Select value={selectedModel} onValueChange={setSelectedModel}>
                                <SelectTrigger className="bg-background/50">
                                    <SelectValue placeholder="Choose a model..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {models.map((m) => (
                                        <SelectItem key={m.id} value={m.id.toString()}>
                                            {m.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2 flex flex-col">
                            <Label>Due Date</Label>
                            <div className="flex gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full pl-3 text-left font-normal bg-background/50",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-[120px] bg-background/50"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 flex flex-col">
                        <Label>Assign to Students (Optional - leave empty for all)</Label>
                        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openCombobox}
                                    className="w-full justify-between bg-background/50"
                                >
                                    {selectedStudents.length > 0
                                        ? `${selectedStudents.length} student(s) selected`
                                        : "Select students..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[400px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search student..." />
                                    <CommandList>
                                        <CommandEmpty>No student found.</CommandEmpty>
                                        <CommandGroup>
                                            {students.map((student) => (
                                                <CommandItem
                                                    key={student.id}
                                                    value={student.username}
                                                    onSelect={() => toggleStudent(student.id)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedStudents.includes(student.id) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {student.username}
                                                    <span className="ml-2 text-muted-foreground text-xs">({student.email})</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                        {selectedStudents.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {selectedStudents.map(id => {
                                    const s = students.find(st => st.id === id);
                                    return s ? (
                                        <div key={id} className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full flex items-center">
                                            {s.username}
                                            <button onClick={() => toggleStudent(id)} className="ml-1 hover:text-destructive">×</button>
                                        </div>
                                    ) : null;
                                })}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">Tasks / Questions</Label>
                            <Button variant="outline" size="sm" onClick={handleAddTask}>
                                <Plus className="w-4 h-4 mr-2" /> Add Task
                            </Button>
                        </div>

                        {tasks.map((task, index) => (
                            <div key={task.id} className="flex gap-2">
                                <span className="flex items-center justify-center w-8 h-10 bg-muted rounded font-mono text-sm shrink-0">
                                    {index + 1}
                                </span>
                                <Input
                                    value={task.question}
                                    onChange={(e) => handleTaskChange(task.id, e.target.value)}
                                    placeholder={`Task #${index + 1} (e.g. Measure the height...)`}
                                    className="bg-background/50"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-gradient-to-r from-primary to-accent w-full md:w-auto"
                        >
                            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Publish Assignment
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateAssignment;
