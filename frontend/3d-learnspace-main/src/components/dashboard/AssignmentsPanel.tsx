import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const assignments = [
  {
    id: 1,
    title: 'Human Heart Structure',
    subject: 'Biology',
    dueDate: '2 days left',
    progress: 75,
    status: 'in-progress',
  },
  {
    id: 2,
    title: 'Molecular Bonds Quiz',
    subject: 'Chemistry',
    dueDate: '5 days left',
    progress: 0,
    status: 'not-started',
  },
  {
    id: 3,
    title: 'Newton\'s Laws Demo',
    subject: 'Physics',
    dueDate: 'Completed',
    progress: 100,
    status: 'completed',
  },
];

export function AssignmentsPanel() {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Assignments</h3>
        <Button variant="ghost" size="sm">View All</Button>
      </div>

      <div className="space-y-4">
        {assignments.map((assignment, index) => (
          <motion.div
            key={assignment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium">{assignment.title}</h4>
                <span className="subject-tag text-xs">{assignment.subject}</span>
              </div>
              {assignment.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {assignment.dueDate}
                </div>
              )}
            </div>

            {assignment.status !== 'completed' && (
              <>
                <div className="h-2 bg-muted rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${assignment.progress}%` }}
                  />
                </div>
                <Button variant="ghost" size="sm" className="w-full">
                  <Play className="w-4 h-4" />
                  {assignment.progress > 0 ? 'Continue' : 'Start'}
                </Button>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
