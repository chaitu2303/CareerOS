import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Missing environment variables must fail securely, never silently authenticate a user.
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: new Error('Supabase configuration missing (Unauthorized)') }),
        getSession: async () => ({ data: { session: null }, error: new Error('Supabase configuration missing (Unauthorized)') }),
      },
      storage: {
        from: (bucket: string) => ({
          upload: async () => ({ data: null, error: new Error('Storage unavailable (Unauthorized)') })
        })
      }
    } as any;
  }

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
