/**
 * Database types for Supabase
 *
 * These types match the tables you need to create in Supabase.
 * See the SQL schema in /supabase/schema.sql
 */

export type UserRole = "agency" | "client";

export type ClientStatus = "active" | "inactive" | "prospect";

export type CampaignStatus = "active" | "paused" | "completed" | "draft";

export type CampaignType = "social" | "email" | "seo" | "ppc" | "content";

// ─── Row types (what Supabase returns) ────────────────────────────────────────

export interface ProfileRow {
  id: string; // UUID — matches auth.users.id
  name: string;
  email: string;
  role: UserRole;
  company: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientRow {
  id: string; // UUID
  profile_id: string | null; // FK → profiles.id (if client has a portal account)
  name: string;
  email: string;
  company: string;
  phone: string | null;
  status: ClientStatus;
  monthly_budget: number;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

export interface CampaignRow {
  id: string; // UUID
  client_id: string; // FK → clients.id
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  start_date: string;
  end_date: string | null;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  created_at: string;
  updated_at: string;
}

// ─── Database schema type (used by Supabase client) ───────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at" | "updated_at">;
        Update: Partial<Omit<ProfileRow, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      clients: {
        Row: ClientRow;
        Insert: Omit<ClientRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ClientRow, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
      campaigns: {
        Row: CampaignRow;
        Insert: Omit<CampaignRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<CampaignRow, "id" | "created_at" | "updated_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      client_status: ClientStatus;
      campaign_status: CampaignStatus;
      campaign_type: CampaignType;
    };
    CompositeTypes: Record<string, never>;
  };
}

// ─── App-level types (used in components) ─────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  avatar?: string;
}

export interface Client {
  id: string;
  profileId?: string | null;
  name: string;
  email: string;
  company: string;
  phone?: string;
  status: ClientStatus;
  joinedAt: string;
  campaigns: number; // computed count
  monthlyBudget: number;
}

export interface Campaign {
  id: string;
  clientId: string;
  clientName: string;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  startDate: string;
  endDate?: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
}
