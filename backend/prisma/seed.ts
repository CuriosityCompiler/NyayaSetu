import {
  PrismaClient,
  UserRole,
  UserStatus,
  TopicStatus,
  ApprovalState,
  ReviewState,
  ContentLocale,
  VerificationStatus,
  SourceType,
} from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NyayaSetu database seeding...');

  // ─── 1. Admin & Reviewer Users ────────────────────────────────
  const defaultPasswordHash = await argon2.hash('Admin@NyayaSetu2026!', {
    type: argon2.argon2id,
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@nyayasetu.gov.in' },
    update: {},
    create: {
      email: 'admin@nyayasetu.gov.in',
      passwordHash: defaultPasswordHash,
      name: 'Dr. Ramesh Chandra (Chief Legal Editor)',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      locale: 'en',
    },
  });

  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@nyayasetu.gov.in' },
    update: {},
    create: {
      email: 'reviewer@nyayasetu.gov.in',
      passwordHash: defaultPasswordHash,
      name: 'Advocate Ananya Deshmukh (NALSA Empanelled)',
      role: UserRole.REVIEWER,
      status: UserStatus.ACTIVE,
      locale: 'en',
    },
  });

  console.log(`✓ Seeded users: ${admin.email}, ${reviewer.email}`);

  // ─── 2. Official Sources ──────────────────────────────────────
  const sourcesData = [
    {
      authority: 'National Legal Services Authority (NALSA)',
      url: 'https://nalsa.gov.in/legal-aid',
      sourceType: SourceType.GOVERNMENT_WEBSITE,
      retrievedDate: new Date('2026-01-15'),
      lastVerified: new Date('2026-10-20'),
      verifiedById: reviewer.id,
    },
    {
      authority: 'India Code — Legislative Department, Ministry of Law and Justice',
      url: 'https://indiacode.nic.in',
      sourceType: SourceType.STATUTORY_ACT,
      retrievedDate: new Date('2026-01-10'),
      lastVerified: new Date('2026-10-22'),
      verifiedById: reviewer.id,
    },
    {
      authority: 'Karnataka State Legal Services Authority (KSLSA)',
      url: 'https://karnataka.nalsa.gov.in',
      sourceType: SourceType.GOVERNMENT_WEBSITE,
      retrievedDate: new Date('2026-02-01'),
      lastVerified: new Date('2026-10-24'),
      verifiedById: reviewer.id,
    },
  ];

  for (const s of sourcesData) {
    await prisma.officialSource.create({ data: s });
  }
  console.log('✓ Seeded official government sources');

  // ─── 3. Legal Topics & Verified Guides ────────────────────────
  const topics = [
    {
      slug: 'right-to-information-rti',
      category: 'Transparency & Governance',
      jurisdiction: 'IN',
      sourceReference: 'Right to Information Act, 2005 (Act No. 22 of 2005) · indiacode.nic.in',
      title: 'Right to Information (RTI) — How to Seek Government Records',
      summary:
        'The RTI Act empowers every Indian citizen to request information, inspect public work, and obtain certified government records within 30 days for a nominal fee of ₹10.',
      body: `### Overview of RTI
Under Section 3 of the Right to Information Act, 2005, all citizens have the fundamental democratic right to secure access to information under the control of public authorities.

### Key Timelines
- **Standard Request**: Information must be provided within **30 days** of filing.
- **Life and Liberty**: If information concerns the life or liberty of a person, it must be provided within **48 hours** (Section 7(1)).
- **Third Party**: Up to 40 days when third-party consultation is required.

### Procedural Steps
1. **Identify the Public Authority**: Determine whether the department belongs to Central or State government.
2. **Draft the Application**: Clearly mention your specific questions. No need to provide reasons for asking.
3. **Pay Application Fee**: ₹10 via IPO, court fee stamp, DD, or online portal (rtionline.gov.in).
4. **Appeals**: If no reply is received within 30 days, file a **First Appeal** within 30 days to the designated First Appellate Authority (FAA).`,
    },
    {
      slug: 'free-legal-aid-eligibility',
      category: 'Legal Aid & Justice',
      jurisdiction: 'IN',
      sourceReference: 'Legal Services Authorities Act, 1987 (Section 12) · nalsa.gov.in',
      title: 'Free Legal Aid in India — Who Qualifies and How to Apply',
      summary:
        'Under Section 12 of the Legal Services Authorities Act, eligible citizens including women, children, SC/ST individuals, persons with disabilities, and low-income earners are provided free legal counsel and court fee waivers.',
      body: `### The Constitutional Mandate
Article 39A of the Constitution of India provides for equal justice and free legal aid to ensure that opportunities for securing justice are not denied to any citizen by reason of economic or other disabilities.

### Eligible Persons (Section 12)
1. **Women & Children**: Regardless of income status.
2. **Scheduled Castes & Scheduled Tribes**: Free representation at all court tiers.
3. **Persons with Disabilities**: Under the RPwD Act 2016.
4. **Victims of Human Trafficking, Beggary, or Disasters**.
5. **Industrial Workmen**.
6. **Persons in Custody or Juvenile Homes**.
7. **Income Limit**: General category individuals with annual income under ₹3,00,000 (varies slightly by state SLSA rules).

### Services Provided
- Appointment of empanelled advocates at zero cost.
- Complete payment of court fees and drafting expenses.
- Free certified copies of orders and judgments.
- Dispute settlement via Lok Adalats and Pre-Litigation Mediation.

### How to Access
Call **15100** (NALSA 24x7 toll-free helpline) or visit the Front Office of your District Legal Services Authority (DLSA) located inside the District Court complex.`,
    },
    {
      slug: 'protection-of-women-domestic-violence',
      category: 'Women & Family Rights',
      jurisdiction: 'IN',
      sourceReference: 'Protection of Women from Domestic Violence Act, 2005 · indiacode.nic.in',
      title: 'Protection from Domestic Violence — Immediate Relief & Rights',
      summary:
        'PWDVA 2005 provides women protection against physical, emotional, sexual, and economic abuse in shared households, guaranteeing right to residence, protection orders, and monetary relief.',
      body: `### Key Rights Guaranteed Under PWDVA
- **Right to Reside in Shared Household (Section 17)**: An aggrieved woman cannot be evicted or excluded from the shared household without due process of law.
- **Protection Orders (Section 18)**: Court orders prohibiting the abuser from entering the place of employment or communicating with the woman.
- **Residence Orders (Section 19)**: Directing the abuser to remove himself from the residence or secure alternate accommodation.
- **Monetary Relief & Custody Orders (Sections 20 & 21)**.

### How to File a DIR (Domestic Incident Report)
1. Contact the local **Protection Officer** or registered Service Provider.
2. File an application before the Judicial Magistrate of First Class.
3. Call **181** (Women Helpline) or **112** for emergency police intervention.`,
    },
    {
      slug: 'consumer-protection-rights',
      category: 'Consumer Rights',
      jurisdiction: 'IN',
      sourceReference: 'Consumer Protection Act, 2019 (Act No. 35 of 2019) · e-daakhil.nic.in',
      title: 'Consumer Protection — Fighting Defective Products & Misleading Ads',
      summary:
        'Under CPA 2019, consumers can file online complaints via e-Daakhil without hiring a lawyer, claiming compensation for defective goods, deficiency of service, and unfair trade practices.',
      body: `### 6 Fundamental Consumer Rights
1. Right to Safety
2. Right to be Informed
3. Right to Choose
4. Right to be Heard
5. Right to Seek Redressal
6. Right to Consumer Education

### 3-Tier Redressal Commission
- **District Commission**: Claims up to ₹50 Lakhs.
- **State Commission**: Claims between ₹50 Lakhs and ₹2 Crores.
- **National Commission (NCDRC)**: Claims exceeding ₹2 Crores.

### E-Filing Procedure
Complaints can be lodged electronically from home via **e-daakhil.nic.in** or by calling the National Consumer Helpline at **1915**.`,
    },
    {
      slug: 'senior-citizens-maintenance-welfare',
      category: 'Elder Rights',
      jurisdiction: 'IN',
      sourceReference: 'Maintenance and Welfare of Parents and Senior Citizens Act, 2007',
      title: 'Senior Citizens Rights — Maintenance and Eviction Protection',
      summary:
        'Senior citizens (age 60+) and parents can claim monthly maintenance from children or legal heirs through simplified Maintenance Tribunals, with decisions mandated within 90 days.',
      body: `### Key Highlights of the Act
- **Maintenance Obligation**: Children and grandchildren are legally bound to provide food, clothing, housing, and medical treatment.
- **Maintenance Tribunals**: Chaired by the Sub-Divisional Magistrate (SDM); lawyers are barred from representing parties unless permitted, ensuring low-stress hearings.
- **Property Reversal (Section 23)**: If a senior citizen transfers property to children with the condition of maintenance and the condition is breached, the transfer is declared void by the tribunal.
- **Elderly Helpline**: Dial **14567** (Elderline).`,
    },
    {
      slug: 'fundamental-rights-constitution',
      category: 'Fundamental Rights',
      jurisdiction: 'IN',
      sourceReference: 'Constitution of India, Part III · Legislative Department',
      title: 'Fundamental Rights — Constitutional Protections in India',
      summary:
        'Part III of the Constitution protects equality, freedoms, life and personal liberty, freedom of religion, and access to constitutional remedies. The scope and limits of each right depend on the facts and applicable law.',
      body: `### Rights in Part III
- **Equality (Articles 14–18)**: Equality before law and protections against specified forms of discrimination and untouchability.
- **Freedoms (Articles 19–22)**: Certain freedoms, subject to constitutionally permitted restrictions, and protections concerning life, liberty, and arrest.
- **Protection from exploitation (Articles 23–24)** and **freedom of religion (Articles 25–28)**.
- **Cultural and educational rights (Articles 29–30)** and the **right to constitutional remedies (Article 32)**.

### If You Believe a Right Was Violated
1. Write down what happened, when, where, and which authority was involved.
2. Keep copies of notices, orders, messages, and other relevant records.
3. Seek advice from a lawyer or your District Legal Services Authority (DLSA); legal aid may be available.
4. The appropriate remedy depends on the right, respondent, deadlines, and facts. Check the current Constitution and consult a qualified legal professional before filing.`,
    },
    {
      slug: 'arrest-and-detention-rights',
      category: 'Fundamental Rights',
      jurisdiction: 'IN',
      sourceReference: 'Constitution of India, Articles 20–22 · Bharatiya Nagarik Suraksha Sanhita, 2023',
      title: 'Rights During Arrest and Detention',
      summary:
        'Constitutional and criminal-procedure safeguards apply to arrest and detention. The exact procedure depends on the circumstances, the alleged offence, and the law in force.',
      body: `### Important Safeguards
- A person arrested must be informed of the grounds of arrest and has the right to consult and be defended by a legal practitioner.
- The Constitution generally requires an arrested person to be produced before a magistrate within 24 hours, excluding necessary travel time, subject to constitutional exceptions.
- An arrested person should not be compelled to be a witness against themselves.
- Special rules can apply to particular cases, including preventive detention and specific statutory offences.

### Practical Steps
1. Ask for the grounds of arrest and the name of the police station or authority.
2. Tell a trusted person where you are being taken and ask to contact a lawyer.
3. Do not sign a statement you do not understand; ask for it to be read and explained.
4. Request legal aid through the DLSA or NALSA helpline **15100** if you cannot afford a lawyer.

This is general information, not a substitute for urgent legal advice. Check the current BNSS and obtain advice about the specific case.`,
    },
    {
      slug: 'ipc-bns-constitutional-articles-and-reporting',
      category: 'Criminal Law & Constitutional Rights',
      jurisdiction: 'IN',
      sourceReference: 'Bharatiya Nyaya Sanhita, 2023; Bharatiya Nagarik Suraksha Sanhita, 2023; Constitution of India, Articles 14, 20–22, 32, 39A',
      title: 'IPC, BNS and Constitutional Articles — Which Law Applies and Where to Seek Help',
      summary:
        'The Indian Penal Code (IPC) is the former general penal code. The Bharatiya Nyaya Sanhita (BNS) generally governs offences from 1 July 2024, subject to commencement and savings provisions; earlier events and special statutes may require different analysis. This guide explains basic reporting and legal-aid options.',
      body: `### IPC, BNS, and “Articles” in plain language
- The **Indian Penal Code, 1860 (IPC)** was a statute that defined many criminal offences. The **Bharatiya Nyaya Sanhita, 2023 (BNS)** replaced it as the general penal code; most provisions came into force on **1 July 2024**. Check the Gazette for the commencement of a specific provision.
- The date and facts matter. The IPC may remain relevant to conduct before the change, and savings or transitional provisions and special criminal laws can affect which provisions apply. Do not select a section from an online list without checking the current statute and the event date.
- Criminal procedure is generally addressed by the **Bharatiya Nagarik Suraksha Sanhita, 2023 (BNSS)**, and evidence by the **Bharatiya Sakshya Adhiniyam, 2023 (BSA)**. The Constitution is a separate, higher law.
- An **Article** is a numbered provision of the Constitution; it is not a section of the IPC or BNS. Depending on the issue, Articles 14 (equality), 19 (specified freedoms), 20 (criminal-proceeding protections), 21 (life and personal liberty), and 22 (arrest and detention safeguards) may be relevant. Article 32 concerns remedies before the Supreme Court; the appropriate court and remedy depend on the case.
- Article 39A directs the State to promote equal justice and free legal aid. Eligibility and delivery are governed by applicable legal-services laws and rules.

### How to approach a criminal-law problem
1. **Address immediate danger first.** Call **112** or go to a safe place and contact local emergency services. For a child at risk, contact police/SJPU or Child Helpline **1098**.
2. **Make a short factual record.** Note dates, times, locations, what happened, witnesses, and any complaint or case reference. Preserve original messages, documents, photographs, medical records, and transaction details; do not edit or circulate sensitive material.
3. **Contact the appropriate authority.** For suspected criminal conduct, approach the nearest police station or the relevant Special Juvenile Police Unit where applicable. Explain the facts clearly and ask how the information is being recorded. Under BNSS section 173, information about a cognizable offence may be given irrespective of the area where the offence occurred; ask the police or a lawyer whether that process applies to your circumstances.
4. **Get legal help early.** Contact the District Legal Services Authority (DLSA) at the district court or call **NALSA 15100** to ask about free legal aid. A lawyer can help identify the applicable law, deadlines, forum, and next step. Do not miss a deadline while trying to resolve the matter informally.
5. **Keep a record of follow-up.** Save acknowledgements, notices, names of offices contacted, and dates. If you cannot get help or need to challenge an action, ask a lawyer/DLSA about the appropriate senior police officer, Magistrate, commission, or court route; the correct route depends on the issue and jurisdiction.

### Where to verify the law
Use **India Code** for the current text of the BNS, BNSS, BSA, and special Acts; use the **e-Gazette** for commencement notifications and amendments. Read the provision in context and check its effective date.

This is general legal information, not legal advice. Criminal procedure, exceptions, limitation periods, and available remedies depend on the facts and the law in force. If there is an urgent threat, contact emergency services rather than waiting for an online response.`,
    },
    {
      slug: 'workplace-sexual-harassment-rights',
      category: 'Women & Family',
      jurisdiction: 'IN',
      sourceReference: 'Sexual Harassment of Women at Workplace Act, 2013 · Ministry of Women and Child Development',
      title: 'Protection from Sexual Harassment at Work',
      summary:
        'The POSH Act provides a complaint and inquiry framework to address sexual harassment of women at a workplace, including through an Internal Committee or Local Committee.',
      body: `### What the Law Provides
- A woman may make a written complaint under the Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013.
- Workplaces with the required employee count must constitute an **Internal Committee (IC)**.
- Where an IC has not been constituted, or for certain complaints against the employer, a complaint may be made to the district **Local Committee (LC)**.
- The Act sets time limits for complaints and inquiries; extensions may be available in specified circumstances.

### Where to Start
1. Identify the workplace's IC and request its complaint procedure, or contact the district LC.
2. Keep a dated record of incidents and preserve relevant messages or documents.
3. Ask the IC/LC about confidentiality, support, and interim relief available under the Act.
4. The Government's **SHe-Box** portal can help route workplace complaints to the appropriate committee.

For immediate danger, contact local emergency services. Read the current Act and rules or seek legal advice for deadlines and remedies.`,
    },
    {
      slug: 'child-protection-pocso',
      category: 'Women & Family',
      jurisdiction: 'IN',
      sourceReference: 'Protection of Children from Sexual Offences Act, 2012 · India Code',
      title: 'Child Safety and Protection Under POCSO',
      summary:
        'POCSO provides a child-sensitive legal process for reporting and addressing sexual offences against anyone under 18. The law requires reporting of suspected offences and protects a child’s identity.',
      body: `### Key Protections
- A child is a person below 18 years of age under the Act.
- Suspected offences can be reported to the Special Juvenile Police Unit or local police; the Act requires reporting in covered circumstances.
- The child's identity and privacy must be protected during reporting and proceedings.
- Cases are handled through designated Special Courts, with procedures intended to reduce additional harm to the child.

### Reporting Safely
1. If a child is in immediate danger, contact emergency services or local police.
2. Report the concern to the police/SJPU or seek help from the Child Helpline at **1098**.
3. Share what is known without repeatedly questioning the child or circulating identifying details.
4. Ask the authorities about medical care, support services, and child-friendly procedures.

Do not publish a child's name, image, school, or other identifying details. This guide is not a replacement for contacting authorities or a child-protection professional.`,
    },
    {
      slug: 'disability-rights-accessibility',
      category: 'Fundamental Rights',
      jurisdiction: 'IN',
      sourceReference: 'Rights of Persons with Disabilities Act, 2016 · Department of Empowerment of Persons with Disabilities',
      title: 'Disability Rights, Accessibility and Non-Discrimination',
      summary:
        'The Rights of Persons with Disabilities Act, 2016 recognizes rights to equality, non-discrimination, accessibility, and participation, with duties placed on governments and other entities.',
      body: `### Protections Under the Act
- The Act prohibits discrimination on the basis of disability, subject to its provisions and permitted exceptions.
- Governments must take steps concerning accessibility, inclusive education, employment, and access to services.
- The Act provides for disability certification and specified benefits for persons meeting the relevant criteria.
- A Chief Commissioner or State Commissioner for Persons with Disabilities can address specified complaints and monitor implementation.

### Seeking Support
1. Keep records of the barrier, denial, or discrimination and any response received.
2. Ask the relevant institution for its accessibility or grievance process.
3. For disability certification and related schemes, consult the official DEPwD/UDID portals and your State authority.
4. Seek advice from the State Commissioner, a DLSA, or a qualified disability-rights organization about the appropriate remedy.

Eligibility, benchmark-disability thresholds, and benefits vary by provision and scheme. Check the current Act, rules, and official notifications.`,
    },
    {
      slug: 'cybercrime-reporting-rights',
      category: 'Consumer Rights',
      jurisdiction: 'IN',
      sourceReference: 'National Cyber Crime Reporting Portal · Ministry of Home Affairs',
      title: 'Responding to Online Fraud and Cybercrime',
      summary:
        'People can report cybercrime through the Ministry of Home Affairs portal and seek help from local police. Promptly contacting a bank or payment provider may help limit financial loss.',
      body: `### If Money Was Taken
1. Contact your bank, card issuer, or payment provider immediately and ask them to block or dispute the transaction.
2. Call **1930** promptly for financial cyber-fraud assistance, then complete the report on the National Cyber Crime Reporting Portal as instructed.
3. Save transaction IDs, messages, phone numbers, profile links, and complaint acknowledgements.
4. Report the incident to local police when appropriate and keep the complaint reference number.

### Protect Your Accounts
- Change affected passwords from a trusted device and enable multi-factor authentication.
- Do not share OTPs, PINs, recovery codes, or remote-access app permissions with callers.
- Avoid paying anyone who claims they can recover money for an upfront fee.

Use the official **cybercrime.gov.in** portal. For immediate threats or physical danger, contact local emergency services.`,
    },
    {
      slug: 'scheduled-caste-tribe-protection',
      category: 'Fundamental Rights',
      jurisdiction: 'IN',
      sourceReference: 'Scheduled Castes and Scheduled Tribes (Prevention of Atrocities) Act, 1989 · India Code',
      title: 'Legal Protections Against Caste-Based Atrocities',
      summary:
        'The SC/ST (Prevention of Atrocities) Act creates offences and safeguards to address specified atrocities against members of Scheduled Castes and Scheduled Tribes.',
      body: `### Protections and Process
- The Act identifies specific conduct as offences when its legal conditions are met.
- Special Courts or Exclusive Special Courts are designated to try cases under the Act.
- The law and rules provide for protection, relief, and rehabilitation measures for victims and witnesses.
- Applicability depends on the facts, the status of the people involved, and the precise statutory provisions.

### If You Need Help
1. If there is immediate danger, contact local police or emergency services.
2. Preserve relevant records and note dates, locations, witnesses, and any complaint numbers.
3. Ask police about registering the complaint under the applicable law and request an acknowledgement.
4. Contact the DLSA for free legal aid or ask about victim-support and relief procedures.

Do not delay urgent reporting while collecting evidence. Read the current Act and Rules and seek advice from a lawyer or legal-aid authority.`,
    },
    {
      slug: 'right-to-education-children',
      category: 'Women & Family',
      jurisdiction: 'IN',
      sourceReference: 'Right of Children to Free and Compulsory Education Act, 2009 · Ministry of Education',
      title: 'Right to Free and Compulsory Education for Children',
      summary:
        'The Constitution and the Right to Education Act provide for free and compulsory elementary education for children aged 6 to 14, subject to the Act and applicable rules.',
      body: `### What Families Should Know
- Article 21A and the Right of Children to Free and Compulsory Education Act, 2009 address free and compulsory elementary education for children aged 6–14.
- The Act sets responsibilities for governments, local authorities, and schools and includes rules on admission and completion of elementary education.
- Admission, neighbourhood-school rules, and any special provisions are subject to the Act, state rules, and current government notifications.

### If a Child Is Denied Admission or Support
1. Ask the school for the reason in writing and keep copies of applications and replies.
2. Contact the local education officer or the grievance authority named in your State's RTE rules.
3. For a relevant 25% entry-level admission process, check the State's official education portal for eligibility, dates, and documents.
4. Seek help from the State Commission for Protection of Child Rights or DLSA if the issue is not resolved.

Admission rules and timelines differ by State. Confirm them on official State education websites before applying.`,
    },
  ];

  for (const item of topics) {
    const topic = await prisma.legalTopic.upsert({
      where: { slug: item.slug },
      update: {},
      create: {
        slug: item.slug,
        category: item.category,
        status: TopicStatus.PUBLISHED,
      },
    });

    await prisma.legalContent.create({
      data: {
        topicId: topic.id,
        jurisdiction: item.jurisdiction,
        sourceReference: item.sourceReference,
        version: 1,
        approvalState: ApprovalState.APPROVED,
        createdById: admin.id,
        approvedById: reviewer.id,
        translations: {
          create: {
            locale: ContentLocale.en,
            title: item.title,
            summary: item.summary,
            body: item.body,
            reviewState: ReviewState.APPROVED,
            reviewedById: reviewer.id,
          },
        },
      },
    });
  }
  console.log(`✓ Seeded ${topics.length} verified legal rights guides`);

  // ─── 4. Legal Aid Directory Contacts ─────────────────────────
  const directoryContacts = [
    {
      authority: 'National Legal Services Authority (NALSA) - HQ',
      state: 'Central / National',
      district: 'New Delhi',
      address: 'B-Block, Additional Building Complex, Supreme Court of India, New Delhi - 110001',
      phone: '15100',
      email: 'nalsa-dla@nic.in',
      hours: 'Mon - Fri: 9:30 AM - 6:00 PM (Helpline 24x7)',
      sourceUrl: 'https://nalsa.gov.in',
      verificationStatus: VerificationStatus.VERIFIED,
      lastVerified: new Date('2026-10-24'),
    },
    {
      authority: 'Karnataka State Legal Services Authority (KSLSA)',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      address: 'Nyaya Degula, 1st Floor, H. Siddaiah Road, Bengaluru - 560027',
      phone: '080-22111714',
      email: 'kslsa.kar@nic.in',
      hours: 'Mon - Sat: 10:00 AM - 5:30 PM (2nd/4th Sat closed)',
      sourceUrl: 'https://karnataka.nalsa.gov.in',
      verificationStatus: VerificationStatus.VERIFIED,
      lastVerified: new Date('2026-10-20'),
    },
    {
      authority: 'District Legal Services Authority (DLSA) Bengaluru Urban',
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      address: 'City Civil Court Complex, Opp. Mysore Bank, K.G. Road, Bengaluru - 560009',
      phone: '080-22212953',
      email: 'dlsa.bengaluru@karnataka.gov.in',
      hours: 'Mon - Sat: 10:00 AM - 5:00 PM',
      sourceUrl: 'https://karnataka.nalsa.gov.in',
      verificationStatus: VerificationStatus.VERIFIED,
      lastVerified: new Date('2026-10-22'),
    },
    {
      authority: 'Delhi State Legal Services Authority (DSLSA)',
      state: 'Delhi',
      district: 'New Delhi',
      address: 'Central Office, Patiala House Courts Complex, New Delhi - 110001',
      phone: '1516',
      email: 'dslsa-phc@nic.in',
      hours: 'Mon - Sat: 10:00 AM - 5:00 PM',
      sourceUrl: 'https://dslsa.org',
      verificationStatus: VerificationStatus.VERIFIED,
      lastVerified: new Date('2026-10-21'),
    },
    {
      authority: 'Maharashtra State Legal Services Authority (MSLSA)',
      state: 'Maharashtra',
      district: 'Mumbai City',
      address: '105, High Court, PWD Building, Fort, Mumbai - 400032',
      phone: '022-22673962',
      email: 'legalservices-mah@nic.in',
      hours: 'Mon - Fri: 10:30 AM - 5:30 PM',
      sourceUrl: 'https://legalservices.maharashtra.gov.in',
      verificationStatus: VerificationStatus.VERIFIED,
      lastVerified: new Date('2026-10-18'),
    },
    {
      authority: 'Tamil Nadu State Legal Services Authority (TNSLSA)',
      state: 'Tamil Nadu',
      district: 'Chennai',
      address: 'North Fort Road, High Court Campus, Chennai - 600104',
      phone: '044-25342834',
      email: 'tnslsa@tn.gov.in',
      hours: 'Mon - Fri: 10:00 AM - 5:45 PM',
      sourceUrl: 'https://tnslsa.tn.gov.in',
      verificationStatus: VerificationStatus.VERIFIED,
      lastVerified: new Date('2026-10-19'),
    },
  ];

  for (const c of directoryContacts) {
    await prisma.legalAidContact.create({ data: c });
  }
  console.log(`✓ Seeded ${directoryContacts.length} verified legal aid authorities`);

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
