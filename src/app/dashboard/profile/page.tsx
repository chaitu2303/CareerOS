import { redirect } from 'next/navigation';

// /dashboard/profile → /dashboard (ProfileWorkspace is on the main dashboard)
export default function ProfileRedirect() {
  redirect('/dashboard');
}
