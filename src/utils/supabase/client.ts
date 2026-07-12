import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
        getSession: async () => ({ data: { session: null }, error: new Error('Supabase not configured') }),
      },
      storage: {
        from: (bucket: string) => ({
          upload: async () => ({ data: null, error: new Error('Storage unavailable') })
        })
      }
    } as any;
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  )
}
