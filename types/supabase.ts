// Type helpers for Supabase queries
import { Database } from './database';

export type Event = Database['public']['Tables']['events']['Row'] & {
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
};

export type VisitReport = Database['public']['Tables']['visit_reports']['Row'] & {
  profiles?: {
    full_name: string | null;
    email: string;
  } | null;
};

export type Message = Database['public']['Tables']['messages']['Row'] & {
  sender?: {
    full_name: string | null;
    email: string;
  } | null;
};

export type Profile = Database['public']['Tables']['profiles']['Row'];
