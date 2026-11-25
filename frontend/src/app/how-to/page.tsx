'use client';

import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useI18n } from '@/lib/i18n';

export default function HowToPage() {
  const { t } = useI18n();

  const guides = {
    rti: {
      label: 'RTI request',
      title: 'How to File a Right to Information (RTI) Application',
      statute: 'Right to Information Act, 2005 (Section 6)',
      fee: '₹10 (Free for Below Poverty Line / BPL)',
      timeline: '30 Days (48 Hours for Life & Liberty)',
      steps: [
        {
          num: '01',
          name: 'Identify the Public Authority & PIO',
          desc: 'Determine whether the department belongs to Central Government or State Government. Identify the Central/State Public Information Officer (CPIO / SPIO).',
        },
        {
          num: '02',
          name: 'Draft Your Questions Clearly',
          desc: 'Keep questions objective and numbered (e.g., "Provide certified copies of...", "State daily progress of file no..."). You do NOT need to give any personal reason.',
        },
        {
          num: '03',
          name: 'Submit Application & Pay ₹10 Fee',
          desc: 'Central ministries: Use rtionline.gov.in. Offline: Send via Registered Post with ₹10 Indian Postal Order (IPO) or Court Fee Stamp payable to Accounts Officer.',
        },
        {
          num: '04',
          name: 'File First Appeal if Not Answered in 30 Days',
          desc: 'If no reply arrives within 30 days or info is falsely denied, submit a First Appeal to the designated First Appellate Authority (FAA) within 30 days at zero cost.',
        },
      ],
      officialLink: 'https://rtionline.gov.in',
    },
    consumer: {
      label: 'Consumer complaint',
      title: 'How to File an Online Consumer Complaint (e-Daakhil)',
      statute: 'Consumer Protection Act, 2019 (Section 35)',
      fee: 'Nil for claims up to ₹5 Lakhs (scaled nominal fee thereafter)',
      timeline: 'Admissibility decided within 21 days',
      steps: [
        {
          num: '01',
          name: 'Send Written Notice to Seller/Company',
          desc: 'Send an email or formal registered letter explaining the defect in goods or deficiency in services and demanding replacement or refund within 15 days.',
        },
        {
          num: '02',
          name: 'Register on the e-Daakhil Portal',
          desc: 'Visit edaakhil.nic.in, sign up with mobile OTP, and verify your consumer identity without hiring an advocate.',
        },
        {
          num: '03',
          name: 'Upload Evidence & Statement of Facts',
          desc: 'Attach invoice/bill, warranty card, communications, photos of defective product, and calculation of compensation claimed.',
        },
        {
          num: '04',
          name: 'Track Online & Attend Virtual Hearings',
          desc: 'District Commission serves electronic notice to the company and schedules hearings via video conference.',
        },
      ],
      officialLink: 'https://edaakhil.nic.in',
    },
    lokadalat: {
      label: 'Lok Adalat',
      title: 'How to Settle Disputes at Lok Adalat (Zero Cost & Finality)',
      statute: 'Legal Services Authorities Act, 1987 (Chapter VI)',
      fee: '100% Free (Any previously paid court fee is refunded)',
      timeline: 'Same-day consensual decree',
      steps: [
        {
          num: '01',
          name: 'Check If Your Case is Suitable',
          desc: 'Suitable for compoundable offenses, motor accident claims (MACT), electricity/water bill disputes, cheque bounce (Sec. 138 NI Act), and family disputes.',
        },
        {
          num: '02',
          name: 'Approach DLSA or File Joint Application',
          desc: 'Submit a simple pre-litigation application to the District Legal Services Authority (DLSA) or file a joint memo in the pending court.',
        },
        {
          num: '03',
          name: 'Participate in Pre-Conciliation Sittings',
          desc: 'A conciliator/judge assists both parties to reach an amicable compromise without contentious courtroom cross-examination.',
        },
        {
          num: '04',
          name: 'Receive Final Non-Appealable Award',
          desc: 'The award of the Lok Adalat has the force of a Civil Court decree. No appeal lies against it, ensuring permanent finality.',
        },
      ],
      officialLink: 'https://nalsa.gov.in/lok-adalat',
    },
    fir: {
      label: 'Police complaint',
      title: 'How to Register a Police FIR or Zero FIR',
      statute: 'Bharatiya Nagarik Suraksha Sanhita (BNSS) / CrPC Section 154',
      fee: '100% Free (Copy of FIR must be given immediately at no charge)',
      timeline: 'Immediate for cognizable offences',
      steps: [
        {
          num: '01',
          name: 'Visit Nearest Police Station (Zero FIR)',
          desc: 'For cognizable offenses (theft, assault, robbery, rape), police CANNOT turn you away because the crime took place in another jurisdiction. A "Zero FIR" must be filed.',
        },
        {
          num: '02',
          name: 'State the Facts & Verify Writing',
          desc: 'Narrate date, time, location, suspect details, and sequence of events. Police must record it in writing, read it back to you, and obtain your signature.',
        },
        {
          num: '03',
          name: 'Obtain Free Certified Copy Immediately',
          desc: 'By statutory law, a copy of the FIR with the registered Crime Number must be handed over to you on the spot free of charge.',
        },
        {
          num: '04',
          name: 'Recourse If Police Refuse to Register',
          desc: 'Send the complaint in writing by registered post to the Superintendent of Police (SP) or file a private complaint under Section 175(3) BNSS before the Magistrate.',
        },
      ],
      officialLink: 'https://ncrb.gov.in',
    },
    maintenance: {
      label: 'Senior citizen support',
      title: 'How Senior Citizens Can Claim Maintenance & Evict Abusers',
      statute: 'Maintenance & Welfare of Parents and Senior Citizens Act, 2007',
      fee: 'Nil (Lawyers are barred unless special permission granted)',
      timeline: 'Disposal mandated within 90 days',
      steps: [
        {
          num: '01',
          name: 'Confirm Eligibility',
          desc: 'Must be an Indian citizen aged 60+ (or a parent of any age who cannot maintain themselves from their own earnings or property).',
        },
        {
          num: '02',
          name: 'Submit Application to SDM Tribunal',
          desc: 'File application before the Sub-Divisional Magistrate (SDM) / Maintenance Tribunal in your district against children or legal heirs.',
        },
        {
          num: '03',
          name: 'Claim Monthly Maintenance up to ₹10,000',
          desc: 'The Tribunal directs children to pay monthly maintenance. Failure to pay attracts warrants and imprisonment up to 1 month.',
        },
        {
          num: '04',
          name: 'Revoke Property Gift Deeds (Section 23)',
          desc: 'If property was gifted to children on the condition they care for the senior citizen and they neglect them, the Tribunal declares the transfer void as fraud.',
        },
      ],
      officialLink: 'https://socialjustice.gov.in',
    },
    domesticViolence: {
      label: 'Domestic violence support',
      title: 'How to Seek Help Under the Domestic Violence Act',
      statute: 'Protection of Women from Domestic Violence Act, 2005',
      fee: 'Ask the Protection Officer or DLSA about the applicable process',
      timeline: 'Seek urgent protection immediately if there is danger',
      steps: [
        {
          num: '01',
          name: 'Get to a safe place',
          desc: 'If you are in immediate danger, contact local emergency services or police. Consider reaching a trusted person or support service.',
        },
        {
          num: '02',
          name: 'Contact a Protection Officer or service provider',
          desc: 'Ask the district Women and Child Development office or local authority how to reach the Protection Officer and registered service providers.',
        },
        {
          num: '03',
          name: 'Describe the incidents and relief needed',
          desc: 'Share the relevant facts and any available records. Ask about a Domestic Incident Report and applying to the Magistrate for relief under the Act.',
        },
        {
          num: '04',
          name: 'Request legal aid and support',
          desc: 'Contact the DLSA or call NALSA at 15100 to ask about free legal services. Keep copies of applications and court orders.',
        },
      ],
      officialLink: 'https://www.indiacode.nic.in/',
    },
    workplaceHarassment: {
      label: 'Workplace harassment',
      title: 'How to Report Workplace Sexual Harassment',
      statute: 'Sexual Harassment of Women at Workplace Act, 2013',
      fee: 'No fee is specified for filing an internal complaint',
      timeline: 'The Act generally requires a complaint within 3 months; limited extension may apply',
      steps: [
        {
          num: '01',
          name: 'Record what happened',
          desc: 'Note dates, locations, people involved, and any witnesses. Preserve messages or documents and store them safely.',
        },
        {
          num: '02',
          name: 'Find the appropriate committee',
          desc: 'Contact your workplace Internal Committee. If one is not constituted or the complaint is against the employer, ask the district Local Committee how to proceed.',
        },
        {
          num: '03',
          name: 'Submit a written complaint',
          desc: 'Follow the committee’s process and include the incident details and any supporting records. Ask for assistance if you need help preparing the complaint.',
        },
        {
          num: '04',
          name: 'Track the inquiry and support',
          desc: 'Ask about confidentiality, interim relief, and the next steps. SHe-Box can help route complaints to the appropriate committee.',
        },
      ],
      officialLink: 'https://shebox.wcd.gov.in/',
    },
    cybercrime: {
      label: 'Cybercrime report',
      title: 'How to Report Online Fraud or Cybercrime',
      statute: 'National Cyber Crime Reporting Portal · Ministry of Home Affairs',
      fee: 'No fee to submit a report',
      timeline: 'Report financial fraud immediately; call 1930 promptly',
      steps: [
        {
          num: '01',
          name: 'Contact your bank or payment provider',
          desc: 'Ask them to block the account, card, or transaction and raise a dispute. Do this as soon as possible if money was taken.',
        },
        {
          num: '02',
          name: 'Call 1930 for financial cyber fraud',
          desc: 'Call the national helpline promptly and follow its instructions for completing a report on the official cybercrime portal.',
        },
        {
          num: '03',
          name: 'Submit the online report',
          desc: 'Use cybercrime.gov.in and provide the requested details. Save the acknowledgement or reference number.',
        },
        {
          num: '04',
          name: 'Preserve evidence and secure accounts',
          desc: 'Keep transaction IDs, messages, phone numbers, and links. Change affected passwords from a trusted device and never share OTPs or recovery codes.',
        },
      ],
      officialLink: 'https://cybercrime.gov.in/',
    },
    childProtection: {
      label: 'Child protection',
      title: 'How to Report a Child-Safety Concern',
      statute: 'Protection of Children from Sexual Offences Act, 2012',
      fee: 'No fee to report a concern',
      timeline: 'Contact authorities immediately if a child may be at risk',
      steps: [
        {
          num: '01',
          name: 'Address immediate safety',
          desc: 'If a child is in immediate danger, contact local police or emergency services. Do not confront a suspected offender if that could increase risk.',
        },
        {
          num: '02',
          name: 'Report to the appropriate authority',
          desc: 'Contact local police, the Special Juvenile Police Unit, or Child Helpline 1098. POCSO requires reporting in circumstances covered by the Act.',
        },
        {
          num: '03',
          name: 'Share information without repeated questioning',
          desc: 'Provide what you know and preserve relevant records. Let trained authorities speak with the child using child-sensitive procedures.',
        },
        {
          num: '04',
          name: 'Protect the child’s identity',
          desc: 'Do not post the child’s name, image, school, or identifying details online. Ask authorities about medical care and support services.',
        },
      ],
      officialLink: 'https://www.indiacode.nic.in/',
    },
    disabilityCertificate: {
      label: 'Disability certificate',
      title: 'How to Apply for Disability Certification',
      statute: 'Rights of Persons with Disabilities Act, 2016 · UDID Project',
      fee: 'Check the current official portal for applicable charges',
      timeline: 'Depends on medical assessment and the issuing authority',
      steps: [
        {
          num: '01',
          name: 'Use the official UDID portal',
          desc: 'Visit the Government’s Unique Disability ID portal and review current eligibility, document, and application instructions.',
        },
        {
          num: '02',
          name: 'Submit the application and records',
          desc: 'Complete the application with the requested identity, address, photograph, and medical information. Keep the application number.',
        },
        {
          num: '03',
          name: 'Attend the medical assessment',
          desc: 'Follow instructions from the designated medical authority and bring relevant medical records and identification.',
        },
        {
          num: '04',
          name: 'Track the application or ask for help',
          desc: 'Use the portal to check status. If the application is delayed or denied, contact the issuing authority or State Commissioner for Persons with Disabilities.',
        },
      ],
      officialLink: 'https://www.swavlambancard.gov.in/',
    },
    rtiAppeal: {
      label: 'RTI appeal',
      title: 'How to Appeal an RTI Response or Delay',
      statute: 'Right to Information Act, 2005 (Sections 19(1) and 19(3))',
      fee: 'First appeal to a Central authority is generally free; check applicable State rules',
      timeline: 'First appeal is generally due within 30 days; second appeal generally within 90 days',
      steps: [
        {
          num: '01',
          name: 'Keep the request and response',
          desc: 'Save the RTI application, proof of filing, fee receipt, reply, and any documents received.',
        },
        {
          num: '02',
          name: 'Identify the First Appellate Authority',
          desc: 'Use the public authority’s RTI disclosure or reply to identify the designated First Appellate Authority (FAA).',
        },
        {
          num: '03',
          name: 'File a reasoned first appeal',
          desc: 'Explain the delay, refusal, or incomplete response and state the information or relief sought. Follow the relevant Central or State procedure.',
        },
        {
          num: '04',
          name: 'Consider a second appeal',
          desc: 'If the FAA decision does not resolve the issue, consult the relevant Central or State Information Commission’s current rules and filing instructions.',
        },
      ],
      officialLink: 'https://rtionline.gov.in/',
    },
    caseStatus: {
      label: 'Court case status',
      title: 'How to Check Court Case Status Online',
      statute: 'eCourts Services · eCommittee, Supreme Court of India',
      fee: 'No fee to view public case information',
      timeline: 'Online status depends on court data updates',
      steps: [
        {
          num: '01',
          name: 'Open the official eCourts service',
          desc: 'Use the eCourts Services portal or official mobile application. Avoid unofficial sites that request unnecessary personal information.',
        },
        {
          num: '02',
          name: 'Choose the court and search option',
          desc: 'Select the State, district, and court complex. Search using the case number, party name, advocate name, or other available identifier.',
        },
        {
          num: '03',
          name: 'Review status and orders',
          desc: 'Check the case history, next hearing date, and any available orders. Confirm important information with the court registry or your lawyer.',
        },
        {
          num: '04',
          name: 'Keep the official case details',
          desc: 'Save or note the case number and check the official court record again before acting; online data may not reflect a recent update.',
        },
      ],
      officialLink: 'https://services.ecourts.gov.in/ecourtindia_v6/',
    },
    publicGrievance: {
      label: 'Government grievance',
      title: 'How to File a Central Government Grievance',
      statute: 'Centralized Public Grievance Redress and Monitoring System (CPGRAMS)',
      fee: 'No fee to lodge a grievance',
      timeline: 'Resolution time depends on the department and grievance',
      steps: [
        {
          num: '01',
          name: 'Check that CPGRAMS is the right channel',
          desc: 'The portal covers eligible Central Government departments and organizations. State Government grievances may need a State portal.',
        },
        {
          num: '02',
          name: 'Prepare a clear description',
          desc: 'State the issue, dates, department, and remedy requested. Include relevant reference numbers and avoid unnecessary personal or sensitive data.',
        },
        {
          num: '03',
          name: 'Submit through the official portal',
          desc: 'Register or sign in at pgportal.gov.in and lodge the grievance with copies of relevant documents.',
        },
        {
          num: '04',
          name: 'Track and provide feedback',
          desc: 'Keep the registration number, use the portal to track progress, and follow its appeal or feedback instructions if you are dissatisfied.',
        },
      ],
      officialLink: 'https://pgportal.gov.in/',
    },
  };

  type GuideTab = keyof typeof guides;
  const [activeTab, setActiveTab] = useState<GuideTab>('rti');
  const guideTabs = Object.entries(guides) as [GuideTab, (typeof guides)[GuideTab]][];
  const translatedTabLabels: Partial<Record<GuideTab, string>> = {
    rti: t('howto.rti'),
    consumer: t('howto.consumer'),
    lokadalat: t('howto.lokadalat'),
    fir: t('howto.fir'),
    maintenance: t('howto.maintenance'),
  };
  const current = guides[activeTab];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
          <FileText className="w-3.5 h-3.5" />
          <span>{t('howto.toolkits')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          {t('howto.title')}
        </h1>
        <p className="mt-2 text-sm text-text-sub max-w-2xl leading-relaxed">
          {t('howto.description')}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-4 mb-8">
        {guideTabs.map(([key, guide]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === key
                ? 'bg-accent text-text-inverse shadow-sm'
                : 'bg-surface border border-border text-text-sub hover:text-text-primary'
            }`}
          >
            {translatedTabLabels[key] || guide.label}
          </button>
        ))}
      </div>

      {/* Main Guide View */}
      <div className="space-y-6">
        {/* Summary Card */}
        <div className="p-6 rounded-2xl bg-surface border border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                {current.statute}
              </span>
              <h2 className="text-2xl font-bold text-text-primary mt-1">
                {current.title}
              </h2>
            </div>
            <a
              href={current.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button size="sm" variant="outline" rightIcon={<ExternalLink className="w-3.5 h-3.5 ml-1" />}>
                {t('howto.official')}
              </Button>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-border/60 text-xs">
            <div className="flex items-center gap-2 text-text-sub">
              <span className="font-semibold text-text-primary">{t('howto.fee')}</span>
              <span className="text-accent font-medium">{current.fee}</span>
            </div>
            <div className="flex items-center gap-2 text-text-sub">
              <Clock className="w-4 h-4 text-accent" />
              <span className="font-semibold text-text-primary">{t('howto.timeline')}</span>
              <span>{current.timeline}</span>
            </div>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {current.steps.map((st) => (
            <div
              key={st.num}
              className="p-5 rounded-xl bg-surface border border-border flex flex-col justify-between hover:border-accent/40 transition-colors"
            >
              <div>
                <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 text-accent font-bold text-sm flex items-center justify-center mb-3">
                  {st.num}
                </div>
                <h3 className="text-base font-semibold text-text-primary">{st.name}</h3>
                <p className="text-xs text-text-sub mt-2 leading-relaxed">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
