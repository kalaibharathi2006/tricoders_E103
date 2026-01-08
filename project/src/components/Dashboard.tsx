import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { TodoSidebar } from './TodoSidebar';
import { TopNavigation } from './TopNavigation';
import { AppPanel } from './AppPanel';
import { AppWindow } from './AppWindow';
import { NotificationPopup } from './NotificationPopup';
import { ProfileMenu } from './ProfileMenu';
import { ContactPage } from './ContactPage';
import { SupportPage } from './SupportPage';
import { PrivacyPolicyPage } from './PrivacyPolicyPage';
import { TermsOfServicePage } from './TermsOfServicePage';
import { TasksPage } from './TasksPage';
import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

type Workspace = Database['public']['Tables']['workspaces']['Row'];
type Task = Database['public']['Tables']['tasks']['Row'];
type UserApp = Database['public']['Tables']['user_apps']['Row'] & {
  app: Database['public']['Tables']['available_apps']['Row'];
};
type Notification = Database['public']['Tables']['notifications']['Row'];

interface DashboardProps {
  userId: string;
}

export function Dashboard({ userId }: DashboardProps) {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [enrolledApps, setEnrolledApps] = useState<UserApp[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [productivityScore, setProductivityScore] = useState(0);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<Task[]>([]);
  const [activeApp, setActiveApp] = useState<UserApp | null>(null);
  const [minimizedApps, setMinimizedApps] = useState<UserApp[]>([]);
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'contact' | 'support' | 'privacy' | 'terms' | 'tasks'>('dashboard');
  const [sortBy, setSortBy] = useState<'priority' | 'deadline' | 'complexity'>('priority');

  const handleOpenApp = (app: UserApp) => {
    // Add to minimized apps if not already there
    if (!minimizedApps.find(a => a.id === app.id)) {
      setMinimizedApps([...minimizedApps, app]);
    }
    setActiveApp(app);
  };

  const handleMinimizeApp = () => {
    if (activeApp) {
      // Already in minimized apps from handleOpenApp
      setActiveApp(null);
    }
  };

  const handleRestoreApp = (app: UserApp) => {
    setActiveApp(app);
  };

  const handleCloseApp = () => {
    setActiveApp(null);
  };

  const handleCloseMinimizedApp = (appId: string) => {
    setMinimizedApps(minimizedApps.filter(a => a.id !== appId));
    // If this was the active app, close it too
    if (activeApp?.id === appId) {
      setActiveApp(null);
    }
  };

  useEffect(() => {
    loadWorkspaces();
    loadEnrolledApps();
    loadTasks();
    loadNotifications();
    loadProductivityData();
  }, [userId]);

  useEffect(() => {
    if (currentWorkspace) {
      loadTasks();
    }
  }, [currentWorkspace]);

  const loadWorkspaces = async () => {
    const { data } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', userId)
      .order('is_default', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) setCurrentWorkspace(data);
  };

  const loadEnrolledApps = async () => {
    const { data } = await supabase
      .from('user_apps')
      .select(`
        *,
        app:available_apps(*)
      `)
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('display_order');

    if (data) setEnrolledApps(data as any);
  };

  const loadTasks = async () => {
    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['pending', 'in_progress']);

    if (currentWorkspace) {
      query = query.eq('workspace_id', currentWorkspace.id);
    }

    const { data } = await query;

    if (data) {
      const typedData = data as Task[];
      setTasks(typedData);
      const urgent = typedData
        .filter((t) => t.urgency_level === 'critical' || t.urgency_level === 'high')
        .slice(0, 3);
      const deadlines = typedData
        .filter((t) => t.deadline)
        .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
        .slice(0, 3);

      setUrgentTasks(urgent);
      setUpcomingDeadlines(deadlines);
    }
  };

  const loadNotifications = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (data) setNotifications(data);
  };

  const loadProductivityData = async () => {
    const { data } = await supabase
      .from('work_habits')
      .select('productivity_score')
      .eq('user_id', userId)
      .order('analysis_date', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setProductivityScore((data as { productivity_score: number }).productivity_score);
    } else {
      setProductivityScore(85);
    }
  };

  const handleUnenrollApp = async (appId: string) => {
    await (supabase
      .from('user_apps') as any)
      .update({ is_active: false })
      .eq('user_id', userId)
      .eq('app_id', appId);

    loadEnrolledApps();
  };

  const handleNotificationClose = async (notificationId: string) => {
    await (supabase
      .from('notifications') as any)
      .update({ status: 'dismissed', dismissed_at: new Date().toISOString() })
      .eq('id', notificationId);

    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  const handleNotificationGoTo = async (notification: Notification) => {
    if (notification.action_url) {
      window.open(notification.action_url, '_blank');
    }
    handleNotificationClose(notification.id);
  };

  const handleNotificationSchedule = async (notificationId: string, date: Date) => {
    await (supabase
      .from('notifications') as any)
      .update({ status: 'scheduled', scheduled_for: date.toISOString() })
      .eq('id', notificationId);

    setNotifications(notifications.filter((n) => n.id !== notificationId));
  };

  const getTaskCountForApp = (appId: string) => {
    return tasks.filter((t) => t.app_id === appId).length;
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    return `${diffDays} days`;
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName] || LucideIcons.Package;
    return Icon;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'contact' && <ContactPage onBack={() => setCurrentPage('dashboard')} />}
      {currentPage === 'support' && <SupportPage onBack={() => setCurrentPage('dashboard')} />}
      {currentPage === 'privacy' && <PrivacyPolicyPage onBack={() => setCurrentPage('dashboard')} />}
      {currentPage === 'terms' && <TermsOfServicePage onBack={() => setCurrentPage('dashboard')} />}
      {currentPage === 'tasks' && (
        <TasksPage
          tasks={tasks}
          userId={userId}
          workspaceId={currentWorkspace?.id || null}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onBack={() => setCurrentPage('dashboard')}
          onTaskAdded={loadTasks}
        />
      )}

      {currentPage === 'dashboard' && (
        <>
          <TodoSidebar
            tasks={tasks}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          <TopNavigation
            userId={userId}
            currentWorkspace={currentWorkspace}
            tasks={tasks}
            onWorkspaceChange={setCurrentWorkspace}
            onProfileClick={() => setShowProfileMenu(true)}
            onHomeClick={() => setCurrentPage('dashboard')}
            onTasksClick={() => setCurrentPage('tasks')}
            onAppEnrollmentChange={loadEnrolledApps}
            onOpenApp={handleOpenApp}
          />

          <div className="fixed top-16 right-0 bottom-20 w-24 border-l border-gray-200 bg-white p-4 space-y-6 overflow-y-auto z-10">
            <div className="text-xs text-gray-500 text-center mb-4">Apps</div>
            {enrolledApps.map((userApp) => {
              const Icon = getIconComponent(userApp.app.icon);
              return (
                <div key={userApp.id} className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => handleOpenApp(userApp)}
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                    title={userApp.app.name}
                  >
                    <Icon className="w-6 h-6 text-gray-600" />
                  </button>
                  <span className="text-xs text-gray-600 text-center line-clamp-1 w-full">{userApp.app.name}</span>
                </div>
              );
            })}
          </div>

          <div className="fixed bottom-0 left-0 right-24 h-20 border-t border-gray-200 bg-white flex items-center px-6 gap-4 overflow-x-auto z-10">
            <div className="text-xs text-gray-500 mr-2">Minimized</div>
            {minimizedApps.map((userApp) => {
              const Icon = getIconComponent(userApp.app.icon);
              return (
                <div key={userApp.id} className="relative group">
                  <button
                    onClick={() => handleRestoreApp(userApp)}
                    className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0 relative"
                    title={userApp.app.name}
                  >
                    <Icon className="w-6 h-6 text-gray-600" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCloseMinimizedApp(userApp.id);
                    }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 z-10"
                    title="Close app"
                  >
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>

          <main className="pt-16 pb-20 pr-24 min-h-screen">
            <div className="max-w-7xl mx-auto p-6 space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Productivity</span>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{productivityScore}%</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Pending Tasks</span>
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{tasks.length}</p>
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Urgent Tasks</span>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <p className="text-3xl font-bold text-gray-800">{urgentTasks.length}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Important Upcoming Deadlines
                  </h3>
                  {upcomingDeadlines.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No upcoming deadlines</p>
                  ) : (
                    <div className="space-y-3">
                      {upcomingDeadlines.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <p className="text-sm font-medium text-gray-800 mb-1">{task.title}</p>
                          <p className="text-xs text-gray-600">
                            Due: {formatDeadline(task.deadline!)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Urgent Tasks</h3>
                  {urgentTasks.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No urgent tasks</p>
                  ) : (
                    <div className="space-y-3">
                      {urgentTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <p className="text-sm font-medium text-gray-800 mb-1">{task.title}</p>
                          <p className="text-xs text-red-600">Priority: {task.priority_score}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Your Apps</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledApps.map((userApp) => (
                    <AppPanel
                      key={userApp.id}
                      app={userApp.app}
                      taskCount={getTaskCountForApp(userApp.app.id)}
                      onUnenroll={() => handleUnenrollApp(userApp.app.id)}
                      onShowTasks={() => console.log('Show tasks for', userApp.app.name)}
                      onRedirect={() => handleOpenApp(userApp)}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">About Us</h3>
                <p className="text-gray-600 mb-4">
                  TriCoders is an AI-powered Personal Productivity Intelligence Platform designed to
                  help you stay organized, focused, and productive.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <button onClick={() => setCurrentPage('contact')} className="hover:text-blue-600 transition-colors">
                    Contact
                  </button>
                  <button onClick={() => setCurrentPage('support')} className="hover:text-blue-600 transition-colors">
                    Support
                  </button>
                  <button onClick={() => setCurrentPage('privacy')} className="hover:text-blue-600 transition-colors">
                    Privacy Policy
                  </button>
                  <button onClick={() => setCurrentPage('terms')} className="hover:text-blue-600 transition-colors">
                    Terms of Service
                  </button>
                </div>
              </div>
            </div>
          </main>

          {activeApp && (
            <AppWindow
              userApp={activeApp}
              onClose={handleCloseApp}
              onMinimize={handleMinimizeApp}
            />
          )}

          {notifications.map((notification) => (
            <NotificationPopup
              key={notification.id}
              notification={notification}
              onClose={() => handleNotificationClose(notification.id)}
              onGoTo={() => handleNotificationGoTo(notification)}
              onSchedule={(date) => handleNotificationSchedule(notification.id, date)}
            />
          ))}

          {showProfileMenu && <ProfileMenu onClose={() => setShowProfileMenu(false)} />}
        </>
      )}
    </div>
  );
}
