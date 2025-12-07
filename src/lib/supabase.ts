import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      staff: {
        Row: {
          id: string;
          email: string;
          first_name: string | null;
          last_name: string | null;
          employee_id: string | null;
          role: string[];
          department: string | null;
          status: string;
          manager_id: string | null;
          photo_url: string | null;
          qr_code: string | null;
          hourly_rate: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['staff']['Insert']>;
      };
      jobs: {
        Row: {
          id: string;
          job_number: string;
          customer_id: string;
          status: string;
          quote_id: string | null;
          description: string | null;
          priority: string;
          due_date: string | null;
          drive_folder_id: string | null;
          qr_code: string | null;
          total_quoted: number | null;
          total_actual: number | null;
          created_by: string;
          created_at: string;
          updated_at: string;
          completed_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['jobs']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['jobs']['Insert']>;
      };
      // Add other table types as needed
    };
  };
};
