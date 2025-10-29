import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Colony {
  id: string
  name: string
  location: string
  latitude?: number
  longitude?: number
  coordinates?: string
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  colony_id: string
  contact_type: 'switchboard' | 'manager' | 'minister' | 'postal' | 'school'
  name?: string
  phone?: string
  fax?: string
  email?: string
  street?: string
  city?: string
  zip_code?: string
  extensions?: string
  tollfree?: string
  created_at: string
  updated_at: string
}

export interface ColonyWithContacts extends Colony {
  contacts: Contact[]
}
