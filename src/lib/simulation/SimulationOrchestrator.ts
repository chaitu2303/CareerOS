import { prisma } from '@/lib/prisma';

export class SimulationOrchestrator {
  /**
   * Initializes a recruitment simulation blueprint based on domain, role, or job.
   */
  static async createSimulation(userId: string, params: any) {
    const { domainId, roleId, jobId, resumeId, mode } = params;

    // We generate a blueprint. For a real app, this reads from the DomainPack or JobTarget.
    // For this example, we'll construct a mock blueprint.
    const hasSecureCodeExecution = false; // We know this is unconfigured right now.
    const hasAiProvider = !!(process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY);

    // E.g., for Software Engineer: Aptitude -> Coding -> Technical Interview -> HR
    const roundsData = [
      {
        type: 'ASSESSMENT',
        title: 'Quantitative & Logical Aptitude',
        capabilitiesRequired: [],
        status: 'READY',
        orderIndex: 0
      },
      {
        type: 'CODING',
        title: 'Technical Coding Round',
        capabilitiesRequired: ['SECURE_CODE_EXECUTION'],
        status: hasSecureCodeExecution ? 'LOCKED' : 'UNAVAILABLE',
        orderIndex: 1
      },
      {
        type: 'INTERVIEW',
        title: 'Technical Interview',
        capabilitiesRequired: ['AI_PROVIDER'],
        status: hasAiProvider ? 'LOCKED' : 'UNAVAILABLE',
        orderIndex: 2
      },
      {
        type: 'INTERVIEW',
        title: 'HR & Behavioral',
        capabilitiesRequired: ['AI_PROVIDER'],
        status: hasAiProvider ? 'LOCKED' : 'UNAVAILABLE',
        orderIndex: 3
      }
    ];

    const blueprint = {
      rounds: roundsData.length,
      estimatedDurationMinutes: 120,
      domainId,
      roleId
    };

    return await prisma.recruitmentSimulation.create({
      data: {
        userId,
        domainId,
        roleId,
        jobId,
        resumeId,
        mode,
        status: 'READY',
        blueprint,
        rounds: {
          create: roundsData
        }
      },
      include: {
        rounds: { orderBy: { orderIndex: 'asc' } }
      }
    });
  }

  static async startRound(roundId: string) {
    const round = await prisma.recruitmentRound.findUnique({ where: { id: roundId } });
    if (!round) throw new Error('Round not found');

    if (round.status === 'LOCKED') throw new Error('Round is locked');
    if (round.status === 'UNAVAILABLE') throw new Error('Round requires unavailable capabilities');
    
    // Process starting round state machine...
    return await prisma.recruitmentRound.update({
      where: { id: roundId },
      data: { status: 'IN_PROGRESS' }
    });
  }
}
