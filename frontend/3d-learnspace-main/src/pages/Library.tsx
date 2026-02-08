import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/landing/Header';
import { Footer } from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Smartphone,
  Eye,
  Download,
  Share2
} from 'lucide-react';

const subjects = ['All', 'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Engineering', 'Art', 'Geography', 'History'];
const difficulties = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];
const grades = ['All Grades', 'Class 6-8', 'Class 9-10', 'Class 11-12', 'College'];

const models = [
  { id: 1, name: 'Human Heart', subject: 'Biology', grade: 'Class 9-10', difficulty: 'Intermediate', views: 12500, arReady: true, emoji: '❤️' },
  { id: 2, name: 'Water Molecule (H₂O)', subject: 'Chemistry', grade: 'Class 6-8', difficulty: 'Beginner', views: 8900, arReady: true, emoji: '💧' },
  { id: 3, name: 'Solar System', subject: 'Physics', grade: 'Class 6-8', difficulty: 'Beginner', views: 15200, arReady: true, emoji: '🌍' },
  { id: 4, name: 'DNA Double Helix', subject: 'Biology', grade: 'Class 11-12', difficulty: 'Advanced', views: 9800, arReady: true, emoji: '🧬' },
  { id: 5, name: 'Pythagorean Theorem', subject: 'Mathematics', grade: 'Class 9-10', difficulty: 'Intermediate', views: 7600, arReady: false, emoji: '📐' },
  { id: 6, name: 'Internal Combustion Engine', subject: 'Engineering', grade: 'College', difficulty: 'Advanced', views: 11200, arReady: true, emoji: '⚙️' },
  { id: 7, name: 'Taj Mahal Architecture', subject: 'History', grade: 'Class 6-8', difficulty: 'Beginner', views: 14300, arReady: true, emoji: '🕌' },
  { id: 8, name: 'Human Brain', subject: 'Biology', grade: 'Class 11-12', difficulty: 'Advanced', views: 10100, arReady: true, emoji: '🧠' },
  { id: 9, name: 'Periodic Table Elements', subject: 'Chemistry', grade: 'Class 9-10', difficulty: 'Intermediate', views: 8200, arReady: false, emoji: '⚗️' },
  { id: 10, name: 'Electromagnetic Waves', subject: 'Physics', grade: 'Class 11-12', difficulty: 'Intermediate', views: 6700, arReady: true, emoji: '📡' },
  { id: 11, name: 'Human Skeleton', subject: 'Biology', grade: 'Class 9-10', difficulty: 'Intermediate', views: 13400, arReady: true, emoji: '💀' },
  { id: 12, name: 'Volcanic Structure', subject: 'Geography', grade: 'Class 6-8', difficulty: 'Beginner', views: 9500, arReady: true, emoji: '🌋' },
];

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All Levels');
  const [selectedGrade, setSelectedGrade] = useState('All Grades');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredModels = models.filter((model) => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'All' || model.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === 'All Levels' || model.difficulty === selectedDifficulty;
    const matchesGrade = selectedGrade === 'All Grades' || model.grade === selectedGrade;
    return matchesSearch && matchesSubject && matchesDifficulty && matchesGrade;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-display-md font-bold mb-4">
              3D Model <span className="gradient-text">Library</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our collection of interactive 3D models across all subjects. 
              Filter by grade, difficulty, and more.
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6 mb-8"
          >
            {/* Search Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for models..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 border border-border focus:border-primary focus:outline-none transition-colors text-lg"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="space-y-4">
              {/* Subjects */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Subject</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedSubject === subject
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty & Grade */}
              <div className="flex flex-wrap gap-6">
                <div>
                  <span className="text-sm font-medium text-muted-foreground mb-2 block">Difficulty</span>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          selectedDifficulty === difficulty
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground mb-2 block">Grade</span>
                  <div className="flex flex-wrap gap-2">
                    {grades.map((grade) => (
                      <button
                        key={grade}
                        onClick={() => setSelectedGrade(grade)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          selectedGrade === grade
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        {grade}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredModels.length}</span> models
            </p>
          </div>

          {/* Models Grid */}
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredModels.map((model, index) => (
              <motion.div
                key={model.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`model-card ${viewMode === 'list' ? 'flex items-center gap-6 p-4' : 'p-4'}`}
              >
                {/* Thumbnail */}
                <div className={`${viewMode === 'list' ? 'w-24 h-24 shrink-0' : 'aspect-square mb-4'} rounded-xl bg-muted/50 flex items-center justify-center`}>
                  <span className={`${viewMode === 'list' ? 'text-4xl' : 'text-6xl'}`}>{model.emoji}</span>
                </div>

                {/* Content */}
                <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold">{model.name}</h3>
                    {model.arReady && (
                      <span className="ar-badge shrink-0">
                        <Smartphone className="w-3 h-3 inline mr-1" />
                        AR
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="subject-tag">{model.subject}</span>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                      {model.grade}
                    </span>
                    <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                      {model.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="w-4 h-4" />
                      {model.views.toLocaleString()}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Actions for list view */}
                {viewMode === 'list' && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Preview</Button>
                    <Button variant="hero" size="sm">Open</Button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Library;
