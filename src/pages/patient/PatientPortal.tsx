import React, { useState } from 'react';
import { useClinic, type Invoice } from '../../context/ClinicContext';
import { Download, Send, ShieldAlert, Image, ShieldCheck, CornerDownRight } from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const { 
    appointments, 
    patients, 
    invoices, 
    messages, 
    activePatientId, 
    setActivePatientId,
    addPatient,
    updateAppointmentStatus, 
    sendClinicMessage 
  } = useClinic();

  const [activePortalTab, setActivePortalTab] = useState<'appts' | 'clinical' | 'billing' | 'chat'>('appts');
  const [chatInput, setChatInput] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [activeXray, setActiveXray] = useState<string | null>(null);

  // Login / Register Gate Form States
  const [gateTab, setGateTab] = useState<'signin' | 'register'>('signin');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [regName, setRegName] = useState('');
  const [regAge, setRegAge] = useState('26');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regError, setRegError] = useState('');

  // Get active patient profile
  const patient = patients.find(p => p.id === activePatientId);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim()) return;

    const matchPat = patients.find(p => p.email.toLowerCase() === loginEmail.toLowerCase());
    if (matchPat) {
      setActivePatientId(matchPat.id);
      setLoginError('');
      setLoginEmail('');
    } else {
      setLoginError('❌ Patient record not found. Please verify the email or register below.');
    }
  };

  const handleManualRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone || !regEmail) return;

    const matchPat = patients.find(p => p.email.toLowerCase() === regEmail.toLowerCase());
    if (matchPat) {
      setRegError('⚠️ Email address already registered. Please sign in instead.');
      return;
    }

    const newPat = addPatient({
      name: regName,
      age: parseInt(regAge) || 26,
      phone: regPhone,
      email: regEmail,
      allergies: 'None declared',
      medicalHistory: 'New patient registered online via portal.'
    });

    setActivePatientId(newPat.id);
    setRegError('');
    setRegName('');
    setRegEmail('');
    setRegPhone('');
  };

  if (!patient) {
    return (
      <div className="fade-in" style={{ maxWidth: '440px', margin: '50px auto 90px', padding: '0 20px' }}>
        <div style={{
          background: '#ffffff',
          border: '0.5px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '36px',
          boxShadow: 'var(--shadow-lg)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            marginBottom: '16px'
          }}>
            🔒
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '8px' }}>Patient Portal Gateway</h2>
          <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.4 }}>
            Sign in to check clinical reports, timeline recall advice, schedules, and settle outstanding treatment invoices.
          </p>

          {/* Sign In / Register Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-secondary)',
            padding: '4px',
            borderRadius: '10px',
            border: '0.5px solid var(--border-light)',
            marginBottom: '20px'
          }}>
            <button
              type="button"
              onClick={() => { setGateTab('signin'); setLoginError(''); setRegError(''); }}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 600,
                background: gateTab === 'signin' ? '#ffffff' : 'transparent',
                color: gateTab === 'signin' ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: gateTab === 'signin' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setGateTab('register'); setLoginError(''); setRegError(''); }}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 600,
                background: gateTab === 'register' ? '#ffffff' : 'transparent',
                color: gateTab === 'register' ? 'var(--primary)' : 'var(--text-secondary)',
                boxShadow: gateTab === 'register' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              New Register
            </button>
          </div>

          {/* Form blocks */}
          {gateTab === 'signin' ? (
            <form onSubmit={handleManualLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="hammad@example.com"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-medium)',
                    outline: 'none',
                    fontSize: '13px'
                  }}
                />
              </div>

              {loginError && (
                <div style={{ color: '#dc2626', fontSize: '11px', background: '#fef2f2', padding: '8px 10px', borderRadius: '6px', border: '0.5px solid #fca5a5' }}>
                  {loginError}
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '6px' }}>
                Secure Sign In ➡️
              </button>

              {/* Demo Account Switcher list */}
              <div style={{ borderTop: '0.5px solid var(--border-light)', paddingTop: '20px', marginTop: '10px' }}>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 750, letterSpacing: '0.5px', marginBottom: '8px', textAlign: 'center' }}>
                  ⚡ Quick Demo Login Switcher
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {patients.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActivePatientId(p.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid var(--border-light)',
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-primary)',
                        cursor: 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        textAlign: 'left',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.background = 'var(--primary-light)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-light)';
                        e.currentTarget.style.background = 'var(--bg-secondary)';
                      }}
                    >
                      <span>👤 {p.name}</span>
                      <span style={{ fontSize: '10px', color: 'var(--primary)', fontWeight: 600 }}>Sign In ➡️</span>
                    </button>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleManualRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Patient Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Priya Patel"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', outline: 'none', fontSize: '13px' }}
                />
              </div>

              <div className="grid-cols-2" style={{ gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Age</label>
                  <input
                    type="number"
                    required
                    value={regAge}
                    onChange={e => setRegAge(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', outline: 'none', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Phone Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 XXXXX"
                    value={regPhone}
                    onChange={e => setRegPhone(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', outline: 'none', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="priya@example.com"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', outline: 'none', fontSize: '13px' }}
                />
              </div>

              {regError && (
                <div style={{ color: '#eab308', fontSize: '11.5px', background: '#fefbeb', padding: '8px 10px', borderRadius: '6px', border: '0.5px solid #fef08a' }}>
                  {regError}
                </div>
              )}

              <button type="submit" className="btn btn-accent" style={{ width: '100%', marginTop: '6px' }}>
                Register & Sign In ➡️
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // Filter records belonging to the active patient
  const patientAppts = appointments.filter(a => a.patientId === patient.id);
  const patientInvoices = invoices.filter(i => i.patientId === patient.id);

  // Group appointments into upcoming and past
  const upcomingAppts = patientAppts.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const pastAppts = patientAppts.filter(a => a.status === 'Completed' || a.status === 'No-Show');

  const handleCancelAppointment = (id: string) => {
    if (window.confirm("Are you sure you want to request cancellation for this appointment?")) {
      updateAppointmentStatus(id, 'No-Show', 'Cancelled by patient from portal.');
    }
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendClinicMessage(chatInput, 'patient');
    setChatInput('');
  };

  return (
    <div className="fade-in" style={{ maxWidth: '1000px', margin: '30px auto 80px', padding: '0 24px' }}>
      
      {/* Patient Profile Ribbon */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-light) 0%, #ffffff 100%)',
        border: '0.5px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '22px'
          }}>
            {patient.name.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Welcome Back, {patient.name}!</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Patient ID: <strong>{patient.id}</strong> | Phone: {patient.phone} | Email: {patient.email}
            </p>
          </div>
        </div>

        {/* Medical Warnings & Logout Action */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ 
            background: '#fee2e2', 
            color: '#991b1b', 
            border: '1px solid #fca5a5', 
            padding: '8px 14px', 
            borderRadius: '10px',
            fontSize: '11.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldAlert size={14} /> <strong>Allergies:</strong> {patient.allergies}
          </div>
          <div style={{ 
            background: 'var(--primary-light)', 
            color: 'var(--primary)', 
            border: '1px solid var(--border-medium)', 
            padding: '8px 14px', 
            borderRadius: '10px',
            fontSize: '11.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <ShieldCheck size={14} /> DPDP Protected
          </div>
          <button
            onClick={() => setActivePatientId('')}
            className="btn btn-ghost"
            style={{
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '11.5px',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            Log Out 🔓
          </button>
        </div>
      </div>

      {/* Navigation Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Portal Menu Column */}
        <div style={{
          background: '#ffffff',
          border: '0.5px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '16px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          {[
            { key: 'appts', label: '📅 Appointments', count: upcomingAppts.length },
            { key: 'clinical', label: '🦷 Clinical Records & X-rays', count: patient.xrays.length },
            { key: 'billing', label: '💳 Bills & Invoices', count: patientInvoices.filter(i => i.status === 'Pending').length },
            { key: 'chat', label: '💬 Direct Clinic Chat', count: null }
          ].map(menu => (
            <button
              key={menu.key}
              onClick={() => setActivePortalTab(menu.key as any)}
              className="btn btn-ghost"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '10px',
                background: activePortalTab === menu.key ? 'var(--primary-light)' : 'transparent',
                color: activePortalTab === menu.key ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: activePortalTab === menu.key ? 700 : 500,
                fontSize: '13px',
                marginBottom: '4px'
              }}
            >
              <span>{menu.label}</span>
              {menu.count !== null && menu.count > 0 && (
                <span style={{ 
                  background: menu.key === 'billing' ? 'var(--accent)' : 'var(--primary)', 
                  color: '#ffffff', 
                  fontSize: '10px', 
                  padding: '2px 6px', 
                  borderRadius: '10px' 
                }}>
                  {menu.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Portal Detail View Panel */}
        <div style={{
          background: '#ffffff',
          border: '0.5px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px',
          boxShadow: 'var(--shadow-md)',
          minHeight: '440px'
        }}>
          
          {/* TAB 1: Appointments */}
          {activePortalTab === 'appts' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Active Schedule</h3>
              
              {upcomingAppts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
                  {upcomingAppts.map(appt => (
                    <div 
                      key={appt.id}
                      style={{
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: '18px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span className={`pill ${appt.status === 'Confirmed' ? 'pill-new' : 'pill-core'}`}>
                            {appt.status}
                          </span>
                          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {appt.id}</span>
                        </div>
                        <h4 style={{ fontSize: '15px', fontWeight: 600 }}>{appt.service}</h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Date: <strong>{appt.date}</strong> | Slot: <strong>{appt.timeSlot}</strong>
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '8px 12px', fontSize: '12px' }}
                          onClick={() => alert("To reschedule, please message our support chat directly in the 'Direct Clinic Chat' panel.")}
                        >
                          Reschedule
                        </button>
                        <button 
                          className="btn btn-ghost" 
                          style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--danger)', border: '1px solid #fecaca' }}
                          onClick={() => handleCancelAppointment(appt.id)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No active upcoming sessions registered.
                </div>
              )}

              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', borderTop: '0.5px solid var(--border-light)', paddingTop: '24px' }}>
                Past Visit History
              </h3>
              {pastAppts.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {pastAppts.map(appt => (
                    <div 
                      key={appt.id}
                      style={{
                        background: 'var(--bg-secondary)',
                        border: '0.5px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: '14px 18px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <h4 style={{ fontSize: '14.5px', fontWeight: 600, textDecoration: appt.status === 'No-Show' ? 'line-through' : 'none' }}>{appt.service}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Visited on {appt.date} at {appt.timeSlot}</p>
                      </div>
                      <span className={`pill ${appt.status === 'Completed' ? 'pill-new' : 'pill-admin'}`} style={{ opacity: 0.8 }}>
                        {appt.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No past appointment clinical histories discovered.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Clinical Records & X-rays */}
          {activePortalTab === 'clinical' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Dental Treatment Timeline</h3>
              
              {pastAppts.filter(a => a.status === 'Completed').length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
                  {pastAppts.filter(a => a.status === 'Completed').map((appt) => (
                    <div key={appt.id} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                      {/* Timeline line decoration */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          background: 'var(--primary)',
                          border: '2px solid #ffffff',
                          boxShadow: 'var(--shadow-sm)',
                          zIndex: 2
                        }} />
                        <div style={{ width: '2px', flex: 1, background: 'var(--border-medium)', marginTop: '4px' }} />
                      </div>
                      
                      <div style={{
                        flex: 1,
                        background: 'var(--bg-secondary)',
                        border: '0.5px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        marginBottom: '10px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>{appt.date}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Dr. Sarah Vance</span>
                        </div>
                        <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>{appt.service}</h4>
                        <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {appt.notes || 'Routine checkup completed successfully.'}
                        </p>
                        {appt.treatmentPlan && (
                          <div style={{ marginTop: '10px', paddingLeft: '8px', borderLeft: '2px solid var(--primary-light)', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                            <CornerDownRight size={12} style={{ marginTop: '2px', flexShrink: 0 }} />
                            <span><strong>Next Step Plan:</strong> {appt.treatmentPlan}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '40px' }}>
                  No historical clinical procedure plans on file.
                </div>
              )}

              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px', borderTop: '0.5px solid var(--border-light)', paddingTop: '24px' }}>
                Secure Radiographs (X-rays)
              </h3>
              {patient.xrays.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '16px' }}>
                  {patient.xrays.map((xr, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setActiveXray(xr)}
                      style={{
                        border: '0.5px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative',
                        aspectRatio: '1',
                        background: '#000000',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                    >
                      <img 
                        src={xr} 
                        alt="Radiograph file" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                      />
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0',
                        right: '0',
                        background: 'rgba(0,0,0,0.6)',
                        padding: '4px 8px',
                        color: '#ffffff',
                        fontSize: '9px',
                        textAlign: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}>
                        <Image size={10} /> Panoramic X-ray
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No radiograph scans uploaded for your active record.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Bills & Invoices */}
          {activePortalTab === 'billing' && (
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Invoices & Financial Summary</h3>
              
              {patientInvoices.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {patientInvoices.map(inv => (
                    <div 
                      key={inv.id}
                      style={{
                        border: '1px solid var(--border-light)',
                        borderRadius: 'var(--radius-md)',
                        padding: '16px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {inv.id}</span>
                          <span className={`pill ${
                            inv.status === 'Paid' ? 'pill-new' : inv.status === 'Pending' ? 'pill-core' : 'pill-admin'
                          }`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                            {inv.status}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '14.5px', fontWeight: 600 }}>{inv.service}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Issued on {inv.date}</p>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)' }}>₹{inv.amount}</span>
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: '8px 12px', fontSize: '12px' }}
                          onClick={() => setSelectedInvoice(inv)}
                        >
                          <Download size={12} /> View Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No payment invoice records discovered.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Direct Chat */}
          {activePortalTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
              <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '12px', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Direct Reception Desk Comms</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ask questions about rescheduling, billing, or pre-visit forms.</p>
              </div>

              {/* Chat Thread */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '12px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                border: '0.5px solid var(--border-light)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '16px'
              }}>
                {messages.map(msg => (
                  <div 
                    key={msg.id}
                    className={`fade-in`}
                    style={{
                      maxWidth: '75%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      lineHeight: 1.4,
                      alignSelf: msg.sender === 'patient' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'patient' ? 'var(--primary)' : '#ffffff',
                      color: msg.sender === 'patient' ? '#ffffff' : 'var(--text-primary)',
                      borderBottomRightRadius: msg.sender === 'patient' ? '2px' : '12px',
                      borderBottomLeftRadius: msg.sender === 'clinic' ? '2px' : '12px',
                      boxShadow: 'var(--shadow-sm)',
                      border: msg.sender === 'clinic' ? '0.5px solid var(--border-light)' : 'none'
                    }}
                  >
                    <p>{msg.text}</p>
                    <span style={{ 
                      display: 'block', 
                      fontSize: '9px', 
                      color: msg.sender === 'patient' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                      textAlign: 'right',
                      marginTop: '4px' 
                    }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Type message to the front desk receptionists..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  style={{
                    flex: 1,
                    border: '1px solid var(--border-medium)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '10px 16px' }}>
                  <Send size={14} /> Send
                </button>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* MODAL 1: Full Size X-ray Viewer Overlay */}
      {activeXray && (
        <div 
          onClick={() => setActiveXray(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.9)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px'
          }}
        >
          <div style={{ maxWidth: '640px', width: '100%', position: 'relative' }}>
            <img 
              src={activeXray} 
              alt="Panoramic Radiograph" 
              style={{ width: '100%', borderRadius: '12px', border: '3px solid #334155' }}
            />
            <p style={{ color: '#ffffff', textAlign: 'center', marginTop: '12px', fontSize: '13px' }}> Panoramic dental charting scan. Patient: {patient.name} </p>
            <p style={{ color: 'rgba(255,255,255,0.6)', textAlign: 'center', fontSize: '11px' }}>Click anywhere to collapse view</p>
          </div>
        </div>
      )}

      {/* MODAL 2: Beautiful Invoice Receipt Overlay */}
      {selectedInvoice && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div className="fade-in" style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-medium)',
            padding: '40px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: 'var(--shadow-lg)',
            color: '#334155'
          }}>
            {/* Receipt Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-light)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '20px', color: 'var(--primary)', fontWeight: 800 }}>DentalCare Clinic</h2>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mumbai Health Tower, Bandra</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`pill ${selectedInvoice.status === 'Paid' ? 'pill-new' : 'pill-admin'}`}>
                  {selectedInvoice.status}
                </span>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Invoice: {selectedInvoice.id}</p>
              </div>
            </div>

            {/* Receipt Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', marginBottom: '24px' }}>
              <p><strong>Patient Name:</strong> {selectedInvoice.patientName}</p>
              <p><strong>Billing Date:</strong> {selectedInvoice.date}</p>
              <p><strong>Insurance Coverage:</strong> None / Out-of-pocket</p>
              
              <div style={{
                background: 'var(--bg-secondary)',
                borderRadius: '8px',
                padding: '12px',
                border: '0.5px solid var(--border-light)',
                marginTop: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, borderBottom: '0.5px solid var(--border-medium)', paddingBottom: '6px', marginBottom: '6px' }}>
                  <span>Service / Treatment</span>
                  <span>Charges</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>{selectedInvoice.service}</span>
                  <span>₹{selectedInvoice.amount}</span>
                </div>
              </div>
            </div>

            {/* Total Balance */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--border-light)', paddingTop: '16px', marginBottom: '30px' }}>
              <span style={{ fontWeight: 700, fontSize: '14px' }}>Total Charge:</span>
              <span style={{ fontWeight: 800, fontSize: '24px', color: 'var(--primary)' }}>₹{selectedInvoice.amount}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={() => {
                  alert("Receipt successfully dispatched for printing/download.");
                  setSelectedInvoice(null);
                }}
              >
                Download PDF
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedInvoice(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
