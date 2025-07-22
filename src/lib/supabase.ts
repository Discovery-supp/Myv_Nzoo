import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://zfxkyiusextbhhxemwuu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY

// Check if we have valid keys (not placeholders)
const isValidKey = (key: string) => key && !key.includes('ta_clé_publique_supabase') && key.length > 20

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL is required')
}

let supabase: any

if (!supabaseAnonKey || !isValidKey(supabaseAnonKey)) {
  console.error('❌ Invalid Supabase API key detected!')
  console.error('Please update your .env file with a valid VITE_SUPABASE_ANON_KEY')
  console.error('You can find your API key in your Supabase project settings under API > Project API keys > anon public')
  
  // Create a client that will always fail with a clear error message
  const invalidClient = {
    from: () => ({
      insert: () => Promise.reject(new Error('Supabase not configured: Please set a valid VITE_SUPABASE_ANON_KEY in your environment variables')),
      select: () => Promise.reject(new Error('Supabase not configured: Please set a valid VITE_SUPABASE_ANON_KEY in your environment variables')),
      update: () => Promise.reject(new Error('Supabase not configured: Please set a valid VITE_SUPABASE_ANON_KEY in your environment variables')),
      delete: () => Promise.reject(new Error('Supabase not configured: Please set a valid VITE_SUPABASE_ANON_KEY in your environment variables'))
    }),
    auth: {
      signUp: () => Promise.reject(new Error('Supabase not configured: Please set a valid VITE_SUPABASE_ANON_KEY in your environment variables')),
      signInWithPassword: () => Promise.reject(new Error('Supabase not configured: Please set a valid VITE_SUPABASE_ANON_KEY in your environment variables')),
      signOut: () => Promise.reject(new Error('Supabase not configured: Please set a valid VITE_SUPABASE_ANON_KEY in your environment variables')),
      getUser: () => Promise.reject(new Error('Supabase not configured: Please set a valid VITE_SUPABASE_ANON_KEY in your environment variables'))
    }
  }
  
  supabase = invalidClient
} else {
  // Create the real Supabase client
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