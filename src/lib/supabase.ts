import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://prdigwmezbxiqjqqqxeg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByZGlnd21lemJ4aXFqcXFxeGVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDIxNTEsImV4cCI6MjA3NjgxODE1MX0.ft8z0A-j24uzWzq3vix4t4GFY31m1UjlhvzsPHkrPQQ'

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
