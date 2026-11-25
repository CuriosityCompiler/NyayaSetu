'use client';

import React, { useState, useEffect } from 'react';
import { BookOpen, Filter, Search, ShieldCheck } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import api from '@/lib/api';
import { TopicCard, TopicItem } from '@/components/dashboard/TopicCard';
import { Badge } from '@/components/ui/Badge';
import { localizeRightsTopic } from '@/lib/rights-i18n';

export default function RightsPage() {
  const { locale, t } = useI18n();
  const [topics, setTopics] = useState<TopicItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const fallbackTopics: TopicItem[] = [
    {
      id: '1',
      slug: 'right-to-information-rti',
      category: 'Transparency',
      title: 'Right to Information (RTI) — How to Seek Government Records',
      summary:
        'The RTI Act empowers every Indian citizen to request information, inspect public work, and obtain certified government records within 30 days for a nominal fee of ₹10.',
      sourceReference: 'RTI Act 2005 (Act No. 22 of 2005)',
      jurisdiction: 'IN',
    },
    {
      id: '2',
      slug: 'free-legal-aid-eligibility',
      category: 'Legal Aid & Justice',
      title: 'Free Legal Aid in India — Who Qualifies and How to Apply',
      summary:
        'Under Section 12 of the Legal Services Authorities Act, eligible citizens including women, children, SC/ST individuals, persons with disabilities, and low-income earners are provided free legal counsel and court fee waivers.',
      sourceReference: 'Legal Services Authorities Act, 1987 (Sec. 12)',
      jurisdiction: 'IN',
    },
    {
      id: '3',
      slug: 'protection-of-women-domestic-violence',
      category: 'Women & Family',
      title: 'Protection from Domestic Violence — Immediate Relief & Rights',
      summary:
        'PWDVA 2005 provides women protection against physical, emotional, sexual, and economic abuse in shared households, guaranteeing right to residence, protection orders, and monetary relief.',
      sourceReference: 'PWDVA, 2005 · indiacode.nic.in',
      jurisdiction: 'IN',
    },
    {
      id: '4',
      slug: 'consumer-protection-rights',
      category: 'Consumer Rights',
      title: 'Consumer Protection — Fighting Defective Products & Misleading Ads',
      summary:
        'Under CPA 2019, consumers can file online complaints via e-Daakhil without hiring a lawyer, claiming compensation for defective goods, deficiency of service, and unfair trade practices.',
      sourceReference: 'Consumer Protection Act, 2019 · e-daakhil.nic.in',
      jurisdiction: 'IN',
    },
    {
      id: '5',
      slug: 'senior-citizens-maintenance-welfare',
      category: 'Elder Rights',
      title: 'Senior Citizens Rights — Maintenance and Eviction Protection',
      summary:
        'Senior citizens (age 60+) and parents can claim monthly maintenance from children or legal heirs through simplified Maintenance Tribunals, with decisions mandated within 90 days.',
      sourceReference: 'Maintenance and Welfare of Parents Act, 2007',
      jurisdiction: 'IN',
    },
    {
      id: '6',
      slug: 'fundamental-rights-constitution',
      category: 'Fundamental Rights',
      title: 'Fundamental Rights — Constitutional Protections in India',
      summary:
        'Part III of the Constitution protects equality, freedoms, life and personal liberty, freedom of religion, and access to constitutional remedies.',
      sourceReference: 'Constitution of India, Part III',
      jurisdiction: 'IN',
    },
    {
      id: '7',
      slug: 'arrest-and-detention-rights',
      category: 'Fundamental Rights',
      title: 'Rights During Arrest and Detention',
      summary:
        'Constitutional and criminal-procedure safeguards apply to arrest and detention. The procedure depends on the circumstances and law in force.',
      sourceReference: 'Constitution of India, Articles 20–22 · BNSS, 2023',
      jurisdiction: 'IN',
    },
    {
      id: '8',
      slug: 'workplace-sexual-harassment-rights',
      category: 'Women & Family',
      title: 'Protection from Sexual Harassment at Work',
      summary:
        'The POSH Act provides a complaint and inquiry framework through an Internal Committee or Local Committee.',
      sourceReference: 'Sexual Harassment of Women at Workplace Act, 2013',
      jurisdiction: 'IN',
    },
    {
      id: '9',
      slug: 'child-protection-pocso',
      category: 'Women & Family',
      title: 'Child Safety and Protection Under POCSO',
      summary:
        'POCSO provides a child-sensitive legal process for reporting and addressing sexual offences against anyone under 18.',
      sourceReference: 'Protection of Children from Sexual Offences Act, 2012',
      jurisdiction: 'IN',
    },
    {
      id: '10',
      slug: 'disability-rights-accessibility',
      category: 'Fundamental Rights',
      title: 'Disability Rights, Accessibility and Non-Discrimination',
      summary:
        'The Rights of Persons with Disabilities Act recognizes rights to equality, accessibility, and participation.',
      sourceReference: 'Rights of Persons with Disabilities Act, 2016',
      jurisdiction: 'IN',
    },
    {
      id: '11',
      slug: 'cybercrime-reporting-rights',
      category: 'Consumer Rights',
      title: 'Responding to Online Fraud and Cybercrime',
      summary:
        'Report cybercrime through the Ministry of Home Affairs portal and promptly contact your bank or payment provider if money was taken.',
      sourceReference: 'National Cyber Crime Reporting Portal · Ministry of Home Affairs',
      jurisdiction: 'IN',
    },
    {
      id: '12',
      slug: 'scheduled-caste-tribe-protection',
      category: 'Fundamental Rights',
      title: 'Legal Protections Against Caste-Based Atrocities',
      summary:
        'The SC/ST (Prevention of Atrocities) Act creates offences and safeguards to address specified atrocities.',
      sourceReference: 'SC/ST (Prevention of Atrocities) Act, 1989',
      jurisdiction: 'IN',
    },
    {
      id: '13',
      slug: 'right-to-education-children',
      category: 'Women & Family',
      title: 'Right to Free and Compulsory Education for Children',
      summary:
        'The Constitution and the Right to Education Act provide for free and compulsory elementary education for children aged 6 to 14.',
      sourceReference: 'Right of Children to Free and Compulsory Education Act, 2009',
      jurisdiction: 'IN',
    },
  ];

  useEffect(() => {
    async function fetchRights() {
      setLoading(true);
      try {
        const res = await api.get('/rights', { params: { locale } });
        if (Array.isArray(res.data) && res.data.length > 0) {
          const combinedTopics = new Map<string, TopicItem>();
          fallbackTopics.forEach((topic) =>
            combinedTopics.set(topic.slug, {
              ...localizeRightsTopic(topic, locale),
            }),
          );
          res.data.forEach((topic: TopicItem) =>
            combinedTopics.set(topic.slug, localizeRightsTopic(topic, locale)),
          );
          setTopics(Array.from(combinedTopics.values()));
        } else {
          setTopics(
            fallbackTopics.map((topic) => localizeRightsTopic(topic, locale)),
          );
        }
      } catch {
        setTopics(
          fallbackTopics.map((topic) => localizeRightsTopic(topic, locale)),
        );
      } finally {
        setLoading(false);
      }
    }
    fetchRights();
  }, [locale]);

  const fixedCategories = [
    { source: 'All', label: t('rights.all') },
    { source: 'Transparency', label: t('rights.transparency') },
    { source: 'Legal Aid & Justice', label: t('rights.legalAid') },
    { source: 'Women & Family', label: t('rights.womenFamily') },
    { source: 'Consumer Rights', label: t('rights.consumer') },
    { source: 'Elder Rights', label: t('rights.elder') },
  ];
  const knownCategories = new Set(fixedCategories.map(({ source }) => source));
  const categories = [
    ...fixedCategories,
    ...Array.from(new Set(topics.map((topic) => topic.category)))
      .filter((category) => !knownCategories.has(category))
      .map((category) => ({ source: category, label: category })),
  ];

  const filteredTopics = topics.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      searchQuery === '' ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t('rights.library')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
          {t('rights.title')}
        </h1>
        <p className="mt-2 text-sm text-text-sub max-w-2xl leading-relaxed">
          {t('rights.description')}
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between pb-6 mb-8 border-b border-border/80">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(({ source, label }) => (
            <button
              key={source}
              onClick={() => setSelectedCategory(source)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedCategory === source
                  ? 'bg-accent text-text-inverse font-semibold shadow-sm'
                  : 'bg-surface border border-border text-text-sub hover:text-text-primary hover:bg-surface-elevated'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* In-Page Keyword Filter */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-text-sub absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('rights.filter')}
            className="w-full bg-surface text-xs text-text-primary pl-9 pr-3 py-2 rounded-lg border border-border focus:border-accent focus:outline-none"
          />
        </div>
      </div>

      {/* Topics Grid */}
      {filteredTopics.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <TopicCard key={topic.id || topic.slug} topic={topic} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface border border-border rounded-xl p-8">
          <BookOpen className="w-10 h-10 text-text-sub mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-text-primary">{t('rights.empty')}</h3>
          <p className="text-xs text-text-sub mt-1">
            {t('rights.emptyHint')}
          </p>
        </div>
      )}
    </div>
  );
}
