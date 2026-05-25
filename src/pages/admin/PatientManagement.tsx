import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Search, ShieldAlert, Send, Upload, Image, User, CheckCircle2 } from 'lucide-react';

export const PatientManagement: React.FC = () => {
  const { patients, appointments, messages, sendClinicMessage, uploadXRayToPatient } = useClinic();
  const [selectedPatId, setSelectedPatId] = useState<string>('pat-1'); // Hammad Raza default
  const [searchQuery, setSearchQuery] = useState('');
  const [clinicReply, setClinicReply] = useState('');

  // Preset high fidelity dental X-rays for mock upload demo
  const xrayPresets = [
    'https://images.unsplash.com/photo-1579684389824-6501a35c138b?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
    'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
  ];

  const filteredPatients = patients.filter(pat => 
    pat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pat.phone.includes(searchQuery) ||
    pat.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPatient = patients.find(p => p.id === selectedPatId) || patients[0];

  const handleSendClinicReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicReply.trim()) return;
    sendClinicMessage(clinicReply, 'clinic');
    setClinicReply('');
  };

  const handleMockUploadXray = () => {
    if (!selectedPatient) return;
    
    // Pick a random X-ray preset image link
    const randomIdx = Math.floor(Math.random() * xrayPresets.length);
    const xrayUrl = xrayPresets[randomIdx];

    uploadXRayToPatient(selectedPatient.id, xrayUrl);
    alert(`Mock Panoramic Radiograph successfully uploaded to ${selectedPatient.name}'s file and synced with Patient Portal.`);
  };

  const patientAppointments = appointments.filter(a => a.patientId === selectedPatient?.id);

  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '30px', alignItems: 'flex-start' }}>
      
      {/* Left Patient Index Column */}
      <div style={{
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Patient Index</h3>
        
        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="Search name, phone, email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 30px',
              borderRadius: '6px',
              border: '1px solid var(--border-medium)',
              background: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              fontSize: '12px',
              outline: 'none'
            }}
          />
          <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        </div>

        {/* Patient Rows List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '420px', overflowY: 'auto' }}>
          {filteredPatients.map(pat => (
            <button
              key={pat.id}
              onClick={() => setSelectedPatId(pat.id)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                textAlign: 'left',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                background: selectedPatId === pat.id ? 'var(--primary-light)' : 'transparent',
                color: selectedPatId === pat.id ? 'var(--primary)' : 'var(--text-primary)',
                transition: 'var(--transition-fast)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{pat.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {pat.id} | Phone: {pat.phone}</span>
            </button>
          ))}
          {filteredPatients.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '12px' }}>
              No patients matched search criteria.
            </div>
          )}
        </div>
      </div>

      {/* Right Patient Profile Inspector Workspace */}
      {selectedPatient ? (
        <div style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-lg)',
          padding: '30px',
          boxShadow: 'var(--shadow-md)',
          display: 'flex',
          flexDirection: 'column',
          gap: '30px'
        }}>
          
          {/* Header Details */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '18px'
              }}>
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <h2 style={{ fontSize: '20px', fontWeight: 700 }}>{selectedPatient.name} (Age: {selectedPatient.age})</h2>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>Email: {selectedPatient.email} | Phone: {selectedPatient.phone}</p>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: '12px' }} onClick={handleMockUploadXray}>
                <Upload size={14} /> Upload Radiograph (X-ray)
              </button>
            </div>
          </div>

          {/* Clinical Record File Body */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '30px', alignItems: 'flex-start' }}>
            
            {/* Column 1: History & X-rays */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={16} style={{ color: 'var(--primary)' }} /> Clinical intake summary
                </h3>
                <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-light)', fontSize: '12.5px' }}>
                  <p style={{ marginBottom: '8px' }}><strong>Medical History:</strong> {selectedPatient.medicalHistory}</p>
                  <p style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={14} /> <strong>Allergy Alert:</strong> {selectedPatient.allergies}
                  </p>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px' }}>Treatment Timeline History</h3>
                {patientAppointments.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {patientAppointments.map(appt => (
                      <div 
                        key={appt.id} 
                        style={{ 
                          background: 'var(--bg-primary)', 
                          padding: '12px 16px', 
                          borderRadius: '8px', 
                          border: '1px solid var(--border-light)', 
                          fontSize: '12.5px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <p style={{ fontWeight: 600 }}>{appt.service}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Date: {appt.date} | Status: <strong>{appt.status}</strong></p>
                          {appt.notes && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>Note: "{appt.notes}"</p>}
                        </div>
                        {appt.status === 'Completed' && <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12.5px', border: '1px dashed var(--border-medium)', borderRadius: '8px' }}>
                    No recorded appointment sessions discovered.
                  </div>
                )}
              </div>

              {/* Patient X-rays */}
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Image size={16} style={{ color: 'var(--primary)' }} /> Panoramic Radiographs
                </h3>
                {selectedPatient.xrays.length > 0 ? (
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {selectedPatient.xrays.map((xr, idx) => (
                      <div 
                        key={idx} 
                        style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-medium)', background: '#000' }}
                      >
                        <img src={xr} alt="Radiograph file" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', border: '1px dashed var(--border-medium)', borderRadius: '8px' }}>
                    No radiograph scans uploaded for this patient.
                  </div>
                )}
              </div>

            </div>

            {/* Column 2: Direct Support Messenger Thread */}
            <div style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              height: '380px'
            }}>
              <h4 style={{ fontSize: '13.5px', fontWeight: 700, borderBottom: '1px solid var(--border-light)', paddingBottom: '8px', marginBottom: '12px' }}>
                Secure Live Chat Responder
              </h4>
              
              {/* Message loop */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '8px',
                background: 'var(--bg-secondary)',
                border: '0.5px solid var(--border-light)',
                borderRadius: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                marginBottom: '12px'
              }}>
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className="fade-in"
                    style={{
                      maxWidth: '85%',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      lineHeight: 1.35,
                      alignSelf: msg.sender === 'clinic' ? 'flex-end' : 'flex-start',
                      background: msg.sender === 'clinic' ? 'var(--primary)' : 'var(--bg-primary)',
                      color: msg.sender === 'clinic' ? '#ffffff' : 'var(--text-primary)',
                      borderBottomRightRadius: msg.sender === 'clinic' ? '2px' : '10px',
                      borderBottomLeftRadius: msg.sender === 'patient' ? '2px' : '10px',
                      boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
                      border: msg.sender === 'patient' ? '0.5px solid var(--border-medium)' : 'none'
                    }}
                  >
                    <p>{msg.text}</p>
                    <span style={{ 
                      display: 'block', 
                      fontSize: '8px', 
                      color: msg.sender === 'clinic' ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)',
                      textAlign: 'right',
                      marginTop: '3px' 
                    }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>

              {/* Chat Reply Form */}
              <form onSubmit={handleSendClinicReply} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder={`Reply to ${selectedPatient.name}...`}
                  value={clinicReply}
                  onChange={e => setClinicReply(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-medium)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 12px', borderRadius: '6px' }}>
                  <Send size={12} />
                </button>
              </form>
            </div>

          </div>

        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
          Please select a patient from the index bar to review records.
        </div>
      )}
    </div>
  );
};
