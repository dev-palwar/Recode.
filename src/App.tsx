import { useState, useMemo, useEffect } from "react";
import { Shuffle, Plus, Minus, ToggleRightIcon } from "lucide-react";
import problemsData from "./data/problems.json";
import Button from "./components/ui/Button";

const Status = {
  Accepted: "Accepted",
  TLE: "Time Limit Exceeded",
  Wrong: "Wrong Answer",
} as const;

interface Problem {
  statement: string;
  status: string;
  revisionCount: number;
  href: string;
}

const STORAGE = "leeter-progress";

export default function LeetCodeTable() {
  const [problems, setProblems] = useState<Problem[]>(problemsData);
  const [searchQuery, setSearchQuery] = useState("");
  const [randomCount, setRandomCount] = useState(2);
  const [isRandomFilter, setIsRandomFilter] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE);

    if (saved) {
      const parsed = JSON.parse(saved);
      setProblems(parsed);
    }
  }, []);

  const filteredProblems = useMemo(() => {
    if (isRandomFilter) {
      const shuffled = [...problems].sort(() => Math.random() - 0.5);
      return shuffled.slice(0, Math.min(randomCount, problems.length));
    }

    if (!searchQuery) return problems;

    return problems.filter((problem) =>
      problem.statement.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [problems, searchQuery, isRandomFilter, randomCount]);

  const updateProblem = (statement: string, updates: Partial<Problem>) => {
    setProblems((prev) => {
      const updated = prev.map((p) =>
        p.statement === statement ? { ...p, ...updates } : p
      );

      updated.sort((a, b) => a.revisionCount - b.revisionCount);

      localStorage.setItem(STORAGE, JSON.stringify(updated));

      // Scroll after re-render
      setTimeout(() => {
        const el = document.getElementById(statement);
        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          el.style.border = "2px solid purple";
          el.style.borderRadius = "20px";
          el.style.transition = "0.3s all";

          setTimeout(() => {
            el.style.border = "";
            el.style.transition = "0.3s all";
          }, 1000);
        }
      }, 0);

      return updated;
    });
  };

  const handleCount = (problem: Problem, type: "plus" | "minus") => {
    const newCount =
      type === "plus"
        ? problem.revisionCount + 1
        : Math.max(problem.revisionCount - 1, 0);

    updateProblem(problem.statement, { revisionCount: newCount });
  };

  const toggleStatus = (problem: Problem) => {
    const statusCycle: Record<
      (typeof Status)[keyof typeof Status],
      (typeof Status)[keyof typeof Status]
    > = {
      [Status.Accepted]: Status.Wrong,
      [Status.Wrong]: Status.TLE,
      [Status.TLE]: Status.Accepted,
    };

    const newStatus =
      statusCycle[problem.status as (typeof Status)[keyof typeof Status]] ||
      Status.Accepted;
    updateProblem(problem.statement, { status: newStatus });
  };

  const handleClearProgress = () => {
    setProblems((prev) =>
      prev.map((p) => ({ ...p, revisionCount: 0, status: Status.Wrong }))
    );

    localStorage.clear();
    setSearchQuery("");
    setIsRandomFilter(false);
  };

  const handleRandomFilter = () => {
    setIsRandomFilter(true);
    setSearchQuery("");
  };

  const handleReset = () => {
    setIsRandomFilter(false);
    setSearchQuery("");
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setIsRandomFilter(false);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Controls */}
        <div className="bg-slate-800/70 rounded-xl p-6 mb-6 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <label className="text-white font-medium">Random Count:</label>
            <select
              value={randomCount}
              onChange={(e) => setRandomCount(Number(e.target.value))}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
            </select>
          </div>

          <Button onClick={handleRandomFilter}>
            <div className="flex items-center gap-2">
              <Shuffle size={18} />
              <span>Random Filter</span>
            </div>
          </Button>
          <Button onClick={handleReset}>Reset</Button>
          <Button disabledStyle onClick={handleClearProgress}>
            Clear Progress
          </Button>

          <div className="ml-auto text-purple-300">
            Showing {filteredProblems.length} of {problems.length} problems
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          className="w-full h-12 border-white bg-white outline-none mb-4 rounded-sm pl-4"
          placeholder="Search problems..."
          onChange={(e) => handleSearch(e.target.value)}
        />

        {/* Table */}
        <div className="bg-slate-800/70 rounded-xl overflow-hidden shadow-2xl max-h-[69vh] overflow-y-auto">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-[#141c2a] z-10">
                <tr>
                  <th className="text-lg px-6 py-4 text-left font-semibold text-purple-200 uppercase tracking-wider">
                    Problem Name
                  </th>
                  <th className="text-lg px-6 py-4 text-left font-semibold text-purple-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-lg px-6 py-4 text-left font-semibold text-purple-200 uppercase tracking-wider">
                    Revision Count
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredProblems.map((problem) => (
                  <tr
                    id={problem.statement}
                    key={`${problem.statement}`}
                    className="hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <a
                        href={problem.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white cursor-pointer hover:text-purple-300 hover:underline font-medium transition-colors"
                      >
                        {problem.statement}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            problem.status === Status.Accepted
                              ? "bg-green-900/50 text-green-300"
                              : problem.status === Status.TLE
                              ? "bg-red-900/50 text-red-300"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {problem.status}
                        </span>
                        <ToggleRightIcon
                          className="text-white cursor-pointer hover:text-purple-400 transition-colors"
                          size={24}
                          onClick={() => toggleStatus(problem)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-white font-medium">
                        <Minus
                          className="cursor-pointer hover:text-red-400 transition-colors"
                          size={20}
                          onClick={() => handleCount(problem, "minus")}
                        />
                        <span className="min-w-[2ch] text-center">
                          {problem.revisionCount}
                        </span>
                        <Plus
                          className="cursor-pointer hover:text-green-400 transition-colors"
                          size={20}
                          onClick={() => handleCount(problem, "plus")}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center text-purple-300 mt-12">
            <p className="text-lg">No problems found matching your search.</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-4 right-4 w-32">
        <img
          className="w-full h-full object-cover shadow-lg"
          src="https://i.pinimg.com/1200x/69/00/50/69005029e7fd9a35f91442fb461d2305.jpg"
          alt="Decoration"
        />
      </div>
    </div>
  );
}
