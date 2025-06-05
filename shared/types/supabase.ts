export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string | null
          id: string
          project_slug: string
          project_title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          project_slug: string
          project_title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          project_slug?: string
          project_title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      assets: {
        Row: {
          created_at: string | null
          game_id: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          game_id?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      cache_entries: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          key: string
          status: Database["public"]["Enums"]["cache_status"]
          ttl: number | null
          updated_at: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key: string
          status?: Database["public"]["Enums"]["cache_status"]
          ttl?: number | null
          updated_at?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          key?: string
          status?: Database["public"]["Enums"]["cache_status"]
          ttl?: number | null
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      code_files: {
        Row: {
          content: string
          created_at: string | null
          game_id: string | null
          id: string
          language: string
          name: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          game_id?: string | null
          id?: string
          language: string
          name: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          game_id?: string | null
          id?: string
          language?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      game_assets: {
        Row: {
          content_type: string
          created_at: string | null
          game_id: string
          id: string
          metadata: Json | null
          name: string
          size: number
          storage_path: string
          type: Database["public"]["Enums"]["asset_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content_type: string
          created_at?: string | null
          game_id: string
          id?: string
          metadata?: Json | null
          name: string
          size: number
          storage_path: string
          type: Database["public"]["Enums"]["asset_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content_type?: string
          created_at?: string | null
          game_id?: string
          id?: string
          metadata?: Json | null
          name?: string
          size?: number
          storage_path?: string
          type?: Database["public"]["Enums"]["asset_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_assets_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_assets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_code: {
        Row: {
          code_content: string
          created_at: string
          filename: string
          game_id: string
          id: string
          language: string
          updated_at: string
        }
        Insert: {
          code_content: string
          created_at?: string
          filename: string
          game_id: string
          id?: string
          language: string
          updated_at?: string
        }
        Update: {
          code_content?: string
          created_at?: string
          filename?: string
          game_id?: string
          id?: string
          language?: string
          updated_at?: string
        }
        Relationships: []
      }
      game_exports: {
        Row: {
          created_at: string | null
          format: string
          game_id: string
          id: string
          size: number | null
          status: string
          url: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          format: string
          game_id: string
          id?: string
          size?: number | null
          status: string
          url?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          format?: string
          game_id?: string
          id?: string
          size?: number | null
          status?: string
          url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_exports_game_id_fkey"
            columns: ["game_id"]
            isOneToOne: false
            referencedRelation: "games"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_exports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_scenes: {
        Row: {
          created_at: string
          description: string | null
          game_id: string
          id: string
          metadata: Json | null
          name: string
          scene_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          game_id: string
          id?: string
          metadata?: Json | null
          name: string
          scene_order: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          game_id?: string
          id?: string
          metadata?: Json | null
          name?: string
          scene_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      games: {
        Row: {
          created_at: string | null
          description: string | null
          engine: Database["public"]["Enums"]["game_engine"]
          id: string
          last_backup_at: string | null
          settings: Json | null
          status: Database["public"]["Enums"]["game_status"]
          title: string
          updated_at: string | null
          user_id: string
          version: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          engine: Database["public"]["Enums"]["game_engine"]
          id?: string
          last_backup_at?: string | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["game_status"]
          title: string
          updated_at?: string | null
          user_id: string
          version?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          engine?: Database["public"]["Enums"]["game_engine"]
          id?: string
          last_backup_at?: string | null
          settings?: Json | null
          status?: Database["public"]["Enums"]["game_status"]
          title?: string
          updated_at?: string | null
          user_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "games_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          slug: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          slug: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          slug?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      scenes: {
        Row: {
          created_at: string | null
          description: string | null
          game_id: string | null
          id: string
          objectives: Json | null
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          game_id?: string | null
          id?: string
          objectives?: Json | null
          order_index: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          game_id?: string | null
          id?: string
          objectives?: Json | null
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          auth_user_id: string
          avatar_url: string | null
          created_at: string | null
          display_name: string
          email: string
          full_name: string | null
          id: string
          preferences: Json | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          auth_user_id: string
          avatar_url?: string | null
          created_at?: string | null
          display_name: string
          email: string
          full_name?: string | null
          id?: string
          preferences?: Json | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          auth_user_id?: string
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string
          email?: string
          full_name?: string | null
          id?: string
          preferences?: Json | null
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      asset_type: "sprite" | "background" | "sound" | "tilemap"
      cache_status: "valid" | "stale" | "invalid"
      game_engine: "unity" | "godot"
      game_status: "draft" | "generating" | "completed" | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      asset_type: ["sprite", "background", "sound", "tilemap"],
      cache_status: ["valid", "stale", "invalid"],
      game_engine: ["unity", "godot"],
      game_status: ["draft", "generating", "completed", "failed"],
    },
  },
} as const
