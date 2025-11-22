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
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'volunteer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'volunteer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'volunteer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          center_name: string
          location: string
          scheduled_date: string
          duration_hours: number | null
          activity_type: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          center_name: string
          location: string
          scheduled_date: string
          duration_hours?: number | null
          activity_type?: string | null
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          center_name?: string
          location?: string
          scheduled_date?: string
          duration_hours?: number | null
          activity_type?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      visit_reports: {
        Row: {
          id: string
          event_id: string | null
          volunteer_id: string
          email: string
          visit_date: string
          duration_hours: number
          center_name: string
          location: string
          activity_type: string
          children_count: number
          children_names: string
          activity_description: string
          testimonials: string | null
          child_observations: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id?: string | null
          volunteer_id: string
          email: string
          visit_date: string
          duration_hours: number
          center_name: string
          location: string
          activity_type: string
          children_count: number
          children_names: string
          activity_description: string
          testimonials?: string | null
          child_observations?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string | null
          volunteer_id?: string
          email?: string
          visit_date?: string
          duration_hours?: number
          center_name?: string
          location?: string
          activity_type?: string
          children_count?: number
          children_names?: string
          activity_description?: string
          testimonials?: string | null
          child_observations?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string | null
          subject: string
          content: string
          is_broadcast: boolean
          read_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id?: string | null
          subject: string
          content: string
          is_broadcast?: boolean
          read_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string | null
          subject?: string
          content?: string
          is_broadcast?: boolean
          read_at?: string | null
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
