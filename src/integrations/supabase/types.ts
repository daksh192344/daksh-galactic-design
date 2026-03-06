export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      portfolio_items: {
        Row: {
          created_at: string
          description: string | null
          id: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_type: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_type?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_type?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      project_requests: {
        Row: {
          business_name: string
          client_email: string
          client_name: string
          client_phone: string
          created_at: string
          has_content: string | null
          has_logo: boolean | null
          id: string
          industry: string
          pages: string
          preferred_contact_time: string | null
          priority: string
          social_links: Json | null
          status: string | null
        }
        Insert: {
          business_name: string
          client_email: string
          client_name: string
          client_phone: string
          created_at?: string
          has_content?: string | null
          has_logo?: boolean | null
          id?: string
          industry: string
          pages: string
          preferred_contact_time?: string | null
          priority: string
          social_links?: Json | null
          status?: string | null
        }
        Update: {
          business_name?: string
          client_email?: string
          client_name?: string
          client_phone?: string
          created_at?: string
          has_content?: string | null
          has_logo?: boolean | null
          id?: string
          industry?: string
          pages?: string
          preferred_contact_time?: string | null
          priority?: string
          social_links?: Json | null
          status?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          assigned_to: string | null
          business_name: string
          client_name: string
          created_at: string
          id: string
          industry: string
          notes: string | null
          pages: string
          priority: string
          request_id: string | null
          status: Database["public"]["Enums"]["project_status"] | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          business_name: string
          client_name: string
          created_at?: string
          id?: string
          industry: string
          notes?: string | null
          pages: string
          priority: string
          request_id?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          business_name?: string
          client_name?: string
          created_at?: string
          id?: string
          industry?: string
          notes?: string | null
          pages?: string
          priority?: string
          request_id?: string | null
          status?: Database["public"]["Enums"]["project_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "project_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      task_assignments: {
        Row: {
          created_at: string
          id: string
          project_id: string
          status: string | null
          task_description: string | null
          team_member_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          project_id: string
          status?: string | null
          task_description?: string | null
          team_member_id: string
        }
        Update: {
          created_at?: string
          id?: string
          project_id?: string
          status?: string | null
          task_description?: string | null
          team_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_assignments_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_assignments_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      team_applications: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          location: string
          phone: string
          portfolio_links: Json | null
          role: Database["public"]["Enums"]["application_role"]
          role_specific_answers: Json | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          location: string
          phone: string
          portfolio_links?: Json | null
          role: Database["public"]["Enums"]["application_role"]
          role_specific_answers?: Json | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          location?: string
          phone?: string
          portfolio_links?: Json | null
          role?: Database["public"]["Enums"]["application_role"]
          role_specific_answers?: Json | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_available: boolean | null
          name: string
          projects_completed: number | null
          rating: number | null
          role: Database["public"]["Enums"]["team_role"]
          total_ratings: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          is_available?: boolean | null
          name: string
          projects_completed?: number | null
          rating?: number | null
          role: Database["public"]["Enums"]["team_role"]
          total_ratings?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_available?: boolean | null
          name?: string
          projects_completed?: number | null
          rating?: number | null
          role?: Database["public"]["Enums"]["team_role"]
          total_ratings?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      application_role:
        | "cold_caller"
        | "social_media_marketer"
        | "nocode_builder"
        | "web_developer"
        | "designer"
        | "digital_marketer"
      application_status: "pending" | "approved" | "rejected"
      project_status:
        | "pending"
        | "in_progress"
        | "review"
        | "completed"
        | "rejected"
      team_role: "developer" | "designer" | "cold_caller" | "manager"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
      application_role: [
        "cold_caller",
        "social_media_marketer",
        "nocode_builder",
        "web_developer",
        "designer",
        "digital_marketer",
      ],
      application_status: ["pending", "approved", "rejected"],
      project_status: [
        "pending",
        "in_progress",
        "review",
        "completed",
        "rejected",
      ],
      team_role: ["developer", "designer", "cold_caller", "manager"],
    },
  },
} as const
