import React from "react";
import { Stats } from "@/types/index";

type StatsGridProps = {
  stats: Stats;
};

const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-4 gap-6 mb-12">
      {/* Total Solved */}
      <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 bg-card">
        <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3">
          Total Solved
        </div>
        <div className="text-4xl font-light text-foreground mb-1">
          {stats.totalSolved}
        </div>
        <div className="text-xs text-muted-foreground font-light">
          problems completed
        </div>
      </div>

      {/* Easy */}
      <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 bg-card">
        <div className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-3">
          Easy
        </div>
        <div className="text-4xl font-light text-foreground mb-1">
          {stats.easy}
        </div>
        <div className="text-xs text-muted-foreground font-light">
          foundational mastery
        </div>
      </div>

      {/* Medium */}
      <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 bg-card">
        <div className="text-xs text-amber-600 dark:text-amber-400 uppercase tracking-widest mb-3">
          Medium
        </div>
        <div className="text-4xl font-light text-foreground mb-1">
          {stats.medium}
        </div>
        <div className="text-xs text-muted-foreground font-light">
          intermediate prowess
        </div>
      </div>

      {/* Hard */}
      <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300 bg-card">
        <div className="text-xs text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-3">
          Hard
        </div>
        <div className="text-4xl font-light text-foreground mb-1">
          {stats.hard}
        </div>
        <div className="text-xs text-muted-foreground font-light">
          expert achievements
        </div>
      </div>
    </div>
  );
};

export default StatsGrid;
