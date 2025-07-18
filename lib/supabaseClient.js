

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.https://zcatksyjzdqedgcwyono.supabase.co;
const supabaseAnonKey = import.meta.env.eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjYXRrc3lqemRxZWRnY3d5b25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk1Nzg4NTksImV4cCI6MjA2NTE1NDg1OX0.hCCJxEEQy57IHd9GGM7N10Pzzii4XzW5kAsPQ400bP8;


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
