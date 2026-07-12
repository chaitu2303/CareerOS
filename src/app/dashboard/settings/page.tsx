import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, Bell, Shield, LogOut } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/');

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and configurations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          <Button variant="secondary" className="w-full justify-start gap-2 bg-muted">
            <User className="w-4 h-4" /> Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:bg-muted">
            <Bell className="w-4 h-4" /> Notifications
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:bg-muted">
            <Shield className="w-4 h-4" /> Security
          </Button>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input defaultValue={user?.name || ''} placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input defaultValue={user?.email || ''} disabled />
                <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI Configuration</CardTitle>
              <CardDescription>Manage how Native Intelligence runs on your device.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-sm">
                <strong>Current Provider:</strong> {process.env.AI_PROVIDER || 'local'}<br/>
                <strong>Current Model:</strong> {process.env.LOCAL_AI_MODEL || 'default'}<br/>
                <span className="text-muted-foreground">Native Intelligence is operating in standard mode.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 items-start">
              <p className="text-sm text-muted-foreground">Log out of your account or permanently delete your data.</p>
              <form action="/api/auth/signout" method="POST">
                <Button variant="destructive" type="submit">Sign Out</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
