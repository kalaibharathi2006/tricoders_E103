export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users_profile: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          preferences: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          preferences?: Json
          created_at?: string
          updated_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          user_id: string
          name: string
          color: string
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          color?: string
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          color?: string
          is_default?: boolean
          created_at?: string
        }
      }
      available_apps: {
        Row: {
          id: string
          name: string
          icon: string
          category: string
          is_default: boolean
          redirect_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          category?: string
          is_default?: boolean
          redirect_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          category?: string
          is_default?: boolean
          redirect_url?: string | null
          created_at?: string
        }
      }
      user_apps: {
        Row: {
          id: string
          user_id: string
          app_id: string
          workspace_id: string | null
          is_active: boolean
          display_order: number
          enrolled_at: string
        }
        Insert: {
          id?: string
          user_id: string
          app_id: string
          workspace_id?: string | null
          is_active?: boolean
          display_order?: number
          enrolled_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          app_id?: string
          workspace_id?: string | null
          is_active?: boolean
          display_order?: number
          enrolled_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          workspace_id: string | null
          app_id: string | null
          title: string
          description: string | null
          status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          priority_score: number
          urgency_level: 'low' | 'medium' | 'high' | 'critical'
          deadline: string | null
          completion_percentage: number
          is_ai_generated: boolean
          source_type: string | null
          source_reference: string | null
          estimated_duration: number | null
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workspace_id?: string | null
          app_id?: string | null
          title: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          priority_score?: number
          urgency_level?: 'low' | 'medium' | 'high' | 'critical'
          deadline?: string | null
          completion_percentage?: number
          is_ai_generated?: boolean
          source_type?: string | null
          source_reference?: string | null
          estimated_duration?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workspace_id?: string | null
          app_id?: string | null
          title?: string
          description?: string | null
          status?: 'pending' | 'in_progress' | 'completed' | 'cancelled'
          priority_score?: number
          urgency_level?: 'low' | 'medium' | 'high' | 'critical'
          deadline?: string | null
          completion_percentage?: number
          is_ai_generated?: boolean
          source_type?: string | null
          source_reference?: string | null
          estimated_duration?: number | null
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          workspace_id: string | null
          app_id: string | null
          activity_type: string
          activity_data: Json
          duration_seconds: number
          timestamp: string
        }
        Insert: {
          id?: string
          user_id: string
          workspace_id?: string | null
          app_id?: string | null
          activity_type: string
          activity_data?: Json
          duration_seconds?: number
          timestamp?: string
        }
        Update: {
          id?: string
          user_id?: string
          workspace_id?: string | null
          app_id?: string | null
          activity_type?: string
          activity_data?: Json
          duration_seconds?: number
          timestamp?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          task_id: string | null
          notification_type: string
          title: string
          message: string
          priority: 'low' | 'medium' | 'high' | 'critical'
          status: 'pending' | 'shown' | 'dismissed' | 'scheduled'
          scheduled_for: string | null
          action_url: string | null
          created_at: string
          shown_at: string | null
          dismissed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          task_id?: string | null
          notification_type: string
          title: string
          message: string
          priority?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'pending' | 'shown' | 'dismissed' | 'scheduled'
          scheduled_for?: string | null
          action_url?: string | null
          created_at?: string
          shown_at?: string | null
          dismissed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          task_id?: string | null
          notification_type?: string
          title?: string
          message?: string
          priority?: 'low' | 'medium' | 'high' | 'critical'
          status?: 'pending' | 'shown' | 'dismissed' | 'scheduled'
          scheduled_for?: string | null
          action_url?: string | null
          created_at?: string
          shown_at?: string | null
          dismissed_at?: string | null
        }
      }
      work_habits: {
        Row: {
          id: string
          user_id: string
          analysis_date: string
          total_tasks: number
          completed_tasks: number
          productivity_score: number
          context_switches: number
          avg_working_hours: number
          overload_indicator: boolean
          ignored_priorities_count: number
          insights: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          analysis_date?: string
          total_tasks?: number
          completed_tasks?: number
          productivity_score?: number
          context_switches?: number
          avg_working_hours?: number
          overload_indicator?: boolean
          ignored_priorities_count?: number
          insights?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          analysis_date?: string
          total_tasks?: number
          completed_tasks?: number
          productivity_score?: number
          context_switches?: number
          avg_working_hours?: number
          overload_indicator?: boolean
          ignored_priorities_count?: number
          insights?: Json
          created_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          user_id: string
          feedback_type: 'bug' | 'feature_request' | 'general' | 'ai_correction'
          message: string
          context: Json
          status: 'new' | 'reviewing' | 'resolved'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          feedback_type: 'bug' | 'feature_request' | 'general' | 'ai_correction'
          message: string
          context?: Json
          status?: 'new' | 'reviewing' | 'resolved'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          feedback_type?: 'bug' | 'feature_request' | 'general' | 'ai_correction'
          message?: string
          context?: Json
          status?: 'new' | 'reviewing' | 'resolved'
          created_at?: string
        }
      }
      ai_explanations: {
        Row: {
          id: string
          user_id: string
          entity_type: string
          entity_id: string
          explanation: string
          factors: Json
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          entity_type: string
          entity_id: string
          explanation: string
          factors?: Json
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          entity_type?: string
          entity_id?: string
          explanation?: string
          factors?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
