'use client';

import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Building,
  HelpCircle,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import api from '@/lib/api';
import { DirectoryCard, LegalAidItem } from '@/components/dashboard/DirectoryCard';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';

const legalAidResources = [
  {
    name: 'Apply for Free Legal Aid',
    description: 'Check eligibility and learn how to approach a Legal Services Authority.',
    url: 'https://nalsa.gov.in/legal-aid',
    domain: 'nalsa.gov.in',
  },
  {
    name: 'Tele-Law',
    description: 'Explore government-supported pre-litigation legal advice through the Tele-Law service.',
    url: 'https://tele-law.in/',
    domain: 'tele-law.in',
  },
  {
    name: 'Supreme Court Legal Services Committee',
    description: 'Learn about legal services for eligible people seeking assistance before the Supreme Court.',
    url: 'https://sclsc.gov.in/',
    domain: 'sclsc.gov.in',
  },
  {
    name: 'Lok Adalat',
    description: 'Read about settlement of eligible pending and pre-litigation disputes through Lok Adalats.',
    url: 'https://nalsa.gov.in/lok-adalat',
    domain: 'nalsa.gov.in',
  },
  {
    name: 'eCourts Services',
    description: 'Look up court case status, orders, and cause lists using official eCourts services.',
    url: 'https://services.ecourts.gov.in/ecourtindia_v6/',
    domain: 'ecourts.gov.in',
  },
  {
    name: 'National Consumer Helpline',
    description: 'Seek consumer grievance guidance and find official complaint channels.',
    url: 'https://consumerhelpline.gov.in/',
    domain: 'consumerhelpline.gov.in',
  },
  {
    name: 'NALSA Victim Compensation Information',
    description: 'Find information about victim compensation schemes and contact the relevant State authority.',
    url: 'https://nalsa.gov.in/compensation-scheme-for-women-victims-survivors-of-sexual-assault-other-crimes-2018',
    domain: 'nalsa.gov.in',
  },
];

