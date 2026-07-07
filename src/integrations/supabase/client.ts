import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL || "";
const SUPABASE_PUBLISHABLE_KEY = (import.meta as any).env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

// Mock state so users can still submit forms in the UI even without Supabase credentials connected!
const mockDataStore: Record<string, any[]> = {
  contact_messages: [],
  appointment_requests: [],
  product_inquiries: [],
};

const createMockSupabase = () => {
  console.warn("[Supabase] No API credentials found. Operating in MOCK mode.");
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      signInWithPassword: async ({ email }: { email: string }) => {
        // Return a mock session for admin demo
        return { data: { session: { user: { id: "mock-admin-id", email } } }, error: null };
      },
      signOut: async () => ({ error: null }),
      onAuthStateChange: (cb: any) => {
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: async () => {
              if (table === "user_roles") {
                return { data: { role: "admin" }, error: null };
              }
              return { data: null, error: null };
            }
          }),
          maybeSingle: async () => {
            if (table === "user_roles") {
              return { data: { role: "admin" }, error: null };
            }
            return { data: null, error: null };
          }
        }),
        order: () => ({
          limit: async () => {
            return { data: mockDataStore[table] || [], error: null };
          }
        })
      }),
      insert: async (data: any) => {
        if (!mockDataStore[table]) mockDataStore[table] = [];
        const newRecord = { id: crypto.randomUUID(), created_at: new Date().toISOString(), status: "new", ...data };
        mockDataStore[table].unshift(newRecord);
        return { data: [newRecord], error: null };
      },
      update: (updateData: any) => ({
        eq: async (idField: string, idVal: string) => {
          const list = mockDataStore[table] || [];
          const record = list.find(item => item.id === idVal);
          if (record) {
            Object.assign(record, updateData);
          }
          return { error: null };
        }
      })
    })
  } as any;
};

export const supabase = SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : createMockSupabase();
