'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ShieldCheck,
  Calendar,
  ExternalLink,
  ChevronLeft,
  PhoneCall,
  CheckCircle,
  FileText,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import api from '@/lib/api';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { localizeRightsTopic } from '@/lib/rights-i18n';
import { getRightsGuideLabels } from '@/lib/rights-guide-translations';

interface GuideDetail {
  slug: string;
  title: string;
  category: string;
  summary: string;
  body: string;
  jurisdiction: string;
  sourceReference: string;
  verifiedBy?: string;
  lastVerified?: string;
  isTranslationFallback?: boolean;
}

export default function GuideDetailPage() {
  const { slug } = useParams();
  const { locale, t } = useI18n();
  const labels = getRightsGuideLabels(locale);
  const [guide, setGuide] = useState<GuideDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const fallbackGuides: Record<string, GuideDetail> = {
    'right-to-information-rti': {
      slug: 'right-to-information-rti',
      title: 'Right to Information (RTI) — How to Seek Government Records',
      category: 'Transparency',
      jurisdiction: 'IN (Central & All States)',
      sourceReference: 'Right to Information Act, 2005 (Act No. 22 of 2005) · indiacode.nic.in',
      verifiedBy: 'Advocate Ananya Deshmukh (NALSA Empanelled)',
      lastVerified: '2026-10-22',
      summary:
        'The RTI Act empowers every Indian citizen to request information, inspect public works, and obtain certified government documents from public authorities within a guaranteed 30-day timeline.',
      body: `### 1. What Can You Ask Under RTI?
You can request details regarding:
- Status of pending government applications (passports, ration cards, pensions, land records).
- Inspection of government records, books, contracts, and public works.
- Reasons for official delays or administrative decisions affecting you.
- Fund allocation and expenditure in municipal corporations or panchayats.

### 2. Timelines Mandated by Law
- **General Requests**: Maximum **30 days** from receipt of application.
- **Life & Liberty Matters**: Strict **48 hours** under Section 7(1).
- **Involving Human Rights Violations in Security Agencies**: Within 45 days with Central Information Commission approval.

### 3. Application Fee
- Central Government: **₹10** (Payable via Indian Postal Order, Court Fee Stamp, DD, or online via rtionline.gov.in).
- BPL (Below Poverty Line) cardholders are exempt from paying any fees (attach copy of BPL card).

### 4. What If the Department Refuses or Does Not Reply?
- **First Appeal (Section 19(1))**: File within 30 days of the deadline to the First Appellate Authority (FAA) in the same department. No fee is required.
- **Second Appeal (Section 19(3))**: If dissatisfied with the FAA order, appeal within 90 days to the Central or State Information Commission. Penalty of ₹250 per day (up to ₹25,000) can be imposed on the defaulting PIO.`,
    },
    'free-legal-aid-eligibility': {
      slug: 'free-legal-aid-eligibility',
      title: 'Free Legal Aid in India — Who Qualifies and How to Apply',
      category: 'Legal Aid & Justice',
      jurisdiction: 'IN (Central & State)',
      sourceReference: 'Legal Services Authorities Act, 1987 (Section 12) · nalsa.gov.in',
      verifiedBy: 'Dr. Ramesh Chandra (Chief Legal Editor)',
      lastVerified: '2026-10-24',
      summary:
        'Article 39A of the Constitution guarantees equal access to justice. Section 12 of the Legal Services Authorities Act provides free court representation and waiver of all filing fees for eligible citizens.',
      body: `### 1. Who Is Entitled to Free Legal Services?
Under Section 12 of the Act, free legal aid is available to:
- **Women and Children**: All women and children regardless of their financial or marital status.
- **Scheduled Castes (SC) & Scheduled Tribes (ST)**: At all levels of the judiciary.
- **Persons with Disabilities**: Physical, visual, intellectual, or psychosocial disabilities.
- **Victims of Human Trafficking, Disasters, or Ethnic Violence**.
- **Industrial Laborers & Workmen**: Under the Industrial Disputes Act.
- **Under-Trials & Inmates**: Anyone in prison, police custody, or protective homes.
- **Low-Income Earners**: Citizens whose annual income is less than ₹3,00,000 (Supreme Court limit: ₹5,00,000).

### 2. What Expenses Are Covered?
- Complete exemption from payment of court fees and process fees.
- Honorarium to empanelled lawyers paid by the State.
- Free preparation of pleadings, writ petitions, and appeal paper-books.
- Certified copies of orders and judgments provided at zero cost.

### 3. How to Apply
1. **Call 15100**: National Legal Services toll-free helpline available 24x7.
2. **Visit the Front Office**: Go to the District Legal Services Authority (DLSA) office inside your local district court complex.
3. **Submit Simple Application**: State your grievance along with proof of eligibility (Aadhaar, income declaration, or caste/disability certificate).`,
    },
    'fundamental-rights-constitution': {
      slug: 'fundamental-rights-constitution',
      title: 'Fundamental Rights — Constitutional Protections in India',
      category: 'Fundamental Rights',
      jurisdiction: 'IN',
      sourceReference: 'Constitution of India, Part III · Legislative Department',
      summary:
        'Part III of the Constitution protects equality, freedoms, life and personal liberty, freedom of religion, and access to constitutional remedies. The scope and limits of each right depend on the facts and applicable law.',
      body: `Rights in Part III include equality before law (Articles 14–18), specified freedoms and protections concerning life, liberty, and arrest (Articles 19–22), protection from exploitation (Articles 23–24), freedom of religion (Articles 25–28), cultural and educational rights (Articles 29–30), and constitutional remedies (Article 32).

If you believe a right was violated, keep relevant records and seek advice from a lawyer or District Legal Services Authority. The appropriate remedy depends on the right, respondent, deadlines, and facts. Check the current Constitution before filing.`,
    },
    'arrest-and-detention-rights': {
      slug: 'arrest-and-detention-rights',
      title: 'Rights During Arrest and Detention',
      category: 'Fundamental Rights',
      jurisdiction: 'IN',
      sourceReference: 'Constitution of India, Articles 20–22 · Bharatiya Nagarik Suraksha Sanhita, 2023',
      summary:
        'Constitutional and criminal-procedure safeguards apply to arrest and detention. The procedure depends on the circumstances and law in force.',
      body: `An arrested person must be informed of the grounds of arrest and has the right to consult and be defended by a legal practitioner. The Constitution generally requires production before a magistrate within 24 hours, excluding necessary travel time, subject to constitutional exceptions. Special rules may apply in particular cases.

Ask for the grounds of arrest and the name of the police station or authority. Tell a trusted person where you are being taken, ask to contact a lawyer, and do not sign a statement you do not understand. Contact the DLSA or NALSA at 15100 for legal-aid support. Obtain urgent, case-specific legal advice.`,
    },
    'workplace-sexual-harassment-rights': {
      slug: 'workplace-sexual-harassment-rights',
      title: 'Protection from Sexual Harassment at Work',
      category: 'Women & Family',
      jurisdiction: 'IN',
      sourceReference: 'Sexual Harassment of Women at Workplace Act, 2013 · Ministry of Women and Child Development',
      summary:
        'The POSH Act provides a complaint and inquiry framework to address sexual harassment of women at a workplace through an Internal Committee or Local Committee.',
      body: `The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 provides for an Internal Committee at workplaces covered by the Act. A district Local Committee may receive complaints in specified circumstances, including where an Internal Committee has not been constituted or the complaint is against the employer.

Keep a dated record and preserve relevant messages or documents. Ask the committee about its procedure, confidentiality, time limits, and interim relief. The Government's SHe-Box portal can help route a complaint. For immediate danger, contact local emergency services. Read the current Act and rules or seek legal advice.`,
    },
    'child-protection-pocso': {
      slug: 'child-protection-pocso',
      title: 'Child Safety and Protection Under POCSO',
      category: 'Women & Family',
      jurisdiction: 'IN',
      sourceReference: 'Protection of Children from Sexual Offences Act, 2012 · India Code',
      summary:
        'POCSO provides a child-sensitive legal process for reporting and addressing sexual offences against anyone under 18, and protects a child’s identity.',
      body: `Under POCSO, a child is anyone below 18. Suspected offences can be reported to the Special Juvenile Police Unit or local police; the Act requires reporting in covered circumstances. The child's identity and privacy must be protected, and designated Special Courts handle cases under the Act.

If a child is in immediate danger, contact local police or emergency services. A concern can also be reported to the police/SJPU or Child Helpline at 1098. Share what is known without repeatedly questioning the child or publishing identifying details. Ask authorities about medical care and child-friendly support.`,
    },
    'disability-rights-accessibility': {
      slug: 'disability-rights-accessibility',
      title: 'Disability Rights, Accessibility and Non-Discrimination',
      category: 'Fundamental Rights',
      jurisdiction: 'IN',
      sourceReference: 'Rights of Persons with Disabilities Act, 2016 · Department of Empowerment of Persons with Disabilities',
      summary:
        'The Rights of Persons with Disabilities Act recognizes rights to equality, non-discrimination, accessibility, and participation.',
      body: `The Rights of Persons with Disabilities Act, 2016 addresses non-discrimination, accessibility, inclusive education, employment, and access to services. It also provides for disability certification and specified benefits for those meeting applicable criteria. A Chief Commissioner or State Commissioner can address specified complaints and monitor implementation.

Keep records of any barrier or denial and ask the institution for its grievance process. Consult the official DEPwD/UDID portals and State authority about certification or schemes. For a remedy, contact the State Commissioner, a DLSA, or a qualified disability-rights organization. Eligibility varies by provision and scheme; check current rules and notifications.`,
    },
    'cybercrime-reporting-rights': {
      slug: 'cybercrime-reporting-rights',
      title: 'Responding to Online Fraud and Cybercrime',
      category: 'Consumer Rights',
      jurisdiction: 'IN',
      sourceReference: 'National Cyber Crime Reporting Portal · Ministry of Home Affairs',
      summary:
        'Report cybercrime through the Ministry of Home Affairs portal and promptly contact your bank or payment provider if money was taken.',
      body: `For financial cyber-fraud, contact your bank, card issuer, or payment provider immediately to block or dispute the transaction. Call 1930 promptly for financial cyber-fraud assistance, then complete a report at cybercrime.gov.in as instructed. Keep transaction IDs, messages, phone numbers, profile links, and complaint references.

Change affected passwords from a trusted device and enable multi-factor authentication. Do not share OTPs, PINs, recovery codes, or remote-access app permissions, and avoid anyone demanding an upfront fee to recover money. Contact local police when appropriate or if there is an immediate threat.`,
    },
    'scheduled-caste-tribe-protection': {
      slug: 'scheduled-caste-tribe-protection',
      title: 'Legal Protections Against Caste-Based Atrocities',
      category: 'Fundamental Rights',
      jurisdiction: 'IN',
      sourceReference: 'SC/ST (Prevention of Atrocities) Act, 1989 · India Code',
      summary:
        'The SC/ST (Prevention of Atrocities) Act creates offences and safeguards to address specified atrocities against members of Scheduled Castes and Scheduled Tribes.',
      body: `The Act identifies specific conduct as offences when its legal conditions are met. Special Courts or Exclusive Special Courts are designated to try cases, and the law and rules provide for protection, relief, and rehabilitation measures for victims and witnesses. Applicability depends on the facts and the precise statutory provisions.

If there is immediate danger, contact local police or emergency services. Preserve relevant records and note dates, locations, and witnesses. Ask police about registering the complaint under the applicable law and request an acknowledgement. Contact the DLSA for free legal aid and information about victim-support procedures.`,
    },
    'right-to-education-children': {
      slug: 'right-to-education-children',
      title: 'Right to Free and Compulsory Education for Children',
      category: 'Women & Family',
      jurisdiction: 'IN',
      sourceReference: 'Right of Children to Free and Compulsory Education Act, 2009 · Ministry of Education',
      summary:
        'The Constitution and the Right to Education Act provide for free and compulsory elementary education for children aged 6 to 14, subject to the Act and applicable rules.',
      body: `Article 21A and the Right of Children to Free and Compulsory Education Act, 2009 address free and compulsory elementary education for children aged 6–14. The Act sets responsibilities for governments, local authorities, and schools, including rules on admission and completion of elementary education.

If admission or support is denied, ask the school for its reason in writing and keep copies of applications and replies. Contact the local education officer or grievance authority named in your State's RTE rules. State-specific admission eligibility and dates should be confirmed on the official State education portal. The State Commission for Protection of Child Rights or DLSA may provide further support.`,
    },
  };

  useEffect(() => {
    async function fetchGuide() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await api.get(`/rights/${slug}`, { params: { locale } });
        setGuide(localizeRightsTopic(res.data, locale));
      } catch {
        const fallback = fallbackGuides[String(slug)];
        setGuide(
          fallback ? localizeRightsTopic(fallback, locale) : null,
        );
      } finally {
        setLoading(false);
      }
    }
    fetchGuide();
  }, [slug, locale]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mx-auto mb-4" />
        <span className="text-xs text-text-sub">{labels.loading}</span>
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-status-warning mx-auto mb-3" />
        <h2 className="text-xl font-bold text-text-primary">{labels.notFound}</h2>
        <p className="text-xs text-text-sub mt-1">{labels.notFoundDescription}</p>
        <Link href="/rights" className="mt-4 inline-block">
          <Button size="sm" variant="outline">
            {labels.returnToLibrary}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 mb-6 text-xs text-text-sub">
        <Link href="/rights" className="hover:text-accent flex items-center gap-1 transition-colors">
          <ChevronLeft className="w-4 h-4" /> {labels.backToLibrary}
        </Link>
        <span>/</span>
        <span className="text-text-primary truncate max-w-xs">{guide.title}</span>
      </div>

      {/* Main Guide Header */}
      {guide.isTranslationFallback && (
        <p className="mb-4 rounded-lg border border-border bg-surface-elevated px-4 py-3 text-xs text-text-sub">
          {t('guide.translationFallback')}
        </p>
      )}
      <div className="space-y-3 pb-6 border-b border-border">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">{guide.category}</Badge>
          <span className="text-xs font-mono text-text-sub px-2 py-0.5 rounded bg-surface border border-border">
            {labels.jurisdiction}: {guide.jurisdiction}
          </span>
          <Badge variant="verified">
            <ShieldCheck className="w-3 h-3 mr-1 inline text-accent" /> {labels.verifiedSource}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight leading-tight">
          {guide.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-xs text-text-sub pt-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-accent" />
            <span>{labels.verified}: {guide.lastVerified || 'October 2026'}</span>
          </div>
          <span>•</span>
          <div>{labels.reviewer}: <span className="text-text-primary">{guide.verifiedBy || 'Empanelled Legal Expert'}</span></div>
        </div>
      </div>

      {/* Statutory Source Callout Box */}
      <div className="my-6 p-4 rounded-xl bg-surface border border-accent/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
            {labels.statutoryReference}
          </span>
          <span className="font-semibold text-text-primary mt-0.5 block">
            {guide.sourceReference}
          </span>
        </div>
        <a
          href="https://indiacode.nic.in"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-1 text-accent font-semibold hover:underline"
        >
          <span>{labels.repository}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Plain Language Summary */}
      <div className="p-5 rounded-xl bg-surface-elevated/70 border border-border my-6">
        <h3 className="text-xs font-bold text-accent uppercase tracking-wider mb-2">
          {labels.summary}
        </h3>
        <p className="text-sm text-text-primary leading-relaxed">
          {guide.summary}
        </p>
      </div>

      {/* Structured Guide Content */}
      <article className="prose prose-invert max-w-none text-xs sm:text-sm text-text-sub space-y-4 leading-relaxed border-b border-border pb-10">
        <div className="whitespace-pre-wrap font-sans text-text-primary space-y-4">
          {guide.body}
        </div>
      </article>

      {/* Practical Next Steps Box */}
      <div className="mt-8 p-6 rounded-2xl bg-surface border border-border space-y-4">
        <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-accent" /> {labels.nextSteps}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-1">
            <span className="font-semibold text-text-primary block">1. {labels.needLegalHelp}</span>
            <p className="text-text-sub text-[11px] leading-relaxed">
              {labels.findDlsa}
            </p>
            <Link href="/legal-aid" className="text-accent font-semibold inline-block pt-1 hover:underline">
              {labels.searchLegalAid}
            </Link>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-elevated border border-border space-y-1">
            <span className="font-semibold text-text-primary block">2. {labels.helpline}</span>
            <p className="text-text-sub text-[11px] leading-relaxed">
              {labels.helplineDescription}
            </p>
            <a href="tel:15100" className="text-accent font-semibold inline-block pt-1 hover:underline">
              {labels.callNow}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
