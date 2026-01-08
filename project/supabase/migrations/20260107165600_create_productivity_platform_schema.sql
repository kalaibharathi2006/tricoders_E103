/*
  # Personal Productivity Intelligence Platform - Complete Database Schema

  ## Overview
  This migration creates the complete database structure for the AI-powered productivity platform.

  ## New Tables

  ### 1. users_profile
  Extended user profile information beyond auth.users
  - `id` (uuid, FK to auth.users)
  - `full_name` (text)
  - `avatar_url` (text)
  - `preferences` (jsonb) - UI preferences, notification settings
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. workspaces
  User workspaces (Personal, Work, etc.)
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to auth.users)
  - `name` (text)
  - `color` (text) - for visual identification
  - `is_default` (boolean)
  - `created_at` (timestamptz)

  ### 3. available_apps
  Catalog of all supported apps
  - `id` (uuid, PK)
  - `name` (text)
  - `icon` (text) - icon identifier
  - `category` (text) - productivity, communication, etc.
  - `is_default` (boolean) - shown by default in app list
  - `redirect_url` (text)
  - `created_at` (timestamptz)

  ### 4. user_apps
  Apps enrolled by each user
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to auth.users)
  - `app_id` (uuid, FK to available_apps)
  - `workspace_id` (uuid, FK to workspaces)
  - `is_active` (boolean)
  - `display_order` (integer)
  - `enrolled_at` (timestamptz)

  ### 5. tasks
  All tasks (AI-generated and manual)
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to auth.users)
  - `workspace_id` (uuid, FK to workspaces)
  - `app_id` (uuid, FK to available_apps) - optional, if task is app-specific
  - `title` (text)
  - `description` (text)
  - `status` (text) - pending, in_progress, completed, cancelled
  - `priority_score` (integer) - AI-calculated priority (0-100)
  - `urgency_level` (text) - low, medium, high, critical
  - `deadline` (timestamptz)
  - `completion_percentage` (integer) - 0-100
  - `is_ai_generated` (boolean)
  - `source_type` (text) - email, meeting, document, manual, etc.
  - `source_reference` (text) - identifier for the source
  - `estimated_duration` (integer) - in minutes
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 6. activities
  Log of all user activities for AI analysis
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to auth.users)
  - `workspace_id` (uuid, FK to workspaces)
  - `app_id` (uuid, FK to available_apps)
  - `activity_type` (text) - email_sent, file_edited, meeting_attended, task_switched, etc.
  - `activity_data` (jsonb) - detailed activity information
  - `duration_seconds` (integer)
  - `timestamp` (timestamptz)

  ### 7. notifications
  System notifications and alerts
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to auth.users)
  - `task_id` (uuid, FK to tasks) - optional
  - `notification_type` (text) - type1_important, type2_reminder, etc.
  - `title` (text)
  - `message` (text)
  - `priority` (text) - low, medium, high, critical
  - `status` (text) - pending, shown, dismissed, scheduled
  - `scheduled_for` (timestamptz)
  - `action_url` (text) - where "go to" button should navigate
  - `created_at` (timestamptz)
  - `shown_at` (timestamptz)
  - `dismissed_at` (timestamptz)

  ### 8. work_habits
  AI-analyzed work patterns and insights
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to auth.users)
  - `analysis_date` (date)
  - `total_tasks` (integer)
  - `completed_tasks` (integer)
  - `productivity_score` (integer) - 0-100
  - `context_switches` (integer)
  - `avg_working_hours` (decimal)
  - `overload_indicator` (boolean)
  - `ignored_priorities_count` (integer)
  - `insights` (jsonb) - detailed AI insights
  - `created_at` (timestamptz)

  ### 9. feedback
  User feedback and system improvement data
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to auth.users)
  - `feedback_type` (text) - bug, feature_request, general, ai_correction
  - `message` (text)
  - `context` (jsonb) - additional context data
  - `status` (text) - new, reviewing, resolved
  - `created_at` (timestamptz)

  ### 10. ai_explanations
  Store AI reasoning for transparency
  - `id` (uuid, PK)
  - `user_id` (uuid, FK to auth.users)
  - `entity_type` (text) - task, notification, recommendation
  - `entity_id` (uuid)
  - `explanation` (text)
  - `factors` (jsonb) - factors considered in AI decision
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Policies for authenticated users only
*/

