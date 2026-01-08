import { useState, useEffect, useRef } from 'react';
import { Home, ChevronDown, Search, History, User, Zap, LayoutGrid, Calendar, LogOut, CheckCircle } from 'lucide-react';
import { SearchResults } from './SearchResults';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import * as LucideIcons from 'lucide-react';

type Workspace = Database['public']['Tables']['workspaces']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type UserApp = Database['public']['Tables']['user_apps']['Row'] & {
  app: Database['public']['Tables']['available_apps']['Row'];
};

interface TopNavigationProps {
  userId: string;
  currentWorkspace: Workspace | null;
  tasks: Task[];
  onWorkspaceChange: (workspace: Workspace) => void;
  onProfileClick: () => void;
  onHomeClick: () => void;
  onTasksClick: () => void;
  onAppEnrollmentChange: () => void;
  onOpenApp: (app: UserApp) => void;
}

export function TopNavigation({
  userId,
  currentWorkspace,
  tasks,
  onWorkspaceChange,
  onProfileClick,
  onHomeClick,
  onTasksClick,
  onAppEnrollmentChange,
  onOpenApp,
}: TopNavigationProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [availableApps, setAvailableApps] = useState<Database['public']['Tables']['available_apps']['Row'][]>([]);
  const [userAppIds, setUserAppIds] = useState<Set<string>>(new Set());
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showEnrolledMenu, setShowEnrolledMenu] = useState(false);
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [aiInsight, setAiInsight] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [isAddingWorkspace, setIsAddingWorkspace] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');

  useEffect(() => {
    const processSearch = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        setAiInsight(null);
        return;
      }

      // 1. Local Search Algorithm (Simulated Indexing)
      const query = searchQuery.toLowerCase();
      const results: any[] = [];

      // App Matching
      availableApps.forEach(app => {
        if (app.name.toLowerCase().includes(query) || app.category.toLowerCase().includes(query)) {
          results.push({
            type: 'app',
            id: app.id,
            title: app.name,
            subtitle: `Launch ${app.category}`,
            icon: getIconComponent(app.icon),
            action: () => {
              // Construct a temporary UserApp object for previewing
              const tempUserApp: UserApp = {
                id: `temp-${app.id}`,
                user_id: userId,
                app_id: app.id,
                is_active: true,
                display_order: 0,
                workspace_id: null,
                enrolled_at: new Date().toISOString(),
                app: app
              };
              onOpenApp(tempUserApp);
            }
          });
        }
      });

      // Task Matching
      tasks.forEach(task => {
        if (task.title.toLowerCase().includes(query) || (task.description && task.description.toLowerCase().includes(query))) {
          results.push({
            type: 'action',
            id: `task-${task.id}`,
            title: task.title,
            subtitle: `Task • ${task.status}`,
            icon: CheckCircle,
            action: () => console.log('Open task details', task.id) // Placeholder
          });
        }
      });

      // Auth Actions
      if (['sign in', 'sign out', 'log out', 'logout', 'login'].some(term => query.includes(term))) {
        results.push({
          type: 'action',
          id: 'auth-logout',
          title: 'Sign Out',
          subtitle: 'Log out of your account',
          icon: LogOut,
          action: async () => {
            await supabase.auth.signOut();
            window.location.reload();
          }
        });
      }

      // Action Intent Matching (Heuristic)
      if (query.includes('create') || query.includes('new') || (query.includes('task') && !query.includes('manager'))) {
        results.push({
          type: 'action',
          id: 'create-task',
          title: 'Create New Task',
          subtitle: 'Quickly add a task to your list',
          icon: Zap,
          action: () => console.log('Trigger create task modal') // Placeholder
        });
      }

      setSearchResults(results);

      // 2. AI Model Simulation (Contextual Intelligence)
      // This simulates an NLP model analyzing the user's intent and context
      let insight = null;

      if (query.includes('stress') || query.includes('overwhelmed') || query.includes('tired')) {
        insight = {
          type: 'insight',
          text: "I noticed you might be feeling overwhelmed. Based on your work patterns, I recommend taking a 15-minute break or switching to 'Focus Mode' to block distractions.",
          confidence: 0.95
        };
      } else if (query.includes('plan') || query.includes('organize') || query.includes('schedule')) {
        insight = {
          type: 'suggestion',
          text: "I can help you organize your day. You have 3 high-priority tasks pending. Shall we prioritize them based on your deadline history?",
          confidence: 0.88
        };
      } else if (query.includes('how to')) {
        insight = {
          type: 'insight',
          text: `Here is a quick guide on "${searchQuery}". tailored to your preferences: 1. Start with high-impact items. 2. Use the Timer app for deep work.`,
          confidence: 0.85
        };
      }

      setAiInsight(insight);
    };

    const timeoutId = setTimeout(processSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, availableApps]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const workspaceRef = useRef<HTMLDivElement>(null);
  const enrolledRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadWorkspaces();
    loadApps();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (workspaceRef.current && !workspaceRef.current.contains(event.target as Node)) {
        setShowWorkspaceMenu(false);
      }
      if (enrolledRef.current && !enrolledRef.current.contains(event.target as Node)) {
        setShowEnrolledMenu(false);
      }
      if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
        setShowHistoryMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadWorkspaces = async () => {
    const { data } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false });

    if (data) setWorkspaces(data);
  };

  const loadApps = async () => {
    // Load all available apps
    const { data: allApps } = await supabase
      .from('available_apps')
      .select('*')
      .order('name');

    if (allApps) {
      setAvailableApps(allApps);
    }

    // Load user's enrolled apps
    const { data: userApps } = await supabase
      .from('user_apps')
      .select('app_id')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (userApps) {
      setUserAppIds(new Set((userApps as any[]).map(app => app.app_id)));
    }
  };

  const toggleAppEnrollment = async (appId: string, currentStatus: boolean) => {
    // If currently true, we want to set to false. If false (or missing), set to true.
    const newStatus = !currentStatus;

    // Check if record exists first
    const { data } = await supabase
      .from('user_apps')
      .select('id')
      .eq('user_id', userId)
      .eq('app_id', appId)
      .maybeSingle();

    const existingRecord = data as { id: string } | null;

    if (existingRecord) {
      await (supabase
        .from('user_apps') as any)
        .update({ is_active: newStatus })
        .eq('id', existingRecord.id);
    } else {
      await (supabase
        .from('user_apps') as any)
        .insert({
          user_id: userId,
          app_id: appId,
          is_active: newStatus,
          display_order: 999 // Append to end
        });
    }

    // Refresh local state
    loadApps();

    // Notify parent to refresh Dashboard
    onAppEnrollmentChange();
  };

  const handleAddWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;

    if (workspaces.length >= 5) {
      alert('Maximum 5 workspaces allowed');
      return;
    }

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    const color = colors[workspaces.length % colors.length];

    const { data, error } = await (supabase
      .from('workspaces') as any)
      .insert({
        user_id: userId,
        name: newWorkspaceName.trim(),
        color: color,
        is_default: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating workspace:', error);
      return;
    }

    if (data) {
      await loadWorkspaces();
      onWorkspaceChange(data as Workspace);
      setNewWorkspaceName('');
      setIsAddingWorkspace(false);
      setShowWorkspaceMenu(false);
    }
  };

  const handleDeleteWorkspace = async (workspaceId: string, workspaceName: string) => {
    if (workspaces.length <= 1) {
      alert('Cannot delete the last workspace');
      return;
    }

    if (!confirm(`Are you sure you want to delete "${workspaceName}"?`)) {
      return;
    }

    const { error } = await (supabase
      .from('workspaces') as any)
      .delete()
      .eq('id', workspaceId);

    if (error) {
      console.error('Error deleting workspace:', error);
      return;
    }

    // If we deleted the current workspace, switch to the first remaining one
    if (currentWorkspace?.id === workspaceId) {
      const remainingWorkspaces = workspaces.filter(w => w.id !== workspaceId);
      if (remainingWorkspaces.length > 0) {
        onWorkspaceChange(remainingWorkspaces[0]);
      }
    }

    await loadWorkspaces();
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Package;
    return Icon;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">TC</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-800">TriCoders</h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onHomeClick}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="text-sm font-medium">Home</span>
          </button>

          <button
            onClick={onTasksClick}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Add Task</span>
          </button>

          <div ref={workspaceRef} className="relative">
            <button
              onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">
                {currentWorkspace?.name || 'Workspace'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showWorkspaceMenu && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {workspaces.map((workspace) => (
                  <div
                    key={workspace.id}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2 group"
                  >
                    <button
                      onClick={() => {
                        onWorkspaceChange(workspace);
                        setShowWorkspaceMenu(false);
                      }}
                      className="flex-1 flex items-center gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: workspace.color }}
                      />
                      {workspace.name}
                    </button>
                    {workspaces.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWorkspace(workspace.id, workspace.name);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded text-red-600 transition-all"
                        title="Delete workspace"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}

                {!isAddingWorkspace && workspaces.length < 5 && (
                  <button
                    onClick={() => setIsAddingWorkspace(true)}
                    className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-200 font-medium"
                  >
                    + Add Workspace
                  </button>
                )}

                {isAddingWorkspace && (
                  <div className="border-t border-gray-200 p-3 space-y-2">
                    <input
                      type="text"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddWorkspace();
                        if (e.key === 'Escape') {
                          setIsAddingWorkspace(false);
                          setNewWorkspaceName('');
                        }
                      }}
                      placeholder="Workspace name..."
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddWorkspace}
                        className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingWorkspace(false);
                          setNewWorkspaceName('');
                        }}
                        className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {workspaces.length >= 5 && !isAddingWorkspace && (
                  <div className="px-4 py-2 text-xs text-gray-500 border-t border-gray-200 text-center">
                    Maximum 5 workspaces reached
                  </div>
                )}
              </div>
            )}
          </div>

          <div ref={enrolledRef} className="relative">
            <button
              onClick={() => setShowEnrolledMenu(!showEnrolledMenu)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-sm font-medium">Enrolled</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showEnrolledMenu && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden max-h-96 overflow-y-auto">
                {availableApps.map((app) => {
                  const Icon = getIconComponent(app.icon);
                  const isEnrolled = userAppIds.has(app.id);
                  return (
                    <div
                      key={app.id}
                      className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-gray-600" />
                        <span className="text-sm text-gray-700">{app.name}</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={isEnrolled}
                        onChange={() => toggleAppEnrollment(app.id, isEnrolled)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div ref={historyRef} className="relative">
            <button
              onClick={() => setShowHistoryMenu(!showHistoryMenu)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <History className="w-4 h-4" />
              <span className="text-sm font-medium">History</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showHistoryMenu && (
              <div className="absolute top-full mt-2 left-0 w-64 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  Completed tasks will appear here
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={searchContainerRef}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Ask AI or Search Apps..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
          />
          <SearchResults
            query={searchQuery}
            results={searchResults}
            aiInsight={aiInsight}
            isVisible={showResults}
            onSelect={(result) => {
              if (result.action) result.action();
              setShowResults(false);
              setSearchQuery('');
            }}
          />
        </div>

        <button
          onClick={onProfileClick}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white hover:shadow-lg transition-shadow"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </nav>
  );
}
