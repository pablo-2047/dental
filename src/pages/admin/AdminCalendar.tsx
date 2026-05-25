import React, { useState } from 'react';
import { useClinic, type Appointment } from '../../context/ClinicContext';
import { Plus, X } from 'lucide-react';

export const AdminCalendar: React.FC = () => {
  const { appointments, dentists, bookAppointment } = useClinic();
  const [selectedDate, setSelectedDate] = useState('2026-05-25'); // Today's baseline date
  const [activeDentistFilter, setActiveDentistFilter] = useState<'all' | 'dr-vance' | 'dr-thorne' | 'dr-rostova'>('all');
  const [hoveredAppt, setHoveredAppt] = useState<Appointment | null>(null);

  // Quick book slot modal states
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [modalDoctor, setModalDoctor] = useState('');
  const [modalSlot, setModalSlot] = useState('');
  const [patName, setPatName] = useState('');
  const [patAge, setPatAge] = useState('28');
  const [patPhone, setPatPhone] = useState('');
  const [patEmail, setPatEmail] = useState('');
  const [patNotes, setPatNotes] = useState('');
  const [patService, setPatService] = useState('General Dental Consultation');

  const timeSlots = ['09:00 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];
  
  // Date options starting 2026-05-25 (Next 5 days)
  const dateOptions = ['2026-05-25', '2026-05-26', '2026-05-27', '2026-05-28', '2026-05-29'];

  const activeDentists = dentists.filter(d => activeDentistFilter === 'all' || d.id === activeDentistFilter);

  const handleOpenBookModal = (docId: string, slot: string) => {
    setModalDoctor(docId);
    setModalSlot(slot);
    setPatName('');
    setPatPhone('');
    setPatEmail('');
    setPatNotes('');
    setBookModalOpen(true);
  };

  const handleCreateQuickBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patName || !patPhone || !patEmail) return;

    bookAppointment({
      patientId: `pat-${Date.now()}`,
      patientName: patName,
      patientAge: parseInt(patAge) || 28,
      patientPhone: patPhone,
      patientEmail: patEmail,
      dentistId: modalDoctor,
      service: patService,
      date: selectedDate,
      timeSlot: modalSlot,
      status: 'Confirmed',
      notes: patNotes
    });

    alert("Appointment booked directly on calendar slot!");
    setBookModalOpen(false);
  };

  return (
    <div className="fade-in">
      {/* Calendar Toolbar Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 800 }}>Clinical Scheduling Grid</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>Verify daily slots, track multi-doctor availability, and schedule patients directly.</p>
        </div>
        
        {/* Date Selector Carousel */}
        <div style={{ display: 'flex', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
          {dateOptions.map(dStr => {
            const dateObj = new Date(dStr);
            const isSelected = selectedDate === dStr;
            return (
              <button
                key={dStr}
                onClick={() => setSelectedDate(dStr)}
                style={{
                  border: 'none',
                  outline: 'none',
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)'
                }}
              >
                {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dentist Columns Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '24px',
        borderBottom: '1px solid var(--border-light)',
        paddingBottom: '16px',
        flexWrap: 'wrap'
      }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Filter Column:</span>
        <button 
          className="btn" 
          style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12.5px', background: activeDentistFilter === 'all' ? 'rgba(255,255,255,0.08)' : 'transparent', color: activeDentistFilter === 'all' ? 'var(--primary)' : 'var(--text-secondary)', border: activeDentistFilter === 'all' ? '1px solid var(--primary)' : '1px solid transparent' }}
          onClick={() => setActiveDentistFilter('all')}
        >
          All Doctors
        </button>
        {dentists.map(doc => (
          <button
            key={doc.id}
            className="btn"
            style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12.5px', background: activeDentistFilter === doc.id ? 'rgba(255,255,255,0.08)' : 'transparent', color: activeDentistFilter === doc.id ? 'var(--primary)' : 'var(--text-secondary)', border: activeDentistFilter === doc.id ? '1px solid var(--primary)' : '1px solid transparent' }}
            onClick={() => setActiveDentistFilter(doc.id as any)}
          >
            {doc.name}
          </button>
        ))}
      </div>

      {/* Multi-Doctor Calendar Matrix Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `80px repeat(${activeDentists.length}, 1fr)`,
        gap: '16px',
        alignItems: 'stretch'
      }}>
        
        {/* Empty top corner */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>TIME</div>

        {/* Doctor Column Headers */}
        {activeDentists.map(doc => (
          <div 
            key={doc.id}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <img src={doc.image} alt={doc.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 600 }}>{doc.name}</h4>
              <p style={{ fontSize: '10px', color: 'var(--primary)' }}>{doc.specialty}</p>
            </div>
          </div>
        ))}

        {/* Hours & Grid Cells Row Loop */}
        {timeSlots.map(slot => (
          <React.Fragment key={slot}>
            
            {/* Left Hand Time Cell */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--text-muted)',
              borderRight: '1px solid var(--border-light)'
            }}>
              {slot}
            </div>

            {/* Doctor availability slots */}
            {activeDentists.map(doc => {
              // Find matching appointment
              const match = appointments.find(
                a => a.date === selectedDate && a.timeSlot === slot && a.dentistId === doc.id
              );

              return (
                <div 
                  key={`${doc.id}-${slot}`}
                  style={{
                    minHeight: '80px',
                    position: 'relative'
                  }}
                >
                  {match ? (
                    // Display Booked Appointment Card
                    <div
                      onMouseEnter={() => setHoveredAppt(match)}
                      onMouseLeave={() => setHoveredAppt(null)}
                      style={{
                        background: match.status === 'Completed' ? 'var(--primary-light)' : match.status === 'Confirmed' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                        border: `1.5px solid ${
                          match.status === 'Completed' ? 'var(--primary)' : match.status === 'Confirmed' ? '#3b82f6' : 'var(--accent)'
                        }`,
                        borderRadius: '8px',
                        padding: '10px 12px',
                        height: '100%',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      <div>
                        <h5 style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>{match.patientName}</h5>
                        <p style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>{match.service}</p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '9px', color: 'var(--text-muted)' }}>
                        <span>Age: {match.patientAge}</span>
                        <span style={{ 
                          fontWeight: 600, 
                          color: match.status === 'Completed' ? 'var(--success)' : match.status === 'Confirmed' ? '#3b82f6' : 'var(--accent)' 
                        }}>
                          {match.status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    // Empty grid cell -> click to schedule quick booking
                    <button
                      onClick={() => handleOpenBookModal(doc.id, slot)}
                      style={{
                        width: '100%',
                        height: '100%',
                        background: 'transparent',
                        border: '1.5px dashed var(--border-medium)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '11px',
                        transition: 'var(--transition-fast)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--primary)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border-medium)';
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Plus size={14} style={{ marginRight: '4px' }} /> Schedule
                    </button>
                  )}
                </div>
              );
            })}

          </React.Fragment>
        ))}

      </div>

      {/* POPUP: Hover Tooltip info sheet */}
      {hoveredAppt && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 20px',
          width: '280px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
          color: 'var(--text-primary)',
          fontSize: '12.5px'
        }}>
          <h4 style={{ fontWeight: 700, fontSize: '13.5px', marginBottom: '6px', borderBottom: '1px solid var(--border-light)', paddingBottom: '4px' }}>Patient Details Hover</h4>
          <p><strong>Name:</strong> {hoveredAppt.patientName}</p>
          <p><strong>Age:</strong> {hoveredAppt.patientAge} | Phone: {hoveredAppt.patientPhone}</p>
          <p><strong>Clinical Reason:</strong> {hoveredAppt.notes || 'Routine consult'}</p>
          {hoveredAppt.treatmentPlan && <p style={{ color: 'var(--primary)', marginTop: '4px' }}><strong>Plan:</strong> {hoveredAppt.treatmentPlan}</p>}
        </div>
      )}

      {/* MODAL: Book appointment directly on selected slot */}
      {bookModalOpen && (
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
            onSubmit={handleCreateQuickBooking}
            className="fade-in"
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              padding: '30px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: 'var(--shadow-lg)',
              color: 'var(--text-primary)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700 }}>Quick Book Calendar Slot</h3>
              <button type="button" onClick={() => setBookModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Scheduling with <strong>{dentists.find(d => d.id === modalDoctor)?.name}</strong> on {selectedDate} at {modalSlot}.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
              <div className="grid-cols-2" style={{ gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Patient Name</label>
                  <input 
                    type="text" required value={patName} onChange={e => setPatName(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Age</label>
                  <input 
                    type="number" required value={patAge} onChange={e => setPatAge(e.target.value)}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Phone Number</label>
                <input 
                  type="tel" required value={patPhone} onChange={e => setPatPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Email Address</label>
                <input 
                  type="email" required value={patEmail} onChange={e => setPatEmail(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Dental Procedure</label>
                <select 
                  value={patService} onChange={e => setPatService(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }}
                >
                  <option value="General Dental Consultation">General Dental Consultation</option>
                  <option value="Cosmetic Smile Consultation">Cosmetic Smile Consultation</option>
                  <option value="Invisalign Aligner Assessment">Invisalign Aligner Assessment</option>
                  <option value="Dental Implant Consultation">Dental Implant Consultation</option>
                  <option value="Routine Scaling & Polish">Routine Scaling & Polish</option>
                  <option value="Emergency Consultation">Emergency Consultation</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Administrative Notes</label>
                <textarea 
                  rows={2} value={patNotes} onChange={e => setPatNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-medium)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Confirm Booking</button>
              <button type="button" className="btn btn-secondary" onClick={() => setBookModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
