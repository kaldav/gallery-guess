import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for the entire app
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Type-safe database types could be defined and exported here
// For example:
// export type Database = {
//   public: {
//     Tables: {
//       // Define your tables here
//     }
//   }
// }