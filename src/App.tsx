import React, { useEffect, useState } from "react";
import { Shuffle, PlusIcon, Minus, ToggleRightIcon } from "lucide-react";
import problemsJson from "./data/problems.json";
import Button from "./components/ui/Button";

const Status = {
  Accepted: "Accepted",
  TLE: "Time Limit Exceeded",
  RuntimeError: "Runtime Error",
  Wrong: "Wrong Answer",
  CompileError: "Compile Error",
} as const;

interface Problem {
  statement: string;
  status: string;
  revisionCount: number;
  href: string;
}

const STORAGE = "problems-data";

export default function LeetCodeTable() {
  const [problems, setProblems] = useState<Problem[]>(problemsJson);
  const [filteredProblems, setFilteredProblems] =
    useState<Problem[]>(problemsJson);
  const [randomCount, setRandomCount] = useState<number>(2);

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE);
    if (savedData) {
      const parsed: Problem[] = JSON.parse(savedData);
      setProblems(parsed);
      setFilteredProblems(parsed);
    }
  }, []);

  const handleCount = (p: Problem, type: "plus" | "minus") => {
    setProblems((prev) => {
      const updated = prev.map((problem) =>
        problem.statement === p.statement
          ? {
              ...problem,
              revisionCount:
                type === "plus"
                  ? (problem.revisionCount || 0) + 1
                  : Math.max((problem.revisionCount || 0) - 1, 0),
            }
          : problem
      );

      const sorted = [...updated].sort(
        (a, b) => a.revisionCount - b.revisionCount
      );

      localStorage.setItem(STORAGE, JSON.stringify(sorted));

      return updated;
    });

    setFilteredProblems((prev) => {
      const updated = prev.map((val) =>
        val.statement === p.statement
          ? {
              ...val,
              revisionCount:
                type === "plus"
                  ? (val.revisionCount || 0) + 1
                  : Math.max((val.revisionCount || 0) - 1, 0),
            }
          : val
      );

      return updated;
    });
  };

  const handleClearProgress = () => {
    localStorage.clear();
    window.location.reload();
  };

  const handleRandomFilter = () => {
    if (problems.length === 0) return;
    const shuffled = [...problems].sort(() => Math.random() - 0.5);
    setFilteredProblems(
      shuffled.slice(0, Math.min(randomCount, problems.length))
    );
  };

  const handleReset = () => {
    const saved = localStorage.getItem(STORAGE);

    if (saved) {
      const parsed = JSON.parse(saved);
      setFilteredProblems(parsed);
    }
  };

  const toggleStatus = (problem: Problem) => {
    setProblems((prev) => {
      const updated = prev.map((p) => {
        if (p.statement !== problem.statement) return p;

        // Toggle logic
        let newStatus;
        switch (p.status) {
          case Status.Accepted:
            newStatus = Status.Wrong;
            break;
          case Status.Wrong:
            newStatus = Status.TLE;
            break;
          case Status.TLE:
            newStatus = Status.Accepted;
            break;
          default:
            newStatus = Status.Accepted;
        }

        return { ...p, status: newStatus };
      });

      localStorage.setItem(STORAGE, JSON.stringify(updated));

      setFilteredProblems((prev) =>
        prev.map((p) => {
          if (p.statement !== problem.statement) return p;

          // Toggle logic
          let newStatus;
          switch (p.status) {
            case Status.Accepted:
              newStatus = Status.Wrong;
              break;
            case Status.Wrong:
              newStatus = Status.TLE;
              break;
            case Status.TLE:
              newStatus = Status.Accepted;
              break;
            default:
              newStatus = Status.Accepted;
          }

          return { ...p, status: newStatus };
        })
      );

      return updated;
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const query = e.target.value.toLowerCase();

    if (!query) {
      setFilteredProblems(problems);
      return;
    }

    const results = problems.filter((problem) =>
      problem.statement.toLowerCase().includes(query)
    );

    setFilteredProblems(results);
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-6xl mx-auto">
        {/* Upload Area */}

        {/* Controls */}
        {problems.length > 0 && (
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
              <Shuffle />
              Random Filter
            </Button>
            <Button onClick={handleReset}>Reset</Button>
            <Button disabledStyle onClick={handleClearProgress}>
              Clear progress
            </Button>

            <div className="ml-auto text-purple-300">
              Showing {filteredProblems.length} of {problems.length} problems
            </div>
          </div>
        )}

        <input
          type="text"
          className="w-full h-[5vh] border-white bg-white outline-none mb-4 rounded-sm pl-4"
          placeholder="search..."
          onChange={(e) => handleSearch(e)}
        />

        {/* Table */}
        {filteredProblems.length > 0 && (
          <div className="bg-slate-800/70 rounded-xl overflow-hidden shadow-2xl max-h-[69vh] overflow-y-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#141c2a]">
                    <th className="text-[18px] px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">
                      Problem Name
                    </th>
                    <th className="text-[18px] px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-[18px] px-6 py-4 text-left text-sm font-semibold text-purple-200 uppercase tracking-wider">
                      Revision Count
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {filteredProblems.map((problem, index) => (
                    <tr
                      key={index}
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
                        <div className="flex gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              problem.status === Status.Accepted
                                ? "bg-green-900/50 text-green-300"
                                : problem.status === Status.TLE
                                ? "bg-red-900/50 text-red-300"
                                : problem.status === Status.Wrong
                                ? "bg-red-600 text-white"
                                : "bg-yellow-900/50 text-yellow-300"
                            }`}
                          >
                            {problem.status}
                          </span>
                          <ToggleRightIcon
                            className="text-white cursor-pointer"
                            onClick={() => toggleStatus(problem)}
                          />
                        </div>
                      </td>
                      <td className="flex gap-3 px-6 py-4 text-white font-medium">
                        <Minus
                          className="cursor-pointer hover:text-red-400"
                          onClick={() => handleCount(problem, "minus")}
                        />
                        {problem.revisionCount}
                        <PlusIcon
                          className="cursor-pointer hover:text-green-400"
                          onClick={() => handleCount(problem, "plus")}
                        />
                      </td>
                      {/* <td className="text-white font-medium">{problem.date}</td>  */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {problems.length === 0 && (
          <div className="text-center text-purple-300 mt-12">
            <p className="text-lg">Upload an Excel file to get started!</p>
            <p className="text-sm mt-2">
              Expected columns: Problem, Status, Revision Count
            </p>
          </div>
        )}
      </div>

      <div className="image-container absolute bottom-0 right-0 p-4 w-[23vh]">
        <img
          className="w-full h-full object-cover"
          src="https://i.pinimg.com/1200x/69/00/50/69005029e7fd9a35f91442fb461d2305.jpg"
          alt=""
        />
      </div>
    </div>
  );
}
