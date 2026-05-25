import React, { useState } from 'react';
import { useClinic, type Appointment } from '../../context/ClinicContext';
import { Users, DollarSign, Calendar, AlertTriangle, CheckCircle, UserPlus, MessageSquare } from 'lucide-react';

interface AdminDashboardProps {
  setClinicPanel: (panel: 'dashboard' | 'calendar' | 'patients' | 'billing') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setClinicPanel }) => {
  const { 
    appointments, 
    patients, 
    invoices, 
    messages, 
    updateAppointmentStatus, 
    bookAppointment,
    clinicalTreatments
  } = useClinic();

  const [walkinModalOpen, setWalkinModalOpen] = useState(false);
  const [completeModalAppt, setCompleteModalAppt] = useState<Appointment | null>(null);
  
  // Clinical Completion State inputs
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [treatmentPlan, setTreatmentPlan] = useState('');
  const [selectedTreatments, setSelectedTreatments] = useState<string[]>([]);

  // Walk-in form state
  const [walkinName, setWalkinName] = useState('');
  const [walkinAge, setWalkinAge] = useState('');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinEmail, setWalkinEmail] = useState('');
  const [walkinNotes, setWalkinNotes] = useState('');
  const [walkinDoctor, setWalkinDoctor] = useState('dr-vance');
  const [walkinService, setWalkinService] = useState('General Dental Consultation');
  const [walkinSlot, setWalkinSlot] = useState('02:00 PM');

  // Relative to base local date 2026-05-25
  const todayStr = '2026-05-25';

  const todayAppts = appointments.filter(a => a.date === todayStr);
  const activePatients = patients.length;
  const noShowsCount = appointments.filter(a => a.status === 'No-Show').length;
  
  // Calculate today's revenue (Sum of all invoices paid or created today)
  const todayRevenue = invoices
    .filter(i => i.date === todayStr && i.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);

  const handleRegisterWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName || !walkinPhone || !walkinEmail) return;

    // Register booking directly (which auto-registers patient if new)
    bookAppointment({
      patientId: `pat-${Date.now()}`,
      patientName: walkinName,
      patientAge: parseInt(walkinAge) || 30,
      patientPhone: walkinPhone,
      patientEmail: walkinEmail,
      dentistId: walkinDoctor,
      service: walkinService,
      date: todayStr,
      timeSlot: walkinSlot,
      status: 'Confirmed',
      notes: walkinNotes
    });

    alert("Walk-in registration successfully completed! Synced to schedule grid.");
    setWalkinModalOpen(false);
    
    // Reset walkin inputs
    setWalkinName('');
    setWalkinAge('');
    setWalkinPhone('');
    setWalkinEmail('');
    setWalkinNotes('');
  };

  const handleOpenCompletionModal = (appt: Appointment) => {
    setCompleteModalAppt(appt);
    setClinicalNotes('');
    setTreatmentPlan('');
    setSelectedTreatments([]);
  };

  const handleConfirmCompletion = () => {
    if (!completeModalAppt) return;
    updateAppointmentStatus(completeModalAppt.id, 'Completed', clinicalNotes, treatmentPlan, selectedTreatments);
    setCompleteModalAppt(null);
    alert("Appointment successfully registered as Completed. Performed treatments recorded & invoices auto-dispatched.");
  };

  return (
    <div className="fade-in" style={{ color: 'var(--text-primary)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Practice Command Center</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Clinic KPI summary, scheduling verification, and walk-in intakes for {todayStr}.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-primary" onClick={() => setWalkinModalOpen(true)}>
            <UserPlus size={16} /> Add Walk-in
          </button>
          <button className="btn btn-secondary" onClick={() => setClinicPanel('calendar')}>
            View Live Calendar
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-cols-4" style={{ marginBottom: '30px' }}>
        {[
          { label: "Today's Schedule", val: todayAppts.length, sub: `${todayAppts.filter(a => a.status === 'Pending').length} pending confirm`, icon: Calendar, color: 'var(--primary)' },
          { label: "Live Cashflow Today", val: `₹${todayRevenue}`, sub: "Settled invoices", icon: DollarSign, color: 'var(--success)' },
          { label: "Total Patients", val: activePatients, sub: "Registered base records", icon: Users, color: 'var(--secondary)' },
          { label: "No-Show Incidents", val: noShowsCount, sub: "Requires recall reminder", icon: AlertTriangle, color: 'var(--danger)' }
        ].map((card, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>{card.label}</p>
              <h3 style={{ fontSize: '28px', fontWeight: 800, margin: '4px 0' }}>{card.val}</h3>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{card.sub}</p>
            </div>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              color: card.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <card.icon size={22} />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Today's Queue & System alerts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'flex-start' }}>
        
        {/* Today's Queue list */}
        <div style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Today's Clinical Queue</h3>
          
          {todayAppts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {todayAppts.map(appt => (
                <div
                  key={appt.id}
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>{appt.timeSlot}</span>
                      <span className={`pill ${
                        appt.status === 'Completed' ? 'pill-new' : appt.status === 'Confirmed' ? 'pill-core' : 'pill-admin'
                      }`} style={{ fontSize: '9px', padding: '1px 6px' }}>
                        {appt.status}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 600 }}>{appt.patientName} (Age: {appt.patientAge})</h4>
                    <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Service: {appt.service} | Dr. {appt.dentistId === 'dr-vance' ? 'Vance' : appt.dentistId === 'dr-thorne' ? 'Thorne' : 'Rostova'}</p>
                    {appt.notes && <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px' }}>Note: "{appt.notes}"</p>}
                  </div>
                  
                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {appt.status === 'Pending' && (
                      <button 
                        className="btn btn-primary"
                        style={{ padding: '6px 10px', fontSize: '11px' }}
                        onClick={() => updateAppointmentStatus(appt.id, 'Confirmed')}
                      >
                        Confirm Slot
                      </button>
                    )}
                    {appt.status === 'Confirmed' && (
                      <button 
                        className="btn btn-primary"
                        style={{ padding: '6px 10px', fontSize: '11px', background: 'var(--success)' }}
                        onClick={() => handleOpenCompletionModal(appt)}
                      >
                        Complete
                      </button>
                    )}
                    {(appt.status === 'Pending' || appt.status === 'Confirmed') && (
                      <button 
                        className="btn btn-ghost"
                        style={{ padding: '6px 10px', fontSize: '11px', color: 'var(--danger)', border: '0.5px solid var(--border-medium)' }}
                        onClick={() => updateAppointmentStatus(appt.id, 'No-Show', 'No-show check by admin')}
                      >
                        No-Show
                      </button>
                    )}
                    {appt.status === 'Completed' && (
                      <span style={{ fontSize: '11px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                        <CheckCircle size={12} /> Settled
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: '13px' }}>
              No appointments registered in the clinical queue today.
            </div>
          )}
        </div>

        {/* AI Clinic Alerts Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Smart Alerts */}
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertTriangle size={16} style={{ color: 'var(--warning)' }} /> Staff Notifications
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {/* Alert 1 */}
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--accent)', fontSize: '12px' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>New Patient Chat Enquiry</p>
                <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>Active messages from patient portal waiting response.</p>
                <button 
                  onClick={() => setClinicPanel('patients')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '11px', cursor: 'pointer', padding: 0, marginTop: '6px' }}
                >
                  Reply Now 💬
                </button>
              </div>
              {/* Alert 2 */}
              <div style={{ background: 'var(--bg-primary)', padding: '12px', borderRadius: '8px', borderLeft: '3px solid var(--warning)', fontSize: '12px' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Overdue Invoice Alert</p>
                <p style={{ color: 'var(--text-muted)', marginTop: '2px' }}>Aisha Sharma: Invoice inv-4 ($129) is 15 days overdue.</p>
                <button 
                  onClick={() => setClinicPanel('billing')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, fontSize: '11px', cursor: 'pointer', padding: 0, marginTop: '6px' }}
                >
                  Re-send Reminder 📲
                </button>
              </div>
            </div>
          </div>

          {/* Quick Chat responder preview */}
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            boxShadow: 'var(--shadow-md)'
          }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MessageSquare size={16} style={{ color: 'var(--primary)' }} /> Live Message Sync
            </h3>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Last patient text: <strong>"{messages[messages.length - 1]?.text}"</strong>
            </p>
            <button className="btn btn-secondary" style={{ width: '100%', fontSize: '12px', padding: '8px 12px' }} onClick={() => setClinicPanel('patients')}>
              Open Active Message Thread
            </button>
          </div>

        </div>
      </div>

      {/* MODAL 1: Add Walk-in Patient Enrollment */}
      {walkinModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(3px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <form 
            onSubmit={handleRegisterWalkIn}
            className="fade-in"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '30px',
              maxWidth: '540px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              color: 'var(--text-primary)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Intake Form - Walk-in Booking</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div className="grid-cols-2" style={{ gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>Patient Full Name</label>
                  <input 
                    type="text" required value={walkinName} onChange={e => setWalkinName(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>Age</label>
                  <input 
                    type="number" required value={walkinAge} onChange={e => setWalkinAge(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
              </div>

              <div className="grid-cols-2" style={{ gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>Phone Number</label>
                  <input 
                    type="tel" required value={walkinPhone} onChange={e => setWalkinPhone(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>Email Address</label>
                  <input 
                    type="email" required value={walkinEmail} onChange={e => setWalkinEmail(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
              </div>

              <div className="grid-cols-3" style={{ gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>Assigned Dentist</label>
                  <select 
                    value={walkinDoctor} onChange={e => setWalkinDoctor(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value="dr-vance">Dr. Vance (Cosmetic)</option>
                    <option value="dr-thorne">Dr. Thorne (Surgery)</option>
                    <option value="dr-rostova">Dr. Rostova (Ortho)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>Service Type</label>
                  <select 
                    value={walkinService} onChange={e => setWalkinService(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value="General Dental Consultation">General Dental Consultation</option>
                    <option value="Cosmetic Smile Consultation">Cosmetic Smile Consultation</option>
                    <option value="Invisalign Aligner Assessment">Invisalign Aligner Assessment</option>
                    <option value="Dental Implant Consultation">Dental Implant Consultation</option>
                    <option value="Emergency Consultation">Emergency Consultation</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>Time Slot</label>
                  <select 
                    value={walkinSlot} onChange={e => setWalkinSlot(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:30 PM">03:30 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>Medical History / Intake Notes</label>
                <textarea 
                  rows={2} value={walkinNotes} onChange={e => setWalkinNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Register & Schedule</button>
              <button type="button" className="btn btn-secondary" onClick={() => setWalkinModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL 2: Clinical Completion File details */}
      {completeModalAppt && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(3px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <div 
            className="fade-in"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              color: 'var(--text-primary)'
            }}
          >
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Complete Clinical Treatment File</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Write clinical observations and recall guidelines for <strong>{completeModalAppt.patientName}</strong>. This updates their patient portal instantly.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Clinical Diagnostic Notes</label>
                <textarea 
                  rows={2} 
                  required 
                  value={clinicalNotes} 
                  onChange={e => setClinicalNotes(e.target.value)}
                  placeholder="e.g. Patient presents with acute toothache. Formulated treatment plan for RCT and full scaling..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>

              {/* Treatments Performed & Prescribed Selectors */}
              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '6px', fontWeight: 600 }}>Treatments Performed Today (Checkout Invoice)</label>
                <div style={{ 
                  background: 'var(--bg-primary)', 
                  border: '1px solid var(--border-medium)', 
                  borderRadius: '8px', 
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxHeight: '130px',
                  overflowY: 'auto'
                }}>
                  {clinicalTreatments.map(t => {
                    const isChecked = selectedTreatments.includes(t.name);
                    return (
                      <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedTreatments(prev => prev.filter(item => item !== t.name));
                            } else {
                              setSelectedTreatments(prev => [...prev, t.name]);
                            }
                          }}
                          style={{ accentColor: 'var(--primary)' }}
                        />
                        <span style={{ flex: 1 }}>{t.name}</span>
                        <span style={{ fontWeight: 700, color: 'var(--primary)' }}>₹{t.price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Follow-up Care Plan / Recall</label>
                <textarea 
                  rows={2} 
                  value={treatmentPlan} 
                  onChange={e => setTreatmentPlan(e.target.value)}
                  placeholder="e.g. Scaling recall in 6 months. Avoid chewing hot foods."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button type="button" className="btn btn-primary" style={{ flex: 1, background: 'var(--success)' }} onClick={handleConfirmCompletion}>
                Confirm Treatment & Invoice Payment
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setCompleteModalAppt(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
