import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export class CertificateEngine {
  static async issueCertificate(userId: string, title: string, track: string, score: number | null, competencies: string[], evidence: any) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    // Generate difficult-to-enumerate certificate ID (like C-ABCD-1234-WXYZ)
    const rawId = crypto.randomBytes(6).toString('hex').toUpperCase();
    const certificateCode = `CRT-${rawId.slice(0,4)}-${rawId.slice(4,8)}-${rawId.slice(8,12)}`;

    const cert = await prisma.certificate.create({
      data: {
        userId,
        certificateCode,
        title,
        track,
        score,
        competencies: JSON.stringify(competencies),
        status: 'VALID',
        credentialVersion: '1.0'
      }
    });
    
    return await prisma.certificate.update({
      where: { id: cert.id },
      data: {
        pdfUrl: `/api/certificates/${certificateCode}/download`,
        qrUrl: null
      }
    });
  }

  static async revokeCertificate(certificateCode: string) {
    return await prisma.certificate.update({
      where: { certificateCode },
      data: { status: 'REVOKED' }
    });
  }
}
