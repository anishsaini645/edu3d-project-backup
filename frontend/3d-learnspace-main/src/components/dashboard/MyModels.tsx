import { useEffect, useState } from "react";
import { Search, Cuboid, Calendar, Eye, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import ModelViewer from "@/components/3d/ModelViewer";

interface Model3D {
  id: number;
  title: string;
  subject: string;
  file: string;
  created_at?: string; // assuming backend has this, if not we handle it
  uploaded_by?: number;
}

const MyModels = () => {
  const [models, setModels] = useState<Model3D[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedModel, setSelectedModel] = useState<Model3D | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/models/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setModels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch models", err);
        setLoading(false);
      });
  }, []);

  const filteredModels = models.filter(m =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">My 3D Models</h1>
          <p className="text-muted-foreground">Manage and view your uploaded 3D assets</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            className="pl-10 bg-background/50 border-primary/20 focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-xl border-muted/50">
          <Cuboid className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-lg font-medium">No models found</p>
          <p className="text-sm">Upload a new model to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredModels.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass hover-lift border-primary/10 overflow-hidden group">
                  <div className="h-40 bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center relative overflow-hidden">
                    {/* Placeholder visual */}
                    <Cuboid className="w-16 h-16 text-primary/40 group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-50" />
                  </div>

                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg truncate font-semibold" title={model.title}>{model.title}</CardTitle>
                        <CardDescription className="text-xs uppercase tracking-wider font-semibold text-primary">{model.subject}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 mr-1" />
                      Uploaded recently
                      {/* {model.created_at ? format(new Date(model.created_at), 'MMM d, yyyy') : 'Recently'} */}
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-md shadow-primary/10"
                      onClick={() => setSelectedModel(model)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Model
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 3D Viewer Dialog */}
      <Dialog open={!!selectedModel} onOpenChange={(open) => !open && setSelectedModel(null)}>
        <DialogContent className="max-w-5xl h-[80vh] flex flex-col p-0 gap-0 overflow-hidden bg-background/95 backdrop-blur-xl border-primary/20">
          <DialogHeader className="p-6 pb-2 shrink-0">
            <div className="flex items-center justify-between pr-8">
              <div>
                <DialogTitle className="text-2xl gradient-text">{selectedModel?.title}</DialogTitle>
                <DialogDescription className="text-base">{selectedModel?.subject}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 w-full h-full relative bg-black/20">
            {selectedModel && (
              <ModelViewer url={selectedModel.file} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyModels;
