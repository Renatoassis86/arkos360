import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fhvexkhqwudxxkbahxbt.supabase.co'
// Usando a anon key (ou service key no MVP interno temporário) para conectar no banco.
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodmV4a2hxd3VkeHhrYmFoeGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTY3MzI5NCwiZXhwIjoyMDkxMjQ5Mjk0fQ.god6rwZ-wirdP5lfqy4Fa6uPDItz8Vd_Dt-NAWrXl0g'

export const supabase = createClient(supabaseUrl, supabaseKey)
