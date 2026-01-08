import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Calendar, AlertCircle } from 'lucide-react';
import { Database } from '../lib/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];

interface TodoSidebarProps {
  tasks: Task[];
  sortBy: 'priority' | 'deadline' | 'complexity';
  onSortChange: (sort: 'priority' | 'deadline' | 'complexity') => void;
}

export function TodoSidebar({ tasks: allTasks, sortBy, onSortChange }: TodoSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Task[]>([]);

  useEffect(() => {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const sorted = [...allTasks].sort((a, b) => {
      if (sortBy === 'priority') {
        const pA = priorityOrder[a.urgency_level as keyof typeof priorityOrder] ?? 99;
        const pB = priorityOrder[b.urgency_level as keyof typeof priorityOrder] ?? 99;
        if (pA !== pB) return pA - pB;
      } else if (sortBy === 'complexity') {
        const cA = a.priority_score ?? 0;
        const cB = b.priority_score ?? 0;
        if (cA !== cB) return cB - cA;
      }

      const dA = a.deadline ? new Date(a.deadline).getTime() : Infinity;
      const dB = b.deadline ? new Date(b.deadline).getTime() : Infinity;
      return dA - dB;
    });

    const tasksWithDeadline = sorted.filter(t => t.deadline);
    const tasksWithoutDeadline = sorted.filter(t => !t.deadline);

    setUpcomingEvents(tasksWithDeadline.slice(0, 5));
    setTasks(tasksWithoutDeadline.slice(0, 10));
  }, [allTasks, sortBy]);

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      default:
        return 'bg-green-100 text-green-700 border-green-300';
    }
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'No deadline';
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed left-0 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-r-lg shadow-lg hover:bg-blue-700 transition-all duration-300 z-40 ${isOpen ? 'translate-x-80' : 'translate-x-0'
          }`}
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
      </button>

      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-2xl transition-transform duration-300 z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } w-80 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TC</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">TriCoders</h2>
          </div>
          <div className="flex items-center justify-between mt-4">
            <h3 className="text-lg font-medium text-gray-700">To-Do List</h3>
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 outline-none cursor-pointer"
            >
              <option value="priority">AI Priority</option>
              <option value="deadline">Time (ASAP)</option>
              <option value="complexity">Complexity</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {upcomingEvents.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-semibold text-gray-700">Upcoming Events</h4>
              </div>
              <div className="space-y-2">
                {upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    <p className="text-sm font-medium text-gray-800 line-clamp-2">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">{formatDeadline(event.deadline)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-orange-600" />
              <h4 className="text-sm font-semibold text-gray-700">Priority Tasks</h4>
            </div>
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No pending tasks</p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 border rounded-lg ${getUrgencyColor(task.urgency_level)}`}
                  >
                    <p className="text-sm font-medium line-clamp-2">{task.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs">Priority: {task.priority_score}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white rounded-full overflow-hidden">
                          <div
                            className="h-full bg-current"
                            style={{ width: `${task.completion_percentage}%` }}
                          />
                        </div>
                        <span className="text-xs">{task.completion_percentage}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
