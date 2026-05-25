import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { Home } from './pages/patient/Home';
import { Services } from './pages/patient/Services';
import { BookingFlow } from './pages/patient/BookingFlow';
import { PatientPortal } from './pages/patient/PatientPortal';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminCalendar } from './pages/admin/AdminCalendar';
import { PatientManagement } from './pages/admin/PatientManagement';
import { AdminBilling } from './pages/admin/AdminBilling';
import { AIChatbot } from './components/AIChatbot';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Sparkles, Calendar, LayoutDashboard, Users, CreditCard, ToggleLeft, ToggleRight, ArrowLeft } from 'lucide-react';

const AppContent: React.FC = () => {
  const { appointments, invoices } = useClinic();
  
  // High-Level View state
  const [viewMode, setViewMode] = useState<'patient' | 'clinic'>('patient');

  // Page selection states
  const [patientTab, setPatientTab] = useState<'home' | 'services' | 'booking' | 'portal'>('home');
  const [clinicPanel, setClinicPanel] = useState<'dashboard' | 'calendar' | 'patients' | 'billing'>('dashboard');
  
  // Navigation passing parameter
  const [selectedServiceId, setSelectedServiceId] = useState('');

  // Pending items indicators
  const pendingBookingCount = appointments.filter(a => a.status === 'Pending').length;
  const pendingInvoiceCount = invoices.filter(i => i.status === 'Pending').length;

  return (
    <div className={viewMode === 'clinic' ? 'admin-theme' : ''} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Demo Switcher Bar */}
      <div className="demo-switcher">
        <div className="demo-logo">
          <Sparkles size={18} style={{ color: 'var(--primary)' }} />
          <span>DentalCare <strong style={{ color: 'var(--primary)', fontWeight: 800 }}>INTEGRATED SUITE</strong></span>
        </div>
        <div className="demo-controls">
          <span className="mode-badge">
            Current Module: <strong>{viewMode === 'patient' ? 'Patient Portal' : 'Clinic CRM'}</strong>
          </span>
          <button 
            className="switcher-btn"
            onClick={() => {
              const nextMode = viewMode === 'patient' ? 'clinic' : 'patient';
              setViewMode(nextMode);
            }}
          >
            {viewMode === 'patient' ? (
              <>
                Switch to Clinic Panel <ToggleLeft size={16} />
              </>
            ) : (
              <>
                Switch to Patient Site <ToggleRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* RENDER MODE 1: Patient-Facing Website */}
      {viewMode === 'patient' ? (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--bg-secondary)' }}>
          {/* Patient Header Navigation */}
          <header style={{
            background: '#ffffff',
            borderBottom: '1px solid var(--border-light)',
            padding: '16px 24px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                onClick={() => setPatientTab('home')}
              >
                <div style={{ background: 'var(--primary)', padding: '6px', borderRadius: '50%', color: '#ffffff', display: 'flex' }}>
                  <Sparkles size={16} />
                </div>
                <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>DentalCare</span>
              </div>

              {/* Navigation Links */}
              <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {[
                  { key: 'home', label: 'Home' },
                  { key: 'services', label: 'Services' },
                  { key: 'booking', label: 'Book Appointment' },
                  { key: 'portal', label: 'Patient Portal' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setSelectedServiceId('');
                      setPatientTab(tab.key as any);
                    }}
                    className="btn btn-ghost"
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '13.5px',
                      background: patientTab === tab.key ? 'var(--primary-light)' : 'transparent',
                      color: patientTab === tab.key ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: patientTab === tab.key ? 700 : 500
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>

              <button className="btn btn-primary" onClick={() => setPatientTab('booking')}>
                <Calendar size={16} /> Book Online
              </button>
            </div>
          </header>

          {/* Patient Main Workspace */}
          <main style={{ flex: 1 }}>
            {patientTab === 'home' && <Home setPatientTab={setPatientTab} />}
            {patientTab === 'services' && (
              <Services 
                setPatientTab={setPatientTab} 
                setSelectedServiceId={setSelectedServiceId} 
              />
            )}
            {patientTab === 'booking' && (
              <BookingFlow 
                setPatientTab={setPatientTab}
                selectedServiceId={selectedServiceId}
                setSelectedServiceId={setSelectedServiceId}
              />
            )}
            {patientTab === 'portal' && <PatientPortal />}
          </main>

          {/* Interactive floating widgets */}
          <AIChatbot setViewMode={setViewMode} setPatientTab={setPatientTab} />
          <WhatsAppButton />

          {/* Footnotes bar */}
          <footer style={{ background: '#ffffff', borderTop: '0.5px solid var(--border-light)', padding: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            <p>© 2026 DentalCare Group Mumbai Clinic. Fully secure, DPDP Act 2023 compliant patient charting database.</p>
          </footer>
        </div>
      ) : (
        // RENDER MODE 2: Clinic Admin command console
        <div style={{ display: 'flex', flex: 1, backgroundColor: 'var(--bg-secondary)' }}>
          {/* Admin Sidebar navigation */}
          <aside style={{
            width: '260px',
            background: 'var(--bg-tertiary)',
            borderRight: '1px solid var(--border-light)',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px' }}>
                <LayoutDashboard size={20} style={{ color: 'var(--primary)' }} />
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800 }}>Clinic Console</h3>
                  <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Reception & Care Desk</p>
                </div>
              </div>

              {/* Sidebar Menu items */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {[
                  { key: 'dashboard', label: 'Command Center', icon: LayoutDashboard, badge: pendingBookingCount },
                  { key: 'calendar', label: 'Live Calendar', icon: Calendar, badge: null },
                  { key: 'patients', label: 'Patient Records', icon: Users, badge: null },
                  { key: 'billing', label: 'Billing & Invoices', icon: CreditCard, badge: pendingInvoiceCount }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setClinicPanel(item.key as any)}
                    className="btn btn-ghost"
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      background: clinicPanel === item.key ? 'var(--primary-light)' : 'transparent',
                      color: clinicPanel === item.key ? 'var(--primary)' : 'var(--text-secondary)',
                      fontWeight: clinicPanel === item.key ? 700 : 500,
                      fontSize: '13px'
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <item.icon size={16} />
                      {item.label}
                    </span>
                    {item.badge !== null && item.badge > 0 && (
                      <span style={{ background: 'var(--accent)', color: '#ffffff', fontSize: '9px', padding: '2px 6px', borderRadius: '10px' }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', fontSize: '12px', padding: '8px 12px' }}
                onClick={() => setViewMode('patient')}
              >
                <ArrowLeft size={14} /> Back to Patient Site
              </button>
              <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', marginTop: '8px' }}>
                Logged in: Administrator
              </div>
            </div>
          </aside>

          {/* Admin Main Workspace panel */}
          <main style={{ flex: 1, padding: '36px', overflowY: 'auto' }}>
            {clinicPanel === 'dashboard' && <AdminDashboard setClinicPanel={setClinicPanel} />}
            {clinicPanel === 'calendar' && <AdminCalendar />}
            {clinicPanel === 'patients' && <PatientManagement />}
            {clinicPanel === 'billing' && <AdminBilling />}
          </main>
        </div>
      )}

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ClinicProvider>
      <AppContent />
    </ClinicProvider>
  );
};

export default App;
