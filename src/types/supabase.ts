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
      users: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string | null;
          email: string;
          display_name: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          email: string;
          display_name?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string | null;
          email?: string;
          display_name?: string | null;
        };
        Relationships: [];
      };
      user_settings: {
        Row: {
          id: string;
          user: string;
          tracking_project_name: string | null;
          clockify_api_key: string | null;
          clockify_workspace_id: string | null;
        };
        Insert: {
          id?: string;
          user: string;
          tracking_project_name?: string | null;
          clockify_api_key?: string | null;
          clockify_workspace_id?: string | null;
        };
        Update: {
          id?: string;
          user?: string;
          tracking_project_name?: string | null;
          clockify_api_key?: string | null;
          clockify_workspace_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_settings_user_fkey";
            columns: ["user"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      presets: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          name: string;
          description: string | null;
          steps: TimerStep[];
          duration_total: number;
          user: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name: string;
          description?: string | null;
          steps: TimerStep[];
          duration_total: number;
          user: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          name?: string;
          description?: string | null;
          steps?: TimerStep[];
          duration_total?: number;
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: "presets_user_fkey";
            columns: ["user"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      videos: {
        Row: {
          id: string;
          local_name: string;
          url: string;
          title: string;
          user: string;
        };
        Insert: {
          id?: string;
          local_name: string;
          url: string;
          title: string;
          user: string;
        };
        Update: {
          id?: string;
          local_name?: string;
          url?: string;
          title?: string;
          user?: string;
        };
        Relationships: [
          {
            foreignKeyName: "videos_user_fkey";
            columns: ["user"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
