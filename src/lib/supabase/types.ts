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
      daily_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          weight_kg: number | null
          calories_consumed: number
          calories_burned_exercise: number
          calories_burned_bmr: number
          calorie_balance: number | null
          protein_consumed_g: number
          carbs_consumed_g: number
          fats_consumed_g: number
          mit_task_1: string | null
          mit_task_1_completed: boolean
          mit_task_2: string | null
          mit_task_2_completed: boolean
          mit_task_3: string | null
          mit_task_3_completed: boolean
          deep_work_completed: boolean
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          weight_kg?: number | null
          calories_consumed?: number
          calories_burned_exercise?: number
          calories_burned_bmr?: number
          protein_consumed_g?: number
          carbs_consumed_g?: number
          fats_consumed_g?: number
          mit_task_1?: string | null
          mit_task_1_completed?: boolean
          mit_task_2?: string | null
          mit_task_2_completed?: boolean
          mit_task_3?: string | null
          mit_task_3_completed?: boolean
          deep_work_completed?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          weight_kg?: number | null
          calories_consumed?: number
          calories_burned_exercise?: number
          calories_burned_bmr?: number
          protein_consumed_g?: number
          carbs_consumed_g?: number
          fats_consumed_g?: number
          mit_task_1?: string | null
          mit_task_1_completed?: boolean
          mit_task_2?: string | null
          mit_task_2_completed?: boolean
          mit_task_3?: string | null
          mit_task_3_completed?: boolean
          deep_work_completed?: boolean
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      exercise_entries: {
        Row: {
          id: string
          user_id: string
          daily_entry_id: string
          name: string
          category: "cardio" | "strength" | "sports" | "daily_activities"
          met_value: number
          duration_minutes: number
          calories_burned: number
          intensity: "low" | "moderate" | "high"
          notes: string | null
          performed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daily_entry_id: string
          name: string
          category: "cardio" | "strength" | "sports" | "daily_activities"
          met_value: number
          duration_minutes: number
          calories_burned: number
          intensity: "low" | "moderate" | "high"
          notes?: string | null
          performed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daily_entry_id?: string
          name?: string
          category?: "cardio" | "strength" | "sports" | "daily_activities"
          met_value?: number
          duration_minutes?: number
          calories_burned?: number
          intensity?: "low" | "moderate" | "high"
          notes?: string | null
          performed_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercise_entries_daily_entry_id_fkey"
            columns: ["daily_entry_id"]
            isOneToOne: false
            referencedRelation: "daily_entries"
            referencedColumns: ["id"]
          }
        ]
      }
      food_entries: {
        Row: {
          id: string
          user_id: string
          daily_entry_id: string
          name: string
          calories: number
          protein_g: number
          carbs_g: number
          fats_g: number
          amount: number
          unit: string
          meal_type: "breakfast" | "lunch" | "dinner" | "snack"
          consumed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daily_entry_id: string
          name: string
          calories: number
          protein_g?: number
          carbs_g?: number
          fats_g?: number
          amount: number
          unit: string
          meal_type: "breakfast" | "lunch" | "dinner" | "snack"
          consumed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daily_entry_id?: string
          name?: string
          calories?: number
          protein_g?: number
          carbs_g?: number
          fats_g?: number
          amount?: number
          unit?: string
          meal_type?: "breakfast" | "lunch" | "dinner" | "snack"
          consumed_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_entries_daily_entry_id_fkey"
            columns: ["daily_entry_id"]
            isOneToOne: false
            referencedRelation: "daily_entries"
            referencedColumns: ["id"]
          }
        ]
      }
      food_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          calories: number
          protein_g: number
          carbs_g: number
          fats_g: number
          default_amount: number
          default_unit: string
          category: "meal" | "snack" | "drink"
          is_favorite: boolean
          usage_count: number
          last_used: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          calories: number
          protein_g?: number
          carbs_g?: number
          fats_g?: number
          default_amount: number
          default_unit: string
          category: "meal" | "snack" | "drink"
          is_favorite?: boolean
          usage_count?: number
          last_used?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          calories?: number
          protein_g?: number
          carbs_g?: number
          fats_g?: number
          default_amount?: number
          default_unit?: string
          category?: "meal" | "snack" | "drink"
          is_favorite?: boolean
          usage_count?: number
          last_used?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      injectable_compounds: {
        Row: {
          id: string
          user_id: string
          name: string
          concentration: number
          ester_type: "acetate" | "propionate" | "cypionate" | "enanthate" | "decanoate" | "undecanoate"
          half_life_days: number
          category: "trt" | "hrt" | "peptide" | "other"
          weekly_target_mg: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          concentration: number
          ester_type: "acetate" | "propionate" | "cypionate" | "enanthate" | "decanoate" | "undecanoate"
          half_life_days: number
          category: "trt" | "hrt" | "peptide" | "other"
          weekly_target_mg: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          concentration?: number
          ester_type?: "acetate" | "propionate" | "cypionate" | "enanthate" | "decanoate" | "undecanoate"
          half_life_days?: number
          category?: "trt" | "hrt" | "peptide" | "other"
          weekly_target_mg?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "injectable_compounds_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      injection_entries: {
        Row: {
          id: string
          user_id: string
          compound_id: string
          dose_mg: number
          volume_ml: number
          injection_site: "left_delt" | "right_delt" | "left_glute" | "right_glute" | "left_quad" | "right_quad" | "subq_abdomen" | "subq_thigh"
          injection_date: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          compound_id: string
          dose_mg: number
          volume_ml: number
          injection_site: "left_delt" | "right_delt" | "left_glute" | "right_glute" | "left_quad" | "right_quad" | "subq_abdomen" | "subq_thigh"
          injection_date: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          compound_id?: string
          dose_mg?: number
          volume_ml?: number
          injection_site?: "left_delt" | "right_delt" | "left_glute" | "right_glute" | "left_quad" | "right_quad" | "subq_abdomen" | "subq_thigh"
          injection_date?: string
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "injection_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "injection_entries_compound_id_fkey"
            columns: ["compound_id"]
            isOneToOne: false
            referencedRelation: "injectable_compounds"
            referencedColumns: ["id"]
          }
        ]
      }
      nirvana_sessions: {
        Row: {
          id: string
          user_id: string
          session_date: string
          session_type: string
          duration_minutes: number
          difficulty: "beginner" | "intermediate" | "advanced"
          quality_rating: number
          exercises: string[]
          body_parts: string[]
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_date: string
          session_type: string
          duration_minutes: number
          difficulty: "beginner" | "intermediate" | "advanced"
          quality_rating: number
          exercises: string[]
          body_parts: string[]
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_date?: string
          session_type?: string
          duration_minutes?: number
          difficulty?: "beginner" | "intermediate" | "advanced"
          quality_rating?: number
          exercises?: string[]
          body_parts?: string[]
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "nirvana_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      progress_milestones: {
        Row: {
          id: string
          user_id: string
          name: string
          category: "strength" | "skill" | "flexibility" | "endurance"
          description: string
          target_date: string | null
          completed_date: string | null
          is_completed: boolean
          progress_percentage: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: "strength" | "skill" | "flexibility" | "endurance"
          description: string
          target_date?: string | null
          completed_date?: string | null
          is_completed?: boolean
          progress_percentage?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: "strength" | "skill" | "flexibility" | "endurance"
          description?: string
          target_date?: string | null
          completed_date?: string | null
          is_completed?: boolean
          progress_percentage?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "progress_milestones_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          user_id: string
          name: string
          email: string | null
          age: number
          gender: "male" | "female" | "other"
          height_cm: number
          current_weight_kg: number
          activity_level: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active"
          bmr: number
          tdee: number
          calorie_target: number
          protein_target_g: number
          carbs_target_g: number
          fats_target_g: number
          units: "metric" | "imperial"
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          name: string
          email?: string | null
          age: number
          gender: "male" | "female" | "other"
          height_cm: number
          current_weight_kg: number
          activity_level: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active"
          bmr: number
          tdee: number
          calorie_target: number
          protein_target_g: number
          carbs_target_g: number
          fats_target_g: number
          units?: "metric" | "imperial"
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          name?: string
          email?: string | null
          age?: number
          gender?: "male" | "female" | "other"
          height_cm?: number
          current_weight_kg?: number
          activity_level?: "sedentary" | "lightly_active" | "moderately_active" | "very_active" | "extremely_active"
          bmr?: number
          tdee?: number
          calorie_target?: number
          protein_target_g?: number
          carbs_target_g?: number
          fats_target_g?: number
          units?: "metric" | "imperial"
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      weekly_entries: {
        Row: {
          id: string
          user_id: string
          week_start_date: string
          objective_1: string | null
          objective_1_completed: boolean
          objective_2: string | null
          objective_2_completed: boolean
          objective_3: string | null
          objective_3_completed: boolean
          completion_rate: number | null
          insights: string | null
          next_week_focus: string | null
          review_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          week_start_date: string
          objective_1?: string | null
          objective_1_completed?: boolean
          objective_2?: string | null
          objective_2_completed?: boolean
          objective_3?: string | null
          objective_3_completed?: boolean
          completion_rate?: number | null
          insights?: string | null
          next_week_focus?: string | null
          review_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start_date?: string
          objective_1?: string | null
          objective_1_completed?: boolean
          objective_2?: string | null
          objective_2_completed?: boolean
          objective_3?: string | null
          objective_3_completed?: boolean
          completion_rate?: number | null
          insights?: string | null
          next_week_focus?: string | null
          review_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "weekly_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}