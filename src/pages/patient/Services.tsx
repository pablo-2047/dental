import React, { useState } from 'react';
import { useClinic } from '../../context/ClinicContext';
import { Shield, Clock, HelpCircle, User, Sparkles } from 'lucide-react';

interface ServicesProps {
  setPatientTab: (tab: 'home' | 'services' | 'booking' | 'portal') => void;
  setSelectedServiceId: (id: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ setPatientTab, setSelectedServiceId }) => {
  const { services, dentists } = useClinic();
  const [activeCategory, setActiveCategory] = useState<'all' | 'cosmetic' | 'implant' | 'ortho' | 'general' | 'emergency'>('all');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<string | null>(null);

  const filteredServices = services.filter(svc => {
    if (activeCategory === 'all') return true;
    return svc.category === activeCategory;
  });

  const handleBookService = (serviceName: string) => {
    setSelectedServiceId(serviceName);
    setPatientTab('booking');
  };

  const toggleFaq = (faqKey: string) => {
    if (expandedFaqIndex === faqKey) {
      setExpandedFaqIndex(null);
    } else {
      setExpandedFaqIndex(faqKey);
    }
  };

  return (
    <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>Clinical Procedures & Services</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto' }}>
          Transparent pricing, experienced specialists, and modern digital mapping. Filter treatments below to read procedure guides and FAQs.
        </p>
      </div>

      {/* Category Tabs */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '8px', 
        flexWrap: 'wrap', 
        marginBottom: '40px',
        borderBottom: '1px solid var(--border-light)',
        paddingBottom: '16px'
      }}>
        {[
          { key: 'all', label: 'All Services' },
          { key: 'cosmetic', label: 'Cosmetic' },
          { key: 'implant', label: 'Implants & Surgery' },
          { key: 'ortho', label: 'Aligners/Ortho' },
          { key: 'general', label: 'General Hygiene' },
          { key: 'emergency', label: 'Emergency' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key as any)}
            className="btn"
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              borderRadius: '20px',
              background: activeCategory === cat.key ? 'var(--primary-light)' : 'transparent',
              color: activeCategory === cat.key ? 'var(--primary)' : 'var(--text-secondary)',
              border: activeCategory === cat.key ? '1px solid var(--primary)' : '1px solid transparent',
              fontWeight: activeCategory === cat.key ? 700 : 500
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Services List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {filteredServices.map(svc => {
          const doctor = dentists.find(d => d.id === svc.primaryDoctorId);
          return (
            <div
              key={svc.id}
              style={{
                background: '#ffffff',
                border: '0.5px solid var(--border-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '30px',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}
            >
              {/* Service Meta Title */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '22px', color: 'var(--text-primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {svc.name}
                    {svc.category === 'cosmetic' && <Sparkles size={16} style={{ color: 'var(--primary)' }} />}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', marginTop: '6px', lineHeight: 1.5 }}>
                    {svc.description}
                  </p>
                </div>
                <button className="btn btn-primary" onClick={() => handleBookService(svc.name)}>
                  Book Treatment
                </button>
              </div>

              {/* Specific procedure details strip */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '12px',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '0.5px solid var(--border-light)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={16} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Price Range</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>{svc.priceRange}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} style={{ color: 'var(--primary)' }} />
                  <div>
                    <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Procedure Time</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>{svc.visits}</p>
                  </div>
                </div>
                {doctor && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <User size={16} style={{ color: 'var(--primary)' }} />
                    <div>
                      <p style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Lead Dentist</p>
                      <p style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 600 }}>{doctor.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Primary Doctor Subcard */}
              {doctor && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  borderTop: '0.5px solid var(--border-light)', 
                  paddingTop: '20px',
                  flexWrap: 'wrap'
                }}>
                  <img 
                    src={doctor.image} 
                    alt={doctor.name} 
                    style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, minWidth: '220px' }}>
                    <h4 style={{ fontSize: '13.5px', fontWeight: 600 }}>Procedure Specialist: {doctor.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      Educated at <span style={{ fontWeight: 500 }}>{doctor.education}</span>. {doctor.bio}
                    </p>
                  </div>
                </div>
              )}

              {/* FAQ Accordions for this service */}
              {svc.faq.length > 0 && (
                <div style={{ borderTop: '0.5px solid var(--border-light)', paddingTop: '20px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '12px' }}>
                    Frequently Asked Questions
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {svc.faq.map((faq, i) => {
                      const faqKey = `${svc.id}-${i}`;
                      const isExpanded = expandedFaqIndex === faqKey;
                      return (
                        <div
                          key={i}
                          style={{
                            border: '0.5px solid var(--border-light)',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            transition: 'var(--transition-fast)'
                          }}
                        >
                          <button
                            onClick={() => toggleFaq(faqKey)}
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              textAlign: 'left',
                              background: isExpanded ? 'var(--primary-light)' : 'transparent',
                              border: 'none',
                              outline: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontWeight: 500,
                              fontSize: '13px',
                              color: isExpanded ? 'var(--primary)' : 'var(--text-primary)'
                            }}
                          >
                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <HelpCircle size={14} /> {faq.q}
                            </span>
                            <span>{isExpanded ? '−' : '+'}</span>
                          </button>
                          {isExpanded && (
                            <div style={{
                              padding: '12px 16px',
                              fontSize: '12.5px',
                              color: 'var(--text-secondary)',
                              background: '#ffffff',
                              borderTop: '0.5px solid var(--border-light)',
                              lineHeight: 1.5
                            }}>
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
