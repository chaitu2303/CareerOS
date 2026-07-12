import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { BookOpen, Search, Code, Layout, Database, Server, ChevronRight, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const dynamic = 'force-dynamic';

const modules = [
  {
    id: 'frontend',
    title: 'Frontend Engineering',
    description: 'Master React, Next.js, and CSS architecture.',
    icon: Layout,
    color: 'text-blue-500',
    bg: 'bg-blue-500/10',
    progress: 45,
    topics: ['React Hooks', 'State Management', 'CSS Grid & Flexbox', 'Web Performance']
  },
  {
    id: 'backend',
    title: 'Backend Engineering',
    description: 'Learn Node.js, APIs, and microservices.',
    icon: Server,
    color: 'text-green-500',
    bg: 'bg-green-500/10',
    progress: 12,
    topics: ['REST vs GraphQL', 'Authentication', 'Message Queues', 'Docker']
  },
  {
    id: 'database',
    title: 'Database Design',
    description: 'Master SQL, schema design, and query optimization.',
    icon: Database,
    color: 'text-orange-500',
    bg: 'bg-orange-500/10',
    progress: 0,
    topics: ['Normalization', 'Indexing', 'NoSQL vs SQL', 'Transactions']
  },
  {
    id: 'algorithms',
    title: 'Data Structures & Algorithms',
    description: 'Crush the coding interview.',
    icon: Code,
    color: 'text-purple-500',
    bg: 'bg-purple-500/10',
    progress: 80,
    topics: ['Arrays & Strings', 'Trees & Graphs', 'Dynamic Programming', 'Sorting']
  }
];

export default async function LearnPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/');

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
            <BookOpen className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Department Practice</h1>
            <p className="text-muted-foreground">Master the skills required for your target role.</p>
          </div>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-muted-foreground" />
          <Input 
            placeholder="Search modules..." 
            className="pl-10 h-11 rounded-xl bg-muted/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modules.map((mod) => (
          <div key={mod.id} className="bg-card p-6 rounded-3xl border border-border/50 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl ${mod.bg} flex items-center justify-center`}>
                <mod.icon className={`w-6 h-6 ${mod.color}`} />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full group-hover:bg-primary group-hover:text-primary-foreground">
                <PlayCircle className="w-5 h-5" />
              </Button>
            </div>
            
            <h2 className="text-xl font-bold mb-2">{mod.title}</h2>
            <p className="text-muted-foreground text-sm mb-6 h-10">{mod.description}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-xs font-semibold">
                <span>Progress</span>
                <span>{mod.progress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${mod.progress > 0 ? 'bg-primary' : ''} transition-all duration-1000`} 
                  style={{ width: `${mod.progress}%` }} 
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Key Topics</p>
              <div className="flex flex-wrap gap-2">
                {mod.topics.map(topic => (
                  <span key={topic} className="px-2 py-1 bg-muted/50 text-xs font-medium rounded-md">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
