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
      container_lists: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
        }
      }
      inventory_items: {
        Row: {
          id: string
          container_list_id: string
          customer_name: string
          job_number: string
          manufacturer_order_number: string
          quantity: number
          item_type: string
          created_at: string
        }
        Insert: {
          id?: string
          container_list_id: string
          customer_name: string
          job_number: string
          manufacturer_order_number: string
          quantity: number
          item_type: string
          created_at?: string
        }
        Update: {
          id?: string
          container_list_id?: string
          customer_name?: string
          job_number?: string
          manufacturer_order_number?: string
          quantity?: number
          item_type?: string
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