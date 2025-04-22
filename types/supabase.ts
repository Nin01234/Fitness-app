export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      testimonials: {
        Row: {
          id: string
          name: string
          role: string
          content: string
          avatar: string | null
          rating: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          content: string
          avatar?: string | null
          rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          content?: string
          avatar?: string | null
          rating?: number
          created_at?: string
          updated_at?: string
        }
      }
      features: {
        Row: {
          id: string
          title: string
          description: string
          icon: string
          order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon: string
          order: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon?: string
          order?: number
          created_at?: string
          updated_at?: string
        }
      }
      pricing_plans: {
        Row: {
          id: string
          name: string
          description: string
          price: string
          duration: string
          features: string[]
          cta: string
          popular: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: string
          duration: string
          features: string[]
          cta: string
          popular?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: string
          duration?: string
          features?: string[]
          cta?: string
          popular?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          height: number | null
          weight: number | null
          age: number | null
          gender: string | null
          fitness_level: string | null
          goals: string[] | null
          points: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          height?: number | null
          weight?: number | null
          age?: number | null
          gender?: string | null
          fitness_level?: string | null
          goals?: string[] | null
          points?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          height?: number | null
          weight?: number | null
          age?: number | null
          gender?: string | null
          fitness_level?: string | null
          goals?: string[] | null
          points?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          duration: number | null
          calories_burned: number | null
          date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          duration?: number | null
          calories_burned?: number | null
          date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          duration?: number | null
          calories_burned?: number | null
          date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          description: string | null
          muscle_group: string | null
          equipment: string | null
          difficulty: string | null
          instructions: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          muscle_group?: string | null
          equipment?: string | null
          difficulty?: string | null
          instructions?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          muscle_group?: string | null
          equipment?: string | null
          difficulty?: string | null
          instructions?: string | null
          image_url?: string | null
        }
      }
      workout_exercises: {
        Row: {
          id: string
          workout_id: string
          exercise_id: string
          sets: number | null
          reps: number | null
          weight: number | null
          duration: number | null
          notes: string | null
          completed: boolean | null
        }
        Insert: {
          id?: string
          workout_id: string
          exercise_id: string
          sets?: number | null
          reps?: number | null
          weight?: number | null
          duration?: number | null
          notes?: string | null
          completed?: boolean | null
        }
        Update: {
          id?: string
          workout_id?: string
          exercise_id?: string
          sets?: number | null
          reps?: number | null
          weight?: number | null
          duration?: number | null
          notes?: string | null
          completed?: boolean | null
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          name: string
          meal_type: string | null
          calories: number | null
          protein: number | null
          carbs: number | null
          fat: number | null
          date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          meal_type?: string | null
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          meal_type?: string | null
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      foods: {
        Row: {
          id: string
          name: string
          calories: number | null
          protein: number | null
          carbs: number | null
          fat: number | null
          serving_size: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          name: string
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          serving_size?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          calories?: number | null
          protein?: number | null
          carbs?: number | null
          fat?: number | null
          serving_size?: string | null
          image_url?: string | null
        }
      }
      meal_foods: {
        Row: {
          id: string
          meal_id: string
          food_id: string
          servings: number | null
        }
        Insert: {
          id?: string
          meal_id: string
          food_id: string
          servings?: number | null
        }
        Update: {
          id?: string
          meal_id?: string
          food_id?: string
          servings?: number | null
        }
      }
      progress: {
        Row: {
          id: string
          user_id: string
          weight: number | null
          body_fat: number | null
          muscle_mass: number | null
          notes: string | null
          date: string | null
        }
        Insert: {
          id?: string
          user_id: string
          weight?: number | null
          body_fat?: number | null
          muscle_mass?: number | null
          notes?: string | null
          date?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          weight?: number | null
          body_fat?: number | null
          muscle_mass?: number | null
          notes?: string | null
          date?: string | null
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          goal_type: string | null
          target_value: number | null
          current_value: number | null
          completed: boolean | null
          due_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          goal_type?: string | null
          target_value?: number | null
          current_value?: number | null
          completed?: boolean | null
          due_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          goal_type?: string | null
          target_value?: number | null
          current_value?: number | null
          completed?: boolean | null
          due_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      reminders: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          reminder_type: string | null
          time_of_day: string | null
          days_of_week: string[] | null
          active: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          reminder_type?: string | null
          time_of_day?: string | null
          days_of_week?: string[] | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          reminder_type?: string | null
          time_of_day?: string | null
          days_of_week?: string[] | null
          active?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string | null
          badge_image: string | null
          points: number | null
          requirements: Json | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          badge_image?: string | null
          points?: number | null
          requirements?: Json | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          badge_image?: string | null
          points?: number | null
          requirements?: Json | null
        }
      }
      user_achievements: {
        Row: {
          id: string
          user_id: string
          achievement_id: string
          date_earned: string | null
        }
        Insert: {
          id?: string
          user_id: string
          achievement_id: string
          date_earned?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          achievement_id?: string
          date_earned?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          read: boolean
          timestamp: string
          action: Json | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: string
          read?: boolean
          timestamp?: string
          action?: Json | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          read?: boolean
          timestamp?: string
          action?: Json | null
          created_at?: string | null
        }
      }
    }
  }
}

