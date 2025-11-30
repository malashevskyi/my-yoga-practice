import type { TimerStep } from "./timer";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      presets: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          description: string | null;
          steps: TimerStep[];
          duration_total: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          description?: string | null;
          steps: TimerStep[];
          duration_total: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          description?: string | null;
          steps?: TimerStep[];
          duration_total?: number;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
