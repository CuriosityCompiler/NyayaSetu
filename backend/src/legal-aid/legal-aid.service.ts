import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryLegalAidDto } from './dto/query-legal-aid.dto';
import { VerificationStatus } from '@prisma/client';

@Injectable()
export class LegalAidService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryLegalAidDto) {
    const where: any = {
      verificationStatus: { in: [VerificationStatus.VERIFIED, VerificationStatus.UNVERIFIED] },
    };

    if (query.state) {
      where.state = { equals: query.state, mode: 'insensitive' };
    }

    if (query.district) {
      where.district = { equals: query.district, mode: 'insensitive' };
    }

    if (query.q) {
      where.OR = [
        { authority: { contains: query.q, mode: 'insensitive' } },
        { address: { contains: query.q, mode: 'insensitive' } },
        { district: { contains: query.q, mode: 'insensitive' } },
        { state: { contains: query.q, mode: 'insensitive' } },
      ];
    }

    return this.prisma.legalAidContact.findMany({
      where,
      orderBy: [{ state: 'asc' }, { authority: 'asc' }],
    });
  }

  async findById(id: string) {
    const contact = await this.prisma.legalAidContact.findUnique({
      where: { id },
    });

    if (!contact) {
      throw new NotFoundException(`Legal aid authority with id '${id}' not found`);
    }

    return contact;
  }

  async getStates() {
    const states = await this.prisma.legalAidContact.findMany({
      select: { state: true },
      distinct: ['state'],
      orderBy: { state: 'asc' },
    });

    return states.map((s) => s.state);
  }

  async getDistricts(state: string) {
    const districts = await this.prisma.legalAidContact.findMany({
      where: { state: { equals: state, mode: 'insensitive' } },
      select: { district: true },
      distinct: ['district'],
      orderBy: { district: 'asc' },
    });

    return districts.map((d) => d.district).filter(Boolean);
  }

  getEligibilityCriteria() {
    return {
      nationalHelpline: '15100',
      source: 'National Legal Services Authority (NALSA) - Legal Services Authorities Act, 1987 (Section 12)',
      officialLink: 'https://nalsa.gov.in/legal-aid',
      eligibleCategories: [
        {
          category: 'Women and Children',
          description: 'All women and children irrespective of income or financial status.',
          requiredDocuments: ['Identity proof (Aadhaar / Voter ID / Passport)'],
        },
        {
          category: 'Scheduled Castes and Scheduled Tribes',
          description: 'Members of SC/ST communities irrespective of income ceiling.',
          requiredDocuments: ['Caste Certificate / Community Certificate'],
        },
        {
          category: 'Persons with Disabilities',
          description: 'Persons with disability as defined in the Rights of Persons with Disabilities Act, 2016.',
          requiredDocuments: ['Disability Certificate / UDID Card'],
        },
        {
          category: 'Victims of Trafficking & Beggary',
          description: 'Human trafficking victims or victims of mass disasters, ethnic violence, or flood/earthquake.',
          requiredDocuments: ['Police FIR or local administrative relief certificate if available'],
        },
        {
          category: 'Industrial Workmen',
          description: 'Workmen entitled to relief under the Industrial Disputes Act, 1947.',
          requiredDocuments: ['Employment proof or employer identification'],
        },
        {
          category: 'Persons in Custody',
          description: 'Under-trials, juvenile home detainees, psychiatric facility inmates.',
          requiredDocuments: ['Custody memo or jail authority verification'],
        },
        {
          category: 'Low-Income Citizens',
          description:
            'Citizens whose annual income is less than ₹3,00,000 (varies by State: ₹1,00,000 to ₹3,00,000 as per respective SLSA rules). For Supreme Court Legal Services, annual income below ₹5,00,000.',
          requiredDocuments: ['Income Certificate / BPL Card / Ration Card / Self-declaration affidavit'],
        },
      ],
      legalServicesProvided: [
        'Payment of court fee, process fee, and all other charges payable in proceedings',
        'Providing advocate in legal proceedings free of cost',
        'Obtaining and supply of certified copies of orders, judgments, and evidence',
        'Preparation of appeal, paper-book, and translation of documents',
        'Free pre-litigation mediation and Lok Adalat dispute settlement',
      ],
    };
  }
}
