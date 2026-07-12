import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock Supabase client that safely handles unavailable states
    return {
      auth: {
        getUser: async () => {
          try {
            const { getCurrentUser } = await import('@/lib/auth/session');
            const nextAuthUser = await getCurrentUser();
            if (nextAuthUser) {
              return { data: { user: { email: nextAuthUser.email, id: nextAuthUser.id } }, error: null };
            }
          } catch {}
          return { data: { user: null }, error: new Error('Supabase not configured') };
        },
        getSession: async () => ({ data: { session: null }, error: new Error('Supabase not configured') }),
      },
      storage: {
        from: (bucket: string) => ({
          upload: async () => ({ data: null, error: new Error('Storage unavailable') })
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
