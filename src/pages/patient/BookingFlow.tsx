import React, { useState, useEffect } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Calendar as CalendarIcon, User, Sparkles, Heart, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingFlowProps {
  setPatientTab: (tab: 'home' | 'services' | 'booking' | 'portal') => void;
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ setPatientTab, selectedServiceId, setSelectedServiceId }) => {
  const { dentists, services, appointments, bookAppointment, patients, activePatientId, setActivePatientId } = useClinic();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '',
    dentistId: '',
    date: '',
    timeSlot: '',
    patientName: '',
    patientAge: 26,
    patientPhone: '',
    patientEmail: '',
    notes: ''
  });

  // Pre-fill active patient data if available
  useEffect(() => {
    const activePat = patients.find(p => p.id === activePatientId);
    if (activePat) {
      setFormData(prev => ({
        ...prev,
        patientName: activePat.name,
        patientAge: activePat.age,
        patientPhone: activePat.phone,
        patientEmail: activePat.email
      }));
    }
  }, [activePatientId, patients]);

  // Pre-fill service if navigated from service catalogue
  useEffect(() => {
    if (selectedServiceId) {
      setFormData(prev => ({ ...prev, service: selectedServiceId }));
      // Auto-assign primary doctor for that service
      const matchSvc = services.find(s => s.name === selectedServiceId);
      if (matchSvc) {
        setFormData(prev => ({ ...prev, dentistId: matchSvc.primaryDoctorId }));
      }
    }
  }, [selectedServiceId, services]);

  const [bookedApptDetails, setBookedApptDetails] = useState<any>(null);

  // Calendar setup: next 7 days starting today
  const [dateOptions, setDateOptions] = useState<string[]>([]);
  useEffect(() => {
    const dates = [];
    const today = new Date('2026-05-25'); // Use current system base local date (2026-05-25)
    for (let i = 0; i < 7; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      dates.push(nextDate.toISOString().split('T')[0]);
    }
    setDateOptions(dates);
  }, []);

  const timeSlots = ['09:00 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:30 PM', '05:00 PM'];

  // Helper to check if a specific slot is already taken in the shared schedule database
  const isSlotTaken = (date: string, slot: string, dentistId: string) => {
    return appointments.some(
      appt => 
        appt.date === date && 
        appt.timeSlot === slot && 
        appt.dentistId === dentistId &&
        (appt.status === 'Confirmed' || appt.status === 'Completed' || appt.status === 'Pending')
    );
  };

  const handleNextStep = () => {
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to shared context database
    const booked = bookAppointment({
      patientId: activePatientId,
      patientName: formData.patientName,
      patientAge: formData.patientAge,
      patientPhone: formData.patientPhone,
      patientEmail: formData.patientEmail,
      dentistId: formData.dentistId,
      service: formData.service,
      date: formData.date,
      timeSlot: formData.timeSlot,
      status: 'Pending',
      notes: formData.notes
    });

    setBookedApptDetails(booked);
    
    // Clean up selected navigation service
    setSelectedServiceId('');

    // Play visual victory confetti!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setStep(5);
  };

  const selectedDentistObj = dentists.find(d => d.id === formData.dentistId);
  const getSelectedDayName = () => {
    if (!formData.date) return '';
    const dateObj = new Date(formData.date);
    return dateObj.toLocaleDateString('en-US', { weekday: 'long' });
  };
  const selectedDayName = getSelectedDayName();
  const isDoctorAvailableOnDay = selectedDentistObj ? selectedDentistObj.availableDays.includes(selectedDayName) : true;

  return (
    <div className="fade-in" style={{ maxWidth: '640px', margin: '40px auto 80px', padding: '0 24px' }}>
      
      {/* Step Tracker Indicator */}
      {step < 5 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', flex: s < 4 ? 1 : 'none' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: step >= s ? 'var(--primary)' : 'var(--bg-tertiary)', 
                  color: step >= s ? '#ffffff' : 'var(--text-muted)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '13px',
                  boxShadow: step === s ? 'var(--shadow-glow)' : 'none',
                  border: step === s ? '2px solid #ffffff' : 'none'
                }}
              >
                {s}
              </div>
              {s < 4 && (
                <div 
                  style={{ 
                    flex: 1, 
                    height: '2px', 
                    background: step > s ? 'var(--primary)' : 'var(--border-light)',
                    margin: '0 8px' 
                  }} 
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Multi-Step Box */}
      <div 
        style={{ 
          background: '#ffffff', 
          border: '0.5px solid var(--border-light)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '36px',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Step 1: Select Appointment Type */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={20} style={{ color: 'var(--primary)' }} /> Select Appointment
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Pick a diagnostic consultation. Standard Indian pricing applies; specific treatments are diagnosed and decided upon checkup.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {services.map(svc => (
                <div
                  key={svc.id}
                  onClick={() => {
                    setFormData(prev => ({ 
                      ...prev, 
                      service: svc.name,
                      dentistId: svc.primaryDoctorId // Auto pre-fill primary doctor
                    }));
                  }}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    border: formData.service === svc.name ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                    background: formData.service === svc.name ? 'var(--primary-light)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 600, color: 'var(--text-primary)' }}>{svc.name}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimated Time: {svc.visits}</p>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>{svc.priceRange}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
              <button 
                className="btn btn-primary" 
                disabled={!formData.service} 
                onClick={handleNextStep}
              >
                Choose Dentist <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Choose Doctor */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <User size={20} style={{ color: 'var(--primary)' }} /> Choose Dentist
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
              Select a specialized physician or proceed with the recommended consultation expert.
            </p>
            
            <div style={{ 
              background: 'hsl(172, 40%, 97%)', 
              border: '0.5px solid var(--border-medium)', 
              borderRadius: '8px', 
              padding: '12px 16px', 
              fontSize: '12px', 
              color: 'var(--primary)', 
              marginBottom: '20px',
              lineHeight: 1.4
            }}>
              💡 <strong>Roster Notice:</strong> In Indian clinics, doctors operate on distinct weekly roster days and shift hour blocks. Review their scheduled days and shift times below before choosing.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {dentists.map(doc => (
                <div
                  key={doc.id}
                  onClick={() => setFormData(prev => ({ ...prev, dentistId: doc.id }))}
                  style={{
                    padding: '18px',
                    borderRadius: 'var(--radius-lg)',
                    border: formData.dentistId === doc.id ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                    background: formData.dentistId === doc.id ? 'var(--primary-light)' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    transition: 'var(--transition-fast)',
                    boxShadow: formData.dentistId === doc.id ? 'var(--shadow-sm)' : 'none'
                  }}
                >
                  <img 
                    src={doc.image} 
                    alt={doc.name} 
                    style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #ffffff', boxShadow: 'var(--shadow-sm)' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '14.5px', fontWeight: 650, color: 'var(--text-primary)' }}>{doc.name}</h4>
                      <span style={{ fontSize: '11px', color: '#eab308', fontWeight: 600 }}>★ {doc.rating}</span>
                    </div>
                    <p style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 600, marginBottom: '6px' }}>{doc.specialty}</p>
                    
                    {/* Visual Schedule Badge Box */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ 
                        fontSize: '10.5px', 
                        padding: '3px 8px', 
                        borderRadius: '20px', 
                        background: 'rgba(20, 184, 166, 0.1)', 
                        color: 'var(--primary)', 
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        📅 {doc.availableDays.join(', ')}
                      </span>
                      <span style={{ 
                        fontSize: '10.5px', 
                        padding: '3px 8px', 
                        borderRadius: '20px', 
                        background: 'rgba(59, 130, 246, 0.08)', 
                        color: '#2563eb', 
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        🕒 {doc.shiftName.split(' ')[0]} ({doc.shiftName.substring(doc.shiftName.indexOf('(') + 1, doc.shiftName.indexOf(')'))})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button className="btn btn-secondary" onClick={handlePrevStep}>
                <ChevronLeft size={16} /> Back
              </button>
              <button 
                className="btn btn-primary" 
                disabled={!formData.dentistId} 
                onClick={handleNextStep}
              >
                Pick Date & Time <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Pick Date & Time */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <CalendarIcon size={20} style={{ color: 'var(--primary)' }} /> Select Date & Time
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              Only available slots shown. Schedulers block fully booked doctor intervals.
            </p>

            {/* Date Grid */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
              {dateOptions.map(dStr => {
                const dateObj = new Date(dStr);
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = dateObj.getDate();
                const isSelected = formData.date === dStr;
                return (
                  <button
                    key={dStr}
                    onClick={() => setFormData(prev => ({ ...prev, date: dStr, timeSlot: '' }))}
                    style={{
                      flex: '0 0 70px',
                      padding: '12px 6px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                      background: isSelected ? 'var(--primary-light)' : '#ffffff',
                      color: isSelected ? 'var(--primary)' : 'var(--text-primary)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      outline: 'none'
                    }}
                  >
                    <p style={{ fontSize: '10px', textTransform: 'uppercase', color: isSelected ? 'var(--primary)' : 'var(--text-muted)' }}>{dayName}</p>
                    <p style={{ fontSize: '18px', fontWeight: 800 }}>{dayNum}</p>
                  </button>
                );
              })}
            </div>

            {/* Time Slot Grid */}
            {formData.date ? (
              isDoctorAvailableOnDay ? (
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '10px' }}>Available Slots ({selectedDentistObj?.shiftName})</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {(selectedDentistObj?.availableSlots || timeSlots).map(slot => {
                      const isBooked = isSlotTaken(formData.date, slot, formData.dentistId);
                      const isSelected = formData.timeSlot === slot;
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                          style={{
                            padding: '10px 4px',
                            borderRadius: '8px',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border-light)',
                            background: isSelected ? 'var(--primary-light)' : isBooked ? 'var(--bg-tertiary)' : '#ffffff',
                            color: isSelected ? 'var(--primary)' : isBooked ? 'var(--text-muted)' : 'var(--text-primary)',
                            cursor: isBooked ? 'not-allowed' : 'pointer',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '12px',
                            textDecoration: isBooked ? 'line-through' : 'none'
                          }}
                        >
                          {slot} {isBooked && '(Booked)'}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', padding: '14px', color: '#991b1b', fontSize: '12.5px', marginBottom: '20px', textAlign: 'left' }}>
                  ⚠️ <strong>Unavailable on {selectedDayName}s:</strong> Dr. {selectedDentistObj?.name.split(' ').pop()} is not scheduled on this day. Their roster days are: <strong>{selectedDentistObj?.availableDays.join(', ')}</strong>. Please select another date above.
                </div>
              )
            ) : (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0', fontSize: '13px' }}>
                Please select an appointment date from the carousel first.
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button className="btn btn-secondary" onClick={handlePrevStep}>
                <ChevronLeft size={16} /> Back
              </button>
              <button 
                className="btn btn-primary" 
                disabled={!formData.date || !formData.timeSlot || !isDoctorAvailableOnDay} 
                onClick={handleNextStep}
              >
                Patient Details <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Patient Details */}
        {step === 4 && (
          <form onSubmit={handleSubmitBooking}>
            <h2 style={{ fontSize: '22px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Heart size={20} style={{ color: 'var(--primary)' }} /> Patient Details
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
              Review your details to establish/link your secure patient record.
            </p>

            {/* Quick Demo Login Option in Booking Flow */}
            {!activePatientId ? (
              <div style={{
                background: 'var(--primary-light)',
                border: '1px dashed var(--primary)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600, marginBottom: '8px' }}>
                  🔒 Already registered? Click to log in & auto-fill details:
                </p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {patients.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActivePatientId(p.id)}
                      className="btn btn-secondary"
                      style={{
                        padding: '6px 12px',
                        fontSize: '11px',
                        borderRadius: '20px',
                        border: '1.5px solid var(--border-medium)',
                        background: '#ffffff'
                      }}
                    >
                      👤 {p.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid #4ade80',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                marginBottom: '20px',
                fontSize: '12.5px',
                color: '#15803d',
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>✅ Connected to secure profile: {formData.patientName} ({formData.patientEmail})</span>
                <button
                  type="button"
                  onClick={() => setActivePatientId('')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '11px',
                    textDecoration: 'underline'
                  }}
                >
                  Change Profile 🔓
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="grid-cols-2" style={{ gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.patientName} 
                    onChange={e => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Age</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.patientAge} 
                    onChange={e => setFormData(prev => ({ ...prev, patientAge: parseInt(e.target.value) || 0 }))}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Phone Number</label>
                <input 
                  type="tel" 
                  required 
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.patientPhone} 
                  onChange={e => setFormData(prev => ({ ...prev, patientPhone: e.target.value }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Email Address</label>
                <input 
                  type="email" 
                  required 
                  value={formData.patientEmail} 
                  onChange={e => setFormData(prev => ({ ...prev, patientEmail: e.target.value }))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px', fontWeight: 600 }}>Describe dental concern (optional)</label>
                <textarea 
                  rows={3}
                  value={formData.notes} 
                  onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. Tooth sensitivity in upper molar, routine cleaning..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-medium)', outline: 'none', fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
              <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                <ChevronLeft size={16} /> Back
              </button>
              <button type="submit" className="btn btn-accent">
                <CheckCircle size={16} /> Confirm Booking
              </button>
            </div>
          </form>
        )}

        {/* Step 5: Success Splash */}
        {step === 5 && bookedApptDetails && (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--primary-light)',
              color: 'var(--success)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <CheckCircle size={36} />
            </div>

            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Appointment Requested!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13.5px', marginBottom: '24px', lineHeight: 1.5 }}>
              Your reservation has been created and synced with the doctor's calendar. A clinical verification notification was dispatched.
            </p>

            {/* Receipt Summary Box */}
            <div style={{
              background: 'var(--bg-secondary)',
              border: '0.5px solid var(--border-light)',
              borderRadius: 'var(--radius-md)',
              padding: '20px',
              textAlign: 'left',
              marginBottom: '24px'
            }}>
              <h4 style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '12px' }}>
                Summary Details
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
                <p><strong>Patient:</strong> {bookedApptDetails.patientName} (Age: {bookedApptDetails.patientAge})</p>
                <p><strong>Service:</strong> {bookedApptDetails.service}</p>
                <p><strong>Dentist:</strong> {selectedDentistObj?.name || 'General Doctor'}</p>
                <p><strong>Schedule:</strong> {bookedApptDetails.date} at {bookedApptDetails.timeSlot}</p>
                <p><strong>Status:</strong> <span className="pill pill-new">Pending Verification</span></p>
              </div>
            </div>

            {/* Notification Preview */}
            <div style={{
              background: '#f8fafc',
              borderLeft: '4px solid var(--primary)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-sm)',
              textAlign: 'left',
              fontSize: '11.5px',
              color: 'var(--text-secondary)',
              marginBottom: '30px'
            }}>
              <p style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: '4px' }}>🔔 SMS Receipt Preview</p>
              <p>"Hi {bookedApptDetails.patientName}, your appointment with {selectedDentistObj?.name} for {bookedApptDetails.service} is registered on {bookedApptDetails.date} at {bookedApptDetails.timeSlot}. Show this SMS at reception on arrival."</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button 
                className="btn btn-primary" 
                onClick={() => setPatientTab('portal')}
              >
                Open Patient Portal ➡️
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setPatientTab('home')}
              >
                Back to Homepage
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
