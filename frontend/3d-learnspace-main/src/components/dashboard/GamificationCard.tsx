import { motion } from 'framer-motion';
import { Trophy, Flame, Target, Star } from 'lucide-react';

interface GamificationCardProps {
  xp: number;
  level: number;
  streak: number;
  badges: number;
}

export function GamificationCard({ xp, level, streak, badges }: GamificationCardProps) {
  const xpToNextLevel = 1000;
  const progress = (xp % xpToNextLevel) / xpToNextLevel * 100;

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Your Progress</h3>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-xp/20 xp-glow">
          <Star className="w-4 h-4 text-xp" />
          <span className="text-sm font-bold text-xp">Level {level}</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">XP Progress</span>
          <span className="text-sm font-medium">{xp % xpToNextLevel} / {xpToNextLevel}</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full progress-bar rounded-full"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 rounded-xl bg-muted/50">
          <Trophy className="w-6 h-6 mx-auto mb-2 text-xp" />
          <div className="text-xl font-bold">{xp.toLocaleString()}</div>
          <div className="text-xs text-muted-foreground">Total XP</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-muted/50">
          <Flame className="w-6 h-6 mx-auto mb-2 text-destructive" />
          <div className="text-xl font-bold">{streak}</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-muted/50">
          <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-xl font-bold">{badges}</div>
          <div className="text-xs text-muted-foreground">Badges</div>
        </div>
      </div>
    </div>
  );
}