export default function LegalAidDirectoryPage() {
  const { t } = useI18n();
  const [contacts, setContacts] = useState<LegalAidItem[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [eligibilityOpen, setEligibilityOpen] = useState<boolean>(false);

  const fallbackContacts: LegalAidItem[] = [
    {
      id: '1',
      authority: 'National Legal Services Authority (NALSA) - HQ',
      state: 'Central / National',
      district: 'New Delhi',
      address: 'B-Block, Additional Building Complex, Supreme Court of India, New Delhi - 110001',
      phone: '15100',
      hours: 'Mon - Fri: 9:30 AM - 6:00 PM (Helpline 24x7)',
      sourceUrl: 'https://nalsa.gov.in',
      verificationStatus: 'VERIFIED',
    },
    {
      id: '2',
      authority: 'Karnataka State Legal Services Authority (KSLSA)',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      address: 'Nyaya Degula, 1st Floor, H. Siddaiah Road, Bengaluru - 560027',
      phone: '080-22111714',
      hours: 'Mon - Sat: 10:00 AM - 5:30 PM (2nd/4th Sat closed)',
      sourceUrl: 'https://karnataka.nalsa.gov.in',
      verificationStatus: 'VERIFIED',
    },
    {
      id: '3',
      authority: 'District Legal Services Authority (DLSA) Bengaluru Urban',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      address: 'City Civil Court Complex, Opp. Mysore Bank, K.G. Road, Bengaluru - 560009',
      phone: '080-22212953',
      hours: 'Mon - Sat: 10:00 AM - 5:00 PM',
      sourceUrl: 'https://karnataka.nalsa.gov.in',
      verificationStatus: 'VERIFIED',
    },
    {
      id: '4',
      authority: 'Delhi State Legal Services Authority (DSLSA)',
      state: 'Delhi',
      district: 'New Delhi',
      address: 'Central Office, Patiala House Courts Complex, New Delhi - 110001',
      phone: '1516',
      hours: 'Mon - Sat: 10:00 AM - 5:00 PM',
      sourceUrl: 'https://dslsa.org',
      verificationStatus: 'VERIFIED',
    },
    {
      id: '5',
      authority: 'Maharashtra State Legal Services Authority (MSLSA)',
      state: 'Maharashtra',
      district: 'Mumbai City',
      address: '105, High Court, PWD Building, Fort, Mumbai - 400032',
      phone: '022-22673962',
      hours: 'Mon - Fri: 10:30 AM - 5:30 PM',
      sourceUrl: 'https://legalservices.maharashtra.gov.in',
      verificationStatus: 'VERIFIED',
    },
    {
      id: '6',
      authority: 'Tamil Nadu State Legal Services Authority (TNSLSA)',
      state: 'Tamil Nadu',
      district: 'Chennai',
      address: 'North Fort Road, High Court Campus, Chennai - 600104',
      phone: '044-25342834',
      hours: 'Mon - Fri: 10:00 AM - 5:45 PM',
      sourceUrl: 'https://tnslsa.tn.gov.in',
      verificationStatus: 'VERIFIED',
    },
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [contactRes, stateRes] = await Promise.all([
          api.get('/legal-aid', {
            params: {
              state: selectedState || undefined,
              district: selectedDistrict || undefined,
              q: searchQuery || undefined,
            },
          }),
          api.get('/legal-aid/states'),
        ]);

        if (Array.isArray(contactRes.data) && contactRes.data.length > 0) {
          setContacts(contactRes.data);
        } else {
          setContacts(fallbackContacts);
        }

        if (Array.isArray(stateRes.data) && stateRes.data.length > 0) {
          setStates(stateRes.data);
        } else {
          setStates(['Karnataka', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'Central / National']);
        }
      } catch {
        setContacts(fallbackContacts);
        setStates(['Karnataka', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'Central / National']);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedState, selectedDistrict, searchQuery]);

  // Load districts when state changes
  useEffect(() => {
    async function loadDistricts() {
      if (!selectedState) {
        setDistricts([]);
        setSelectedDistrict('');
        return;
      }
      try {
        const res = await api.get('/legal-aid/districts', { params: { state: selectedState } });
        if (Array.isArray(res.data)) {
          setDistricts(res.data);
        }
      } catch {
        setDistricts(selectedState === 'Karnataka' ? ['Bengaluru Urban', 'Mysuru', 'Hubballi'] : []);
      }
    }
    loadDistricts();
  }, [selectedState]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ─── Page Title Header ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
            <Building className="w-3.5 h-3.5" />
            <span>{t('aid.directory')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
            {t('aid.title')}
          </h1>
          <p className="mt-2 text-sm text-text-sub max-w-2xl leading-relaxed">
            {t('aid.description')}
          </p>
        </div>

        <Button
          onClick={() => setEligibilityOpen(true)}
          variant="outline"
          size="md"
          leftIcon={<HelpCircle className="w-4 h-4 text-accent" />}
          className="shrink-0"
        >
          {t('aid.qualify')}
        </Button>
      </div>

      {/* ─── National Helpline Banner ─────────────────────────────────── */}
      <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-border shadow-card mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent text-text-inverse flex items-center justify-center font-bold shrink-0">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
              {t('aid.helpline')}
            </span>
            <div className="text-xl sm:text-2xl font-black text-text-primary tracking-tight flex items-center gap-2">
              <span>{t('aid.dial')}</span>
              <span className="text-xs font-normal text-text-sub font-sans">
                {t('aid.operator')}
              </span>
            </div>
          </div>
        </div>

        <a href="tel:15100" className="shrink-0 w-full sm:w-auto">
          <Button size="md" variant="primary" className="w-full sm:w-auto">
            {t('aid.callNow')}
          </Button>
        </a>
      </div>

      {/* ─── State / District Filter Controls ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-surface border border-border mb-8">
        <div>
          <label className="text-[11px] font-semibold text-text-sub uppercase tracking-wider block mb-1.5">
            {t('aid.filterState')}
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              setSelectedDistrict('');
            }}
            className="w-full bg-surface-elevated text-xs text-text-primary px-3 py-2 rounded-lg border border-border focus:border-accent focus:outline-none"
          >
            <option value="">{t('aid.allStates')}</option>
            {states.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-text-sub uppercase tracking-wider block mb-1.5">
            {t('aid.filterDistrict')}
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            disabled={!selectedState || districts.length === 0}
            className="w-full bg-surface-elevated text-xs text-text-primary px-3 py-2 rounded-lg border border-border focus:border-accent focus:outline-none disabled:opacity-50"
          >
            <option value="">
              {t('aid.allDistricts')} {selectedState || t('aid.state')}
            </option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-text-sub uppercase tracking-wider block mb-1.5">
            {t('aid.search')}
          </label>
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-text-sub absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Nyaya Degula, Civil Court..."
              className="w-full bg-surface-elevated text-xs text-text-primary pl-8 pr-3 py-2 rounded-lg border border-border focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ─── Directory Cards Grid ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => (
          <DirectoryCard key={contact.id} contact={contact} />
        ))}
      </div>

      <section className="mt-12" aria-labelledby="legal-aid-resources-heading">
        <div className="mb-4">
          <h2 id="legal-aid-resources-heading" className="text-xl font-bold text-text-primary">
            More Legal Aid Resources
          </h2>
          <p className="mt-1 text-xs text-text-sub">
            Official services for legal advice, court information, settlement, and grievance support.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {legalAidResources.map((resource) => (
            <Card key={resource.name} className="flex flex-col justify-between gap-4">
              <div>
                <Badge variant="verified" size="sm">{resource.domain}</Badge>
                <h3 className="mt-3 text-sm font-bold text-text-primary">{resource.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-text-sub">{resource.description}</p>
              </div>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
              >
                Visit official resource <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Card>
          ))}
        </div>
      </section>

      {/* ─── Section 12 Eligibility Modal ─────────────────────────────── */}
      <Modal
        isOpen={eligibilityOpen}
        onClose={() => setEligibilityOpen(false)}
        title={t('aid.whoEligible')}
        description={t('aid.eligibilityLaw')}
        className="max-w-2xl max-h-[85vh] overflow-y-auto"
      >
        <div className="space-y-4 text-xs text-text-sub">
          <p className="text-text-primary font-medium">
            Any citizen who falls into one of the following categories is entitled to free legal services:
          </p>

          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-1">
              <span className="font-bold text-text-primary block">1. Women and Children</span>
              <p>All women and children are eligible irrespective of their annual income or wealth.</p>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-1">
              <span className="font-bold text-text-primary block">2. Scheduled Castes & Scheduled Tribes</span>
              <p>Members of SC and ST communities across all court proceedings.</p>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-1">
              <span className="font-bold text-text-primary block">3. Persons with Disabilities</span>
              <p>Disabled individuals as defined under the Rights of Persons with Disabilities Act, 2016.</p>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-1">
              <span className="font-bold text-text-primary block">4. Industrial Laborers</span>
              <p>Workmen covered under the Industrial Disputes Act, 1947.</p>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-1">
              <span className="font-bold text-text-primary block">5. Custody & Prison Inmates</span>
              <p>Under-trials and detainees in psychiatric or protective custody homes.</p>
            </div>

            <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-1">
              <span className="font-bold text-text-primary block">6. Low Income Threshold</span>
              <p>
                Citizens whose annual income is below ₹3,00,000 (standard limit in most States). For matters before the Supreme Court Legal Services Committee, the ceiling is ₹5,00,000.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <span className="text-[11px] text-text-sub">
              To apply, bring Aadhaar and an income or category certificate to your local DLSA.
            </span>
            <Button size="sm" variant="primary" onClick={() => setEligibilityOpen(false)}>
              {t('aid.gotIt')}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
