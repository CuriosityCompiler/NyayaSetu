'use client';

import React from 'react';
import {
  ShieldCheck,
  Building,
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  FileCheck,
  Scale,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useI18n } from '@/lib/i18n';

export default function SourcesPage() {
  const { t } = useI18n();
  const sources = [
    {
      name: 'National Legal Services Authority (NALSA)',
      scope: 'Legal aid eligibility, procedural application rules, legal aid institutions, and national 15100 helpline.',
      link: 'https://nalsa.gov.in/legal-aid',
      domain: 'nalsa.gov.in',
      verificationMethod: 'Quarterly review against statutory gazette notifications and official NALSA regulations.',
    },
    {
      name: 'India Code — Legislative Department',
      scope: 'Central Acts, sections, rules, regulations, statutory amendments, and legislative references.',
      link: 'https://indiacode.nic.in',
      domain: 'indiacode.nic.in',
      verificationMethod: 'Direct statutory text extraction and cross-verification with official Central Gazette.',
    },
    {
      name: 'Karnataka State Legal Services Authority (KSLSA)',
      scope: 'Karnataka state legal aid contacts, Nyaya Degula offices, and district court legal clinics.',
      link: 'https://karnataka.nalsa.gov.in',
      domain: 'karnataka.nalsa.gov.in',
      verificationMethod: 'Periodic verification against State High Court notifications and official phone directories.',
    },
    {
      name: 'Supreme Court & High Court Judgments',
      scope: 'Authoritative interpretations of constitutional fundamental rights and statutory protections.',
      link: 'https://judgments.ecourts.gov.in',
      domain: 'judgments.ecourts.gov.in',
      verificationMethod: 'Review by empanelled legal advocates and judicial research officers.',
    },
    {
      name: 'RTI Online — Department of Personnel and Training',
      scope: 'Online Right to Information requests and first appeals for participating Central Government public authorities.',
      link: 'https://rtionline.gov.in',
      domain: 'rtionline.gov.in',
      verificationMethod: 'Use the portal instructions to confirm which public authorities and services are covered.',
    },
    {
      name: 'SHe-Box — Ministry of Women and Child Development',
      scope: 'Government portal for submitting and tracking workplace sexual-harassment complaints.',
      link: 'https://shebox.wcd.gov.in/',
      domain: 'shebox.wcd.gov.in',
      verificationMethod: 'Check current complaint routing and guidance on the Ministry portal.',
    },
    {
      name: 'National Cyber Crime Reporting Portal',
      scope: 'Ministry of Home Affairs portal for reporting cybercrime, including financial cyber fraud.',
      link: 'https://cybercrime.gov.in/',
      domain: 'cybercrime.gov.in',
      verificationMethod: 'Use this official reporting portal and follow its current instructions.',
    },
    {
      name: 'eCourts Services',
      scope: 'Court case status, orders, cause lists, and other services from the Indian eCourts system.',
      link: 'https://services.ecourts.gov.in/ecourtindia_v6/',
      domain: 'ecourts.gov.in',
      verificationMethod: 'Confirm case details against the relevant court record and official orders.',
    },
    {
      name: 'National Consumer Helpline',
      scope: 'Consumer grievance information and complaint support provided by the Department of Consumer Affairs.',
      link: 'https://consumerhelpline.gov.in/',
      domain: 'consumerhelpline.gov.in',
      verificationMethod: 'Check current complaint channels and escalation guidance on the Department portal.',
    },
    {
      name: 'CPGRAMS — Public Grievance Portal',
      scope: 'Centralized portal for lodging grievances concerning participating Central Government departments and organizations.',
      link: 'https://pgportal.gov.in/',
      domain: 'pgportal.gov.in',
      verificationMethod: 'Check the portal to confirm the grievance is within its scope and track any reference number.',
    },
    {
      name: 'National Human Rights Commission of India',
      scope: 'Information on the Commission’s human-rights complaint process, functions, and official notices.',
      link: 'https://nhrc.nic.in/',
      domain: 'nhrc.nic.in',
      verificationMethod: 'Review the Commission’s current complaint procedure and jurisdiction guidance.',
    },
    {
      name: 'National Commission for Women',
      scope: 'Information and complaint services concerning women’s rights and related support.',
      link: 'https://ncw.nic.in/',
      domain: 'ncw.nic.in',
      verificationMethod: 'Check current complaint eligibility and procedure on the Commission website.',
    },
    {
      name: 'National Commission for Protection of Child Rights',
      scope: 'Child-rights information, complaint mechanisms, and official programmes.',
      link: 'https://ncpcr.gov.in/',
      domain: 'ncpcr.gov.in',
      verificationMethod: 'Review current child-protection complaint guidance on the Commission website.',
    },
  ];

  const additionalResources = [
    {
      name: 'Constitution of India — Legislative Department',
      scope: 'Official constitutional text, including Fundamental Rights and constitutional remedies.',
      link: 'https://legislative.gov.in/constitution-of-india/',
      domain: 'legislative.gov.in',
    },
    {
      name: 'Bharatiya Nyaya Sanhita, 2023 (BNS)',
      scope: 'The current central penal statute for offences committed after its commencement, subject to statutory savings and special laws.',
      link: 'https://www.indiacode.nic.in/',
      domain: 'indiacode.nic.in',
    },
    {
      name: 'Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)',
      scope: 'Current general criminal procedure, including reporting, investigation, arrest, and trial provisions.',
      link: 'https://www.indiacode.nic.in/',
      domain: 'indiacode.nic.in',
    },
    {
      name: 'Bharatiya Sakshya Adhiniyam, 2023 (BSA)',
      scope: 'Current general evidence law for proceedings, subject to its commencement and transitional provisions.',
      link: 'https://www.indiacode.nic.in/',
      domain: 'indiacode.nic.in',
    },
    {
      name: 'e-Gazette of India',
      scope: 'Central Gazette notifications, commencement dates, amendments, and official government publications.',
      link: 'https://egazette.gov.in/',
      domain: 'egazette.gov.in',
    },
    {
      name: 'Supreme Court of India',
      scope: 'Supreme Court judgments, cause lists, case status, and official court information.',
      link: 'https://www.sci.gov.in/',
      domain: 'sci.gov.in',
    },
    {
      name: 'Supreme Court e-Committee',
      scope: 'Official information about eCourts and judicial technology projects.',
      link: 'https://ecommitteesci.gov.in/',
      domain: 'ecommitteesci.gov.in',
    },
    {
      name: 'National Judicial Data Grid',
      scope: 'Aggregated case pendency and disposal data from participating courts.',
      link: 'https://njdg.ecourts.gov.in/',
      domain: 'njdg.ecourts.gov.in',
    },
    {
      name: 'Supreme Court Legal Services Committee',
      scope: 'Legal-services information for eligible persons seeking assistance in Supreme Court matters.',
      link: 'https://sclsc.gov.in/',
      domain: 'sclsc.gov.in',
    },
    {
      name: 'Department of Justice',
      scope: 'Central government initiatives and information concerning administration of justice.',
      link: 'https://doj.gov.in/',
      domain: 'doj.gov.in',
    },
    {
      name: 'Ministry of Home Affairs',
      scope: 'Central government notifications, policies, and public-safety information within MHA’s remit.',
      link: 'https://www.mha.gov.in/',
      domain: 'mha.gov.in',
    },
    {
      name: 'National Portal of India',
      scope: 'Directory of official central and state government services, departments, and schemes.',
      link: 'https://www.india.gov.in/',
      domain: 'india.gov.in',
    },
    {
      name: 'Digital Police Citizen Services',
      scope: 'Police-related citizen services and links to participating State and Union Territory portals.',
      link: 'https://digitalpolice.gov.in/',
      domain: 'digitalpolice.gov.in',
    },
    {
      name: 'National Crime Records Bureau',
      scope: 'Official crime statistics, publications, and crime-records information.',
      link: 'https://www.ncrb.gov.in/',
      domain: 'ncrb.gov.in',
    },
    {
      name: 'Bureau of Police Research and Development',
      scope: 'Police research, training, publications, and model resources.',
      link: 'https://bprd.nic.in/',
      domain: 'bprd.nic.in',
    },
    {
      name: 'Ministry of Women and Child Development',
      scope: 'Central programmes, policies, and notifications concerning women and children.',
      link: 'https://wcd.gov.in/',
      domain: 'wcd.gov.in',
    },
    {
      name: 'Mission Shakti',
      scope: 'Government programme information and support services for women’s safety and empowerment.',
      link: 'https://missionshakti.wcd.gov.in/',
      domain: 'missionshakti.wcd.gov.in',
    },
    {
      name: 'Department of Empowerment of Persons with Disabilities',
      scope: 'Official disability-rights policies, schemes, and accessibility information.',
      link: 'https://depwd.gov.in/',
      domain: 'depwd.gov.in',
    },
    {
      name: 'Unique Disability ID (UDID)',
      scope: 'Official portal for disability certificates and Unique Disability ID services.',
      link: 'https://www.swavlambancard.gov.in/',
      domain: 'swavlambancard.gov.in',
    },
    {
      name: 'Department of Social Justice and Empowerment',
      scope: 'Central schemes and policies concerning social justice and inclusion.',
      link: 'https://socialjustice.gov.in/',
      domain: 'socialjustice.gov.in',
    },
    {
      name: 'National Commission for Scheduled Castes',
      scope: 'Commission functions and complaint information concerning safeguards for Scheduled Castes.',
      link: 'https://ncsc.nic.in/',
      domain: 'ncsc.nic.in',
    },
    {
      name: 'National Commission for Scheduled Tribes',
      scope: 'Commission functions and complaint information concerning safeguards for Scheduled Tribes.',
      link: 'https://ncst.nic.in/',
      domain: 'ncst.nic.in',
    },
    {
      name: 'National Commission for Minorities',
      scope: 'Commission information and complaint channels concerning notified minority communities.',
      link: 'https://ncm.nic.in/',
      domain: 'ncm.nic.in',
    },
    {
      name: 'National Commission for Backward Classes',
      scope: 'Commission information and constitutional safeguards concerning socially and educationally backward classes.',
      link: 'https://ncbc.nic.in/',
      domain: 'ncbc.nic.in',
    },
    {
      name: 'National Commission for Safai Karamcharis',
      scope: 'Commission information and grievance support concerning Safai Karamcharis.',
      link: 'https://ncsk.nic.in/',
      domain: 'ncsk.nic.in',
    },
    {
      name: 'Ministry of Labour and Employment',
      scope: 'Central labour laws, notifications, policies, and worker-support programmes.',
      link: 'https://labour.gov.in/',
      domain: 'labour.gov.in',
    },
    {
      name: 'Employees’ Provident Fund Organisation',
      scope: 'Provident fund, pension, and employee insurance account services and guidance.',
      link: 'https://www.epfindia.gov.in/',
      domain: 'epfindia.gov.in',
    },
    {
      name: 'Employees’ State Insurance Corporation',
      scope: 'Employee health insurance, benefits, and service information under the ESI system.',
      link: 'https://www.esic.gov.in/',
      domain: 'esic.gov.in',
    },
    {
      name: 'e-Shram',
      scope: 'Government registration and scheme information for unorganised workers.',
      link: 'https://eshram.gov.in/',
      domain: 'eshram.gov.in',
    },
    {
      name: 'Office of the Chief Labour Commissioner (Central)',
      scope: 'Central labour enforcement, conciliation, and complaint-related information.',
      link: 'https://clc.gov.in/',
      domain: 'clc.gov.in',
    },
    {
      name: 'Department of Consumer Affairs',
      scope: 'Consumer-protection laws, policies, and official consumer guidance.',
      link: 'https://consumeraffairs.nic.in/',
      domain: 'consumeraffairs.nic.in',
    },
    {
      name: 'Bureau of Indian Standards',
      scope: 'Product standards, certification, and consumer information about quality and safety.',
      link: 'https://www.bis.gov.in/',
      domain: 'bis.gov.in',
    },
    {
      name: 'Food Safety and Standards Authority of India',
      scope: 'Food-safety standards, licensing information, and consumer complaint resources.',
      link: 'https://www.fssai.gov.in/',
      domain: 'fssai.gov.in',
    },
    {
      name: 'Reserve Bank of India',
      scope: 'Banking regulations, consumer information, and official financial-sector notifications.',
      link: 'https://www.rbi.org.in/',
      domain: 'rbi.org.in',
    },
    {
      name: 'RBI Complaint Management System',
      scope: 'Online complaint channel for eligible complaints against regulated RBI entities.',
      link: 'https://cms.rbi.org.in/',
      domain: 'cms.rbi.org.in',
    },
    {
      name: 'Securities and Exchange Board of India',
      scope: 'Investor education, securities-market regulations, and grievance information.',
      link: 'https://www.sebi.gov.in/',
      domain: 'sebi.gov.in',
    },
    {
      name: 'Insurance Regulatory and Development Authority of India',
      scope: 'Insurance-sector regulations, policyholder information, and grievance escalation guidance.',
      link: 'https://irdai.gov.in/',
      domain: 'irdai.gov.in',
    },
    {
      name: 'Pension Fund Regulatory and Development Authority',
      scope: 'Pension-system regulation and subscriber information, including NPS resources.',
      link: 'https://www.pfrda.org.in/',
      domain: 'pfrda.org.in',
    },
    {
      name: 'Telecom Regulatory Authority of India',
      scope: 'Telecom regulations, consumer information, and complaint-escalation guidance.',
      link: 'https://www.trai.gov.in/',
      domain: 'trai.gov.in',
    },
    {
      name: 'Department of Telecommunications',
      scope: 'Telecom policies, citizen services, and official communications-sector information.',
      link: 'https://dot.gov.in/',
      domain: 'dot.gov.in',
    },
    {
      name: 'Indian Computer Emergency Response Team',
      scope: 'Cybersecurity advisories, incident-reporting guidance, and security resources.',
      link: 'https://www.cert-in.org.in/',
      domain: 'cert-in.org.in',
    },
    {
      name: 'Ministry of Electronics and Information Technology',
      scope: 'Official digital-governance policies, notifications, and IT-related government resources.',
      link: 'https://www.meity.gov.in/',
      domain: 'meity.gov.in',
    },
    {
      name: 'Unique Identification Authority of India',
      scope: 'Aadhaar services, updates, authentication guidance, and grievance information.',
      link: 'https://uidai.gov.in/',
      domain: 'uidai.gov.in',
    },
    {
      name: 'DigiLocker',
      scope: 'Government digital document wallet and issuer-verified document services.',
      link: 'https://www.digilocker.gov.in/',
      domain: 'digilocker.gov.in',
    },
    {
      name: 'Central Vigilance Commission',
      scope: 'Vigilance guidance and complaint information within the Commission’s jurisdiction.',
      link: 'https://cvc.gov.in/',
      domain: 'cvc.gov.in',
    },
    {
      name: 'Lokpal of India',
      scope: 'Official information about the Lokpal’s jurisdiction and complaint process.',
      link: 'https://lokpal.gov.in/',
      domain: 'lokpal.gov.in',
    },
    {
      name: 'Comptroller and Auditor General of India',
      scope: 'Public audit reports and information about the constitutional audit institution.',
      link: 'https://cag.gov.in/',
      domain: 'cag.gov.in',
    },
    {
      name: 'Election Commission of India',
      scope: 'Voter services, election information, and official election-related complaint channels.',
      link: 'https://www.eci.gov.in/',
      domain: 'eci.gov.in',
    },
    {
      name: 'National Green Tribunal',
      scope: 'Environmental tribunal information, case services, and official orders.',
      link: 'https://greentribunal.gov.in/',
      domain: 'greentribunal.gov.in',
    },
    {
      name: 'Central Pollution Control Board',
      scope: 'National pollution-control standards, environmental information, and public resources.',
      link: 'https://cpcb.nic.in/',
      domain: 'cpcb.nic.in',
    },
  ].map((resource) => ({
    ...resource,
    verificationMethod: 'Check the official portal for current scope, eligibility, procedure, and contact details before acting.',
  }));
  const allSources = [...sources, ...additionalResources];
  const [searchQuery, setSearchQuery] = React.useState('');
  const filteredSources = allSources.filter((source) =>
    `${source.name} ${source.scope} ${source.domain}`
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  );

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t('sources.policy')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          {t('sources.title')}
        </h1>
        <p className="mt-2 text-sm text-text-sub max-w-2xl leading-relaxed">
          {t('sources.description')}
        </p>
      </div>

      {/* Core Safety Rule Box */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-card mb-10">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 text-accent flex items-center justify-center shrink-0">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-text-primary">{t('sources.rule')}</h3>
            <p className="text-xs text-text-sub mt-1 leading-relaxed">
              &quot;The portal may simplify official legal information into plain, understandable language, but it must not invent laws, fabricate government contact details, or present AI-generated conclusions as verified legal advice.&quot;
            </p>
          </div>
        </div>
      </div>

      {/* Approved Sources Inventory Table */}
      <div className="space-y-4 mb-12">
        <h2 className="text-xl font-bold text-text-primary">{t('sources.hierarchy')}</h2>
        <label className="block">
          <span className="sr-only">Search official resources</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search laws, agencies, and services"
            className="w-full max-w-xl rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-sub focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>
        <p className="text-xs text-text-sub" aria-live="polite">
          Showing {filteredSources.length} of {allSources.length} official resources
        </p>
        <div className="grid grid-cols-1 gap-4">
          {filteredSources.map((s) => (
            <Card key={s.name} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary text-sm">{s.name}</span>
                  <Badge variant="verified" size="sm">
                    {s.domain}
                  </Badge>
                </div>
                <p className="text-xs text-text-sub leading-relaxed max-w-2xl">
                  {s.scope}
                </p>
                <div className="text-[11px] text-accent flex items-center gap-1 pt-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{s.verificationMethod}</span>
                </div>
              </div>

              <a
                href={s.link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button size="sm" variant="outline" rightIcon={<ExternalLink className="w-3.5 h-3.5 ml-1" />}>
                  {t('sources.inspect')}
                </Button>
              </a>
            </Card>
          ))}
          {filteredSources.length === 0 && (
            <p className="rounded-xl border border-border bg-surface p-5 text-sm text-text-sub">
              No official resources match that search. Try a law, agency, or service name.
            </p>
          )}
        </div>
      </div>

      {/* Report an Error / Correction Workflow */}
      <div className="p-6 rounded-2xl bg-surface-elevated border border-border">
        <h3 className="text-base font-bold text-text-primary">{t('sources.report')}</h3>
        <p className="text-xs text-text-sub mt-1 leading-relaxed max-w-2xl">
          {t('sources.reportText')}
        </p>
        <div className="mt-4 flex gap-3">
          <a href="mailto:corrections@nyayasetu.gov.in">
            <Button size="sm" variant="primary">
              {t('sources.submit')}
            </Button>
          </a>
          <a href="tel:15100">
            <Button size="sm" variant="outline">
              NALSA Central Desk (15100)
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
