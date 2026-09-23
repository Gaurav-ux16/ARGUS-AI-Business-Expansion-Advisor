import React, { useState } from 'react';
import { usePlan } from '../../context/PlanContext';
import { COUNTRIES_DATA } from '../../data/countriesData';
import type { DocumentItem } from '../../types';
import { Upload } from 'lucide-react';

export const DocumentsView: React.FC = () => {
  const { selectedCountryCode } = usePlan();
  const country = COUNTRIES_DATA[selectedCountryCode] || COUNTRIES_DATA['SG'];

  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: 'doc-1', category: 'Founder', name: 'Passports of Founders / UBOs (>25% shareholding)', isMandatory: true, purpose: 'KYC & Director Verification', authority: country.code === 'SG' ? 'ACRA BizFile+' : 'DED Dubai', status: 'Completed' },
    { id: 'doc-2', category: 'Company', name: 'Certificate of Incorporation (Parent Company)', isMandatory: true, purpose: 'Branch / Subsidiary Setup', authority: 'Corporate Registry', status: 'Completed' },
    { id: 'doc-3', category: 'Company', name: 'Articles of Association (M&A / Constitution)', isMandatory: true, purpose: 'Entity Scaffolding', authority: 'ACRA / Regulators', status: 'Pending Upload' },
    { id: 'doc-4', category: 'Banking', name: '6-Month Parent Company Bank Statements', isMandatory: true, purpose: 'Bank Account Opening & AML Check', authority: 'DBS / Aspire / Wio', status: 'Pending Upload' },
    { id: 'doc-5', category: 'Employees', name: 'Educational Degrees & Work Certifications', isMandatory: true, purpose: 'Employment Pass (EP) & COMPASS Validation', authority: 'Ministry of Manpower (MOM)', status: 'Pending Upload' },
    { id: 'doc-6', category: 'Tax', name: 'Tax Identification Number (TIN / PAN / EIN)', isMandatory: true, purpose: 'DTAA Relief & Corporate Tax Registration', authority: 'IRAS / FTA Tax Portal', status: 'Pending Upload' },
    { id: 'doc-7', category: 'Licensing', name: 'Comprehensive Business Plan & Tech Architecture', isMandatory: false, purpose: 'Grant Applications & Licence Review', authority: 'EnterpriseSG / EDB', status: 'Not Required' },
  ]);

  const handleToggleDocStatus = (id: string) => {
    setDocuments((docs) =>
      docs.map((d) => {
        if (d.id === id) {
          const nextStatus = d.status === 'Completed' ? 'Pending Upload' : 'Completed';
          return { ...d, status: nextStatus };
        }
        return d;
      })
    );
  };

  const completedDocsCount = documents.filter((d) => d.status === 'Completed').length;

  return (
    <div>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 800 }}>Document Checklist & Compliance Vault</h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Required legal, financial, and immigration documents for expanding to <strong>{country.name}</strong>.
        </p>
      </div>

      <div className="argus-card" style={{ marginBottom: '24px' }}>
        <div className="flex-between">
          <div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
              DOCUMENTATION VERIFICATION STATUS
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 800 }}>
              {completedDocsCount} of {documents.length} Documents Verified & Ready
            </h2>
          </div>
          <span className="score-badge score-high">{Math.round((completedDocsCount / documents.length) * 100)}% Ready</span>
        </div>
      </div>

      <div className="argus-card">
        <table className="argus-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Document Name</th>
              <th>Requirement</th>
              <th>Purpose & Authority</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td><span className="tag-chip">{doc.category}</span></td>
                <td><strong>{doc.name}</strong></td>
                <td>
                  <span className={`tag-chip ${doc.isMandatory ? 'score-low' : ''}`}>
                    {doc.isMandatory ? 'MANDATORY' : 'OPTIONAL'}
                  </span>
                </td>
                <td style={{ fontSize: '12px' }}>
                  <div>{doc.purpose}</div>
                  <div style={{ color: 'var(--text-muted)' }}>Authority: {doc.authority}</div>
                </td>
                <td>
                  <span className={`score-badge ${doc.status === 'Completed' ? 'score-high' : 'score-medium'}`}>
                    {doc.status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => handleToggleDocStatus(doc.id)}
                  >
                    <Upload size={12} /> {doc.status === 'Completed' ? 'Re-upload' : 'Upload Doc'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
