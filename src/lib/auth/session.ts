import { getServerSession } from "next-auth"
import { prisma } from '@/lib/prisma';

export async function getCurrentUser() {
  const session = await getServerSession();
  
  if (session?.user && (session.user as any).id) {
    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id }
    });
    return user;
  }
  
  // Graceful fallback for CLI/Seed scripts if needed, though strictly we should return null
  return null;
}
