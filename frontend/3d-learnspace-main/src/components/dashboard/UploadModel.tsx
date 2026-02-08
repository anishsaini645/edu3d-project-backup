import { useState, useRef } from "react";
import { Upload, File, X, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const UploadModel = () => {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");

    if (!title || !subject || !file) {
      setStatus({ type: 'error', message: "Please fill in all fields and select a file." });
      return;
    }

    setLoading(true);
    setStatus({ type: null, message: '' });

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/models/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setStatus({ type: 'success', message: "Model uploaded successfully!" });
        // Reset form
        setTitle("");
        setSubject("");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setStatus({ type: 'error', message: "Upload failed. Please try again." });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus({ type: 'error', message: "Something went wrong. check your connection." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="glass border-primary/20 shadow-2xl overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-secondary" />

          <CardHeader>
            <CardTitle className="text-3xl font-bold gradient-text">Upload 3D Model</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Share your 3D assets with students. Supported formats: .glb, .gltf, .obj
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <AnimatePresence>
              {status.type && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <Alert variant={status.type === 'error' ? "destructive" : "default"} className={`${status.type === 'success' ? 'bg-green-500/10 text-green-500 border-green-500/50' : 'bg-destructive/10 text-destructive border-destructive/50'}`}>
                    {status.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <AlertTitle>{status.type === 'success' ? "Success" : "Error"}</AlertTitle>
                    <AlertDescription>{status.message}</AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-base">Model Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Human Heart Anatomy"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-background/50 border-input/50 focus:border-primary/50 transition-all h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-base">Subject / Category</Label>
                  <Input
                    id="subject"
                    placeholder="e.g. Biology, Physics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-background/50 border-input/50 focus:border-primary/50 transition-all h-12"
                  />
                </div>
              </div>

              {/* Drag and Drop Zone */}
              <div className="space-y-2">
                <Label className="text-base">Model File</Label>
                <div
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 h-[200px]
                    ${file
                      ? "border-primary bg-primary/10"
                      : "border-muted-foreground/30 hover:border-primary/70 hover:bg-muted/10"
                    }
                  `}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".glb,.gltf,.obj,.fbx"
                  />

                  <AnimatePresence mode="wait">
                    {file ? (
                      <motion.div
                        key="file-selected"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex flex-col items-center space-y-2 text-primary"
                      >
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                          <File className="w-8 h-8" />
                        </div>
                        <p className="font-semibold text-lg truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="mt-2 hover:bg-destructive/20 hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFile(null);
                            if (fileInputRef.current) fileInputRef.current.value = "";
                          }}
                        >
                          Remove
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="no-file"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center space-y-4 text-muted-foreground"
                      >
                        <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Upload className="w-8 h-8 group-hover:text-primary transition-colors" />
                        </div>
                        <div>
                          <p className="font-medium text-lg">Click to upload or drag & drop</p>
                          <p className="text-sm opacity-70">GLB, GLTF, OBJ (Max 50MB)</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                onClick={handleUpload}
                className="w-full md:w-auto min-w-[150px] h-11 bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/20 hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Upload Model"
                )}
              </Button>
            </div>

          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default UploadModel;
