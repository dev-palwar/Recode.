import React from "react";
import { Minus, PlusIcon } from "lucide-react";
import { Problem } from "@/types/index";
import { getDifficultyColor } from "@/lib/utils";

interface ProblemsTableProps {
  problems: Problem[];
  onUpdaterevisionCounter: (problem: Problem, type: "plus" | "minus") => void;
}

const ProblemsTable: React.FC<ProblemsTableProps> = ({
  problems,
  onUpdaterevisionCounter,
}) => {
  if (problems.length === 0) {
    return (
      <div className="py-24 text-center">
        <div className="text-muted-foreground mb-2">
          <svg
            className="w-12 h-12 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <p className="text-muted-foreground font-light">
          No problems found matching your criteria
        </p>
      </div>
    );
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-muted/50">
          {["ID", "Problem", "Difficulty", "Acceptance", "Revisions"].map(
            (header) => (
              <th
                key={header}
                className="text-left px-6 py-4 text-xs font-medium text-muted-foreground uppercase tracking-wider"
              >
                {header}
              </th>
            )
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        {problems.map((problem) => (
          <tr
            key={problem.id}
            id={problem.title}
            className="hover:bg-muted/50 transition-colors group"
          >
            <td className="px-6 py-4">
              <span className="text-muted-foreground font-mono text-sm font-light">
                #{problem.id}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-foreground font-light">
                  {problem.title}
                </span>
                {problem.isPaidOnly && (
                  <span className="px-2 py-0.5 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded font-light">
                    Premium
                  </span>
                )}
              </div>
            </td>
            <td className="px-6 py-4">
              <span
                className={`text-sm font-light ${getDifficultyColor(
                  problem.difficulty
                )}`}
              >
                {problem.difficulty}
              </span>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted rounded-full h-1.5 w-24">
                  <div
                    className="bg-foreground/60 h-1.5 rounded-full transition-all"
                    style={{ width: `${problem.acceptanceRate}%` }}
                  ></div>
                </div>
                <span className="text-sm text-muted-foreground font-light w-12 text-right">
                  {problem.acceptanceRate}%
                </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => onUpdaterevisionCounter(problem, "minus")}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  aria-label="Decrease revision count"
                >
                  <Minus className="w-4 h-4 cursor-pointer hover:text-red-400 transition-colors" />
                </button>
                <span className="text-foreground font-medium w-8 text-center">
                  {problem.revisionCount}
                </span>
                <button
                  onClick={() => onUpdaterevisionCounter(problem, "plus")}
                  className="p-1 hover:bg-muted rounded transition-colors"
                  aria-label="Increase revision count"
                >
                  <PlusIcon className="w-4 h-4 cursor-pointer hover:text-green-400 transition-colors" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProblemsTable;
