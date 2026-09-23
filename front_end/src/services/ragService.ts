import type { RAGArticle } from '../types';
import { RAG_KNOWLEDGE_BASE } from '../data/ragKnowledgeBase';

export interface RAGSearchResponse {
  query: string;
  answer: string;
  matchedArticles: RAGArticle[];
  disclaimer: string;
}

export class RAGService {
  public static query(userQuery: string, countryCode: string = 'SG'): RAGSearchResponse {
    const q = userQuery.toLowerCase();
    const countryArticles = RAG_KNOWLEDGE_BASE.filter(
      (art) => art.countryCode === countryCode || art.countryCode === 'ALL'
    );

    // Search articles matching keywords
    const matches = countryArticles.filter((art) => {
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchCategory = art.category.toLowerCase().includes(q);
      const matchContent = art.content.toLowerCase().includes(q);
      const matchSection = art.section.toLowerCase().includes(q);

      // Check intent terms
      const isHiring = q.includes('hire') || q.includes('foreign') || q.includes('visa') || q.includes('pass') || q.includes('quota');
      const isTax = q.includes('tax') || q.includes('gst') || q.includes('vat') || q.includes('exemption') || q.includes('rate');
      const isReg = q.includes('regis') || q.includes('company') || q.includes('acra') || q.includes('incorporate') || q.includes('director');
      const isData = q.includes('data') || q.includes('privacy') || q.includes('pdpa') || q.includes('gdpr') || q.includes('dpo');
      const isBank = q.includes('bank') || q.includes('account') || q.includes('mas') || q.includes('money');

      if (isHiring && art.category === 'Immigration') return true;
      if (isTax && art.category === 'Tax') return true;
      if (isReg && art.category === 'Registration') return true;
      if (isData && art.category === 'Data Protection') return true;
      if (isBank && art.category === 'Banking') return true;

      return matchTitle || matchCategory || matchContent || matchSection;
    });

    const results = matches.length > 0 ? matches : countryArticles.slice(0, 2);

    let syntheticAnswer = '';
    if (results.length > 0) {
      const primary = results[0];
      syntheticAnswer = `According to official regulatory records for ${countryCode} (${primary.sourceName}, ${primary.section}):\n\n${primary.content}`;
      if (results.length > 1) {
        syntheticAnswer += `\n\nAdditionally, reference ${results[1].section} (${results[1].sourceName}): ${results[1].content}`;
      }
    } else {
      syntheticAnswer = `I could not find specific statutory references for "${userQuery}" in the current ${countryCode} regulatory database. Please verify with local legal counsel.`;
    }

    return {
      query: userQuery,
      answer: syntheticAnswer,
      matchedArticles: results,
      disclaimer:
        'ARGUS provides informational business expansion guidance based on curated official sources and does not replace professional legal, tax, immigration, or regulatory counsel.',
    };
  }
}
