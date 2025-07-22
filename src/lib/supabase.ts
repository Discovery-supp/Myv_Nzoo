import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zfxkyiusextbhhxemwuu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY

// Check if we have valid keys (not placeholders)
const isValidKey = (key: string) => key && !key.includes('ta_clé_publique_supabase') && key.length > 20

let supabase

if (!supabaseUrl || !supabaseAnonKey || !isValidKey(supabaseAnonKey)) {
  console.warn('Missing Supabase environment variables, using fallback values')
  // Provide a temporary fallback to prevent the error
  const fallbackKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpmeDt5aXVzZXh0YmhoeGVtd3V1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk2MjQwMDAsImV4cCI6MjAwNTIwMDAwMH0.fallback'
  
  supabase = createClient(supabaseUrl, fallbackKey)
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }

// Types pour la base de données
export interface Reservation {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string
  company?: string
  activity: string
  address?: string
  space_type: 'coworking' | 'bureau-prive' | 'salle-reunion'
  start_date: string
  end_date: string
  occupants: number
  subscription_type?: 'daily' | 'monthly' | 'yearly' | 'hourly'
  amount: number
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  payment_status: 'pending' | 'paid' | 'failed'
  payment_method?: 'mobile_money' | 'visa'
}

export interface Space {
  id: string
  name: string
  type: 'coworking' | 'bureau-prive' | 'salle-reunion'
  description: string
  features: string[]
  max_occupants: number
  daily_price?: number
  monthly_price?: number
  yearly_price?: number
  hourly_price?: number
  is_active: boolean
  images: string[]
  display_order?: number
  admin_notes?: string
  availability_status?: 'available' | 'maintenance' | 'reserved' | 'unavailable'
  display_order?: number
  admin_notes?: string
  availability_status?: 'available' | 'maintenance' | 'reserved' | 'unavailable'
  created_at?: string
  updated_at?: string
}

export interface User {
  id: string
  email: string
  full_name: string
  phone?: string
  role: 'admin' | 'user'
  created_at: string
}