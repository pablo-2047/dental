import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Plus } from 'lucide-react';

export const AdminBilling: React.FC = () => {
  const { invoices, patients, createInvoice, updateInvoiceStatus } = useClinic();

  // Invoice generator form state
  const [selectedPatId, setSelectedPatId] = useState('');
  const [selectedService, setSelectedService] = useState('General Dental Consultation');
  const [customAmount, setCustomAmount] = useState('250');

  const handleCreateNewInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatId || !customAmount) return;

    const patient = patients.find(p => p.id === selectedPatId);
    if (!patient) return;

    createInvoice({
      patientId: patient.id,
      patientName: patient.name,
      service: selectedService,
      amount: parseFloat(customAmount) || 150,
      status: 'Pending'
    });

    alert(`Invoice successfully generated for ${patient.name} and synced with Patient Portal.`);
    setSelectedPatId('');
  };

  // Financial calculations
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const settledRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueRevenue = invoices.filter(i => i.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);

  // Settlement rate
  const settleRate = totalInvoiced > 0 ? Math.round((settledRevenue / totalInvoiced) * 100) : 0;

  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'flex-start' }}>
      
      {/* Column 1: Financial list & Charts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* Financial KPI stats block */}
        <div className="grid-cols-3" style={{ gap: '16px' }}>
          {[
            { label: "Settled Revenue", val: `₹${settledRevenue}`, percentage: settleRate, color: 'var(--success)' },
            { label: "Pending Invoices", val: `₹${pendingRevenue}`, percentage: 100 - settleRate, color: 'var(--primary)' },
            { label: "Overdue Claims", val: `₹${overdueRevenue}`, percentage: null, color: 'var(--accent)' }
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{stat.label}</p>
              <h3 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0', color: stat.color }}>{stat.val}</h3>
              {stat.percentage !== null ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  {/* Custom CSS progress bar */}
                  <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ width: `${stat.percentage}%`, height: '100%', background: stat.color }} />
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{stat.percentage}%</span>
                </div>
              ) : (
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Urgent settlement required</p>
              )}
            </div>
          ))}
        </div>

        {/* Invoice Index Grid */}
        <div style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Practice Invoices Index</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {invoices.map(inv => (
              <div 
                key={inv.id}
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{inv.id}</span>
                    <span className={`pill ${
                      inv.status === 'Paid' ? 'pill-new' : inv.status === 'Pending' ? 'pill-core' : 'pill-admin'
                    }`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                      {inv.status}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{inv.patientName}</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Service: {inv.service} | Date: {inv.date}</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800 }}>₹{inv.amount}</span>
                  
                  {/* Status update toggler actions */}
                  {inv.status !== 'Paid' && (
                    <button 
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '11px', background: 'var(--success)' }}
                      onClick={() => updateInvoiceStatus(inv.id, 'Paid')}
                    >
                      Mark Paid
                    </button>
                  )}
                  {inv.status === 'Pending' && (
                    <button 
                      className="btn btn-ghost"
                      style={{ padding: '6px 12px', fontSize: '11px', color: 'var(--danger)', border: '1.5px solid #fecaca' }}
                      onClick={() => updateInvoiceStatus(inv.id, 'Overdue')}
                    >
                      Overdue
                    </button>
                  )}
                  {inv.status === 'Paid' && (
                    <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: 600 }}>Settled</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Column 2: Create Custom Invoice Panel */}
      <div style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={16} style={{ color: 'var(--primary)' }} /> Generate Custom Invoice
        </h3>
        
        <form onSubmit={handleCreateNewInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Select Patient Profile</label>
            <select
              required
              value={selectedPatId}
              onChange={e => {
                setSelectedPatId(e.target.value);
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            >
              <option value="">-- Choose Patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Select Dental Service / Procedure</label>
            <select
              value={selectedService}
              onChange={e => {
                setSelectedService(e.target.value);
                // Pre-fill corresponding cost average in INR
                if (e.target.value.includes('Whitening')) setCustomAmount('7500');
                else if (e.target.value.includes('Cosmetic')) setCustomAmount('500');
                else if (e.target.value.includes('Implant') && e.target.value.includes('Consultation')) setCustomAmount('500');
                else if (e.target.value.includes('Implant')) setCustomAmount('35000');
                else if (e.target.value.includes('Veneers')) setCustomAmount('10000');
                else if (e.target.value.includes('Aligner') && e.target.value.includes('Assessment')) setCustomAmount('500');
                else if (e.target.value.includes('Aligner')) setCustomAmount('80000');
                else if (e.target.value.includes('Scaling') || e.target.value.includes('Polish')) setCustomAmount('1499');
                else if (e.target.value.includes('Root Canal') || e.target.value.includes('RCT')) setCustomAmount('4500');
                else if (e.target.value.includes('Filling')) setCustomAmount('1800');
                else if (e.target.value.includes('Crown')) setCustomAmount('6500');
                else if (e.target.value.includes('Emergency')) setCustomAmount('750');
                else setCustomAmount('250');
              }}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            >
              <option value="General Dental Consultation">General Dental Consultation (₹250)</option>
              <option value="Cosmetic Smile Consultation">Cosmetic Smile Consultation (₹500)</option>
              <option value="Invisalign Aligner Assessment">Invisalign Aligner Assessment (₹500)</option>
              <option value="Dental Implant Consultation">Dental Implant Consultation (₹500)</option>
              <option value="Emergency Consultation">Emergency Consultation (₹750)</option>
              <option value="Routine Scaling & Polish">Routine Scaling & Polish (₹1,499)</option>
              <option value="Root Canal Treatment (RCT)">Root Canal Treatment (RCT) (₹4,500)</option>
              <option value="Composite Tooth Filling">Composite Tooth Filling (₹1,800)</option>
              <option value="Ceramic Crown Fitting">Ceramic Crown Fitting (₹6,500)</option>
              <option value="Single Dental Implant">Single Dental Implant (₹35,000)</option>
              <option value="Invisalign Clear Aligners">Invisalign Clear Aligners (₹80,000)</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Billing Charge (₹)</label>
            <input
              type="number"
              required
              value={customAmount}
              onChange={e => setCustomAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid var(--border-medium)',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Generate & Dispatch Invoice ➡️
          </button>
        </form>

        {/* Dispatch Alerts notification summary */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid var(--border-light)',
          borderRadius: '8px',
          padding: '12px 14px',
          marginTop: '20px',
          fontSize: '11px',
          color: 'var(--text-muted)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>🔒 Live Sync Verification</p>
          <p>Generating an invoice adds it to the clinic billing history and triggers an immediate email receipt containing PDF download parameters for the patient portal.</p>
        </div>
      </div>

    </div>
  );
};
