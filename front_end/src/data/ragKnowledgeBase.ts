import type { RAGArticle } from '../types';

export const RAG_KNOWLEDGE_BASE: RAGArticle[] = [
  // SINGAPORE RAG ARTICLES
  {
    id: 'rag-sg-1',
    countryCode: 'SG',
    title: 'Singapore Company Registration Requirements (ACRA)',
    category: 'Registration',
    section: 'Companies Act Cap. 50 Section 145',
    content:
      'Under the Singapore Companies Act, every Private Limited Company must have at least one director who is ordinarily resident in Singapore (Singapore Citizen, Permanent Resident, or EntrePass holder). Minimum paid-up capital is S$1. Company incorporation is processed via BizFile+ within 1 business day.',
    sourceName: 'ACRABizFile+ Official Guide',
    sourceUrl: 'https://www.acra.gov.sg/business-entities/companies/starting-a-company',
    lastVerified: '2026-08-01',
  },
  {
    id: 'rag-sg-2',
    countryCode: 'SG',
    title: 'Singapore Foreign Worker Employment Pass (EP) & COMPASS Framework',
    category: 'Immigration',
    section: 'Ministry of Manpower EP Regulations 2023/2026',
    content:
      'Foreign professionals require an Employment Pass (EP). As of 2023+, EP candidates must earn at least S$5,000/month (or S$5,500 in Financial Services) and pass the COMPASS points-based evaluation (scoring >= 40 points across salary, qualifications, diversity, and local support criteria).',
    sourceName: 'Ministry of Manpower (MOM) Singapore',
    sourceUrl: 'https://www.mom.gov.sg/passes-and-permits/employment-pass',
    lastVerified: '2026-08-01',
  },
  {
    id: 'rag-sg-3',
    countryCode: 'SG',
    title: 'Singapore Corporate Tax & Start-up Tax Exemption Scheme',
    category: 'Tax',
    section: 'Income Tax Act (Cap. 134) Section 43',
    content:
      'Singapore corporate tax is a flat 17%. New qualifying companies enjoy 75% tax exemption on the first S$100,000 of normal chargeable income and 50% exemption on the next S$100,000 for their first 3 consecutive YAs. Foreign dividends distributed to SG entities are 0% taxed under Section 13(8).',
    sourceName: 'IRAS Singapore Tax Guide',
    sourceUrl: 'https://www.iras.gov.sg/taxes/corporate-income-tax',
    lastVerified: '2026-08-01',
  },
  {
    id: 'rag-sg-4',
    countryCode: 'SG',
    title: 'Singapore Personal Data Protection Act (PDPA)',
    category: 'Data Protection',
    section: 'PDPA 2012 / Amendment Act 2020',
    content:
      'Organizations collecting personal data in Singapore must appoint a Data Protection Officer (DPO), notify individuals of data collection purposes, obtain consent, implement reasonable security safeguards, and comply with mandatory data breach notification requirements within 3 calendar days of assessment.',
    sourceName: 'PDPC Singapore Guidelines',
    sourceUrl: 'https://www.pdpc.gov.sg/overview-of-pdpa',
    lastVerified: '2026-08-01',
  },
  {
    id: 'rag-sg-5',
    countryCode: 'SG',
    title: 'Opening a Corporate Bank Account in Singapore',
    category: 'Banking',
    section: 'MAS Anti-Money Laundering (AML) Circular Notice 626',
    content:
      'Singapore commercial banks (DBS, OCBC, UOB) require physical or video identification of ultimate beneficial owners (>25% shareholding). Documents required: ACRA Business Profile, Board Resolution, M&A, and proof of address. Digital challenger banks (Aspire, Airwallex) offer remote onboarding within 3-5 days.',
    sourceName: 'Monetary Authority of Singapore (MAS)',
    sourceUrl: 'https://www.mas.gov.sg',
    lastVerified: '2026-08-01',
  },

  // UAE RAG ARTICLES
  {
    id: 'rag-ae-1',
    countryCode: 'AE',
    title: 'UAE Corporate Tax & Freezone Qualifying Persons (QFZP)',
    category: 'Tax',
    section: 'Federal Decree-Law No. 47 of 2022',
    content:
      'The UAE corporate tax rate is 9% on taxable profit exceeding AED 375,000. Freezone companies categorized as Qualifying Free Zone Persons (QFZP) can maintain 0% tax on qualifying income if they satisfy substance requirements and do not engage in mainland commercial transactions.',
    sourceName: 'Federal Tax Authority (FTA UAE)',
    sourceUrl: 'https://tax.gov.ae/en/corporate.tax.aspx',
    lastVerified: '2026-08-01',
  },
  {
    id: 'rag-ae-2',
    countryCode: 'AE',
    title: 'UAE Foreign Ownership & Mainland Business Regulations',
    category: 'Registration',
    section: 'Commercial Companies Law (Federal Law No. 32 of 2021)',
    content:
      'Amendments to UAE Commercial Companies Law allow 100% foreign ownership of mainland commercial companies without requiring an Emirati national partner/sponsor for over 1,000 business activities across Dubai and Abu Dhabi.',
    sourceName: 'Ministry of Economy UAE',
    sourceUrl: 'https://www.moec.gov.ae',
    lastVerified: '2026-08-01',
  },
  {
    id: 'rag-ae-3',
    countryCode: 'AE',
    title: 'UAE Foreign Talent Visas: Golden Visa & Green Visa',
    category: 'Immigration',
    section: 'Federal Authority for Identity, Citizenship, Customs & Port Security (ICP)',
    content:
      'Founders and tech talent can obtain 10-Year Golden Visas or 5-Year Green Visas without local employer sponsorship. Minimum salary requirement for Green Visa skilled workers is AED 15,000/month with a bachelor degree.',
    sourceName: 'ICP UAE Official Visa Portal',
    sourceUrl: 'https://icp.gov.ae',
    lastVerified: '2026-08-01',
  },

  // GERMANY RAG ARTICLES
  {
    id: 'rag-de-1',
    countryCode: 'DE',
    title: 'Germany GmbH Incorporation & Minimum Share Capital',
    category: 'Registration',
    section: 'GmbH-Gesetz (GmbHG) § 5 & § 7',
    content:
      'Establishing a German GmbH requires €25,000 statutory minimum share capital, of which at least €12,500 must be deposited in the company bank account prior to commercial register registration (Handelsregister). Articles of association must be notarized in Germany.',
    sourceName: 'German Federal Ministry of Justice (BMJ)',
    sourceUrl: 'https://www.bmj.de',
    lastVerified: '2026-08-01',
  },
  {
    id: 'rag-de-2',
    countryCode: 'DE',
    title: 'German EU Blue Card & Foreign IT Worker Fast-Track',
    category: 'Immigration',
    section: 'Aufenthaltsgesetz (AufenthG) § 18g',
    content:
      'Foreign IT professionals can obtain the EU Blue Card with a gross annual salary threshold of €41,041 (for shortage occupations) or €45,300 (general). IT specialists with 3+ years of relevant experience qualify even without a formal university degree.',
    sourceName: 'Federal Employment Agency (Bundesagentur für Arbeit)',
    sourceUrl: 'https://www.arbeitsagentur.de',
    lastVerified: '2026-08-01',
  },
  {
    id: 'rag-de-3',
    countryCode: 'DE',
    title: 'EU GDPR & German Federal Data Protection Act (BDSG)',
    category: 'Data Protection',
    section: 'Regulation (EU) 2016/679 (GDPR) / BDSG § 38',
    content:
      'Companies processing user data in Germany must comply with GDPR. Appointing a Data Protection Officer (DSB) is compulsory if 20 or more employees process personal data routinely. Fines can reach up to €20M or 4% of global annual turnover.',
    sourceName: 'BfDI Germany Data Protection Office',
    sourceUrl: 'https://www.bfdi.bund.de',
    lastVerified: '2026-08-01',
  },
];