-- Create users_profile table
CREATE TABLE IF NOT EXISTS users_profile (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  preferences jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users_profile FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users_profile FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users_profile FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text DEFAULT '#3B82F6',
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workspaces"
  ON workspaces FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own workspaces"
  ON workspaces FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own workspaces"
  ON workspaces FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own workspaces"
  ON workspaces FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create available_apps table
CREATE TABLE IF NOT EXISTS available_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  icon text NOT NULL,
  category text DEFAULT 'productivity',
  is_default boolean DEFAULT false,
  redirect_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE available_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available apps"
  ON available_apps FOR SELECT
  TO authenticated
  USING (true);

-- Create user_apps table
CREATE TABLE IF NOT EXISTS user_apps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  app_id uuid NOT NULL REFERENCES available_apps(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE(user_id, app_id, workspace_id)
);

ALTER TABLE user_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrolled apps"
  ON user_apps FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrolled apps"
  ON user_apps FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own enrolled apps"
  ON user_apps FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own enrolled apps"
  ON user_apps FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL,
  app_id uuid REFERENCES available_apps(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority_score integer DEFAULT 50 CHECK (priority_score BETWEEN 0 AND 100),
  urgency_level text DEFAULT 'medium' CHECK (urgency_level IN ('low', 'medium', 'high', 'critical')),
  deadline timestamptz,
  completion_percentage integer DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  is_ai_generated boolean DEFAULT false,
  source_type text,
  source_reference text,
  estimated_duration integer,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own tasks"
  ON tasks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  workspace_id uuid REFERENCES workspaces(id) ON DELETE SET NULL,
  app_id uuid REFERENCES available_apps(id) ON DELETE SET NULL,
  activity_type text NOT NULL,
  activity_data jsonb DEFAULT '{}'::jsonb,
  duration_seconds integer DEFAULT 0,
  timestamp timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  notification_type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'shown', 'dismissed', 'scheduled')),
  scheduled_for timestamptz,
  action_url text,
  created_at timestamptz DEFAULT now(),
  shown_at timestamptz,
  dismissed_at timestamptz
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create work_habits table
CREATE TABLE IF NOT EXISTS work_habits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_date date NOT NULL DEFAULT CURRENT_DATE,
  total_tasks integer DEFAULT 0,
  completed_tasks integer DEFAULT 0,
  productivity_score integer DEFAULT 0 CHECK (productivity_score BETWEEN 0 AND 100),
  context_switches integer DEFAULT 0,
  avg_working_hours decimal DEFAULT 0,
  overload_indicator boolean DEFAULT false,
  ignored_priorities_count integer DEFAULT 0,
  insights jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, analysis_date)
);

ALTER TABLE work_habits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own work habits"
  ON work_habits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feedback_type text NOT NULL CHECK (feedback_type IN ('bug', 'feature_request', 'general', 'ai_correction')),
  message text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'resolved')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create ai_explanations table
CREATE TABLE IF NOT EXISTS ai_explanations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  explanation text NOT NULL,
  factors jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_explanations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI explanations"
  ON ai_explanations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Insert default available apps
INSERT INTO available_apps (name, icon, category, is_default, redirect_url) VALUES
  ('Gmail', 'Mail', 'communication', true, 'https://mail.google.com'),
  ('Google Meet', 'Video', 'communication', true, 'https://meet.google.com'),
  ('Google Drive', 'HardDrive', 'storage', true, 'https://drive.google.com'),
  ('Google Calendar', 'Calendar', 'productivity', true, 'https://calendar.google.com'),
  ('ChatGPT', 'MessageSquare', 'ai', true, 'https://chat.openai.com'),
  ('Chrome', 'Globe', 'browser', true, 'https://www.google.com/chrome'),
  ('Slack', 'MessageCircle', 'communication', true, 'https://slack.com'),
  ('Notion', 'BookOpen', 'productivity', true, 'https://notion.so'),
  ('Trello', 'Trello', 'productivity', true, 'https://trello.com'),
  ('Zoom', 'Video', 'communication', true, 'https://zoom.us')
ON CONFLICT (name) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);
CREATE INDEX IF NOT EXISTS idx_activities_user_id ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_user_apps_user_id ON user_apps(user_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_user_id ON workspaces(user_id);