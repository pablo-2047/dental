import React, { useState, useRef } from 'react';
import { Calendar, Phone, Star, Heart, Award, ArrowRight } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

interface HomeProps {
  setPatientTab: (tab: 'home' | 'services' | 'booking' | 'portal') => void;
}

export const Home: React.FC<HomeProps> = ({ setPatientTab }) => {
  const { services } = useClinic();
  
  // Before/After Smile Slider dragging logic
  const [sliderPosition, setSliderPosition] = useState(50); // percentage
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleSliderMove = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    let percentage = (x / rect.width) * 100;
    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;
    setSliderPosition(percentage);
  };

  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleSliderMove(e.clientX);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleSliderMove(e.touches[0].clientX);
  };

  return (
    <div className="fade-in" style={{ paddingBottom: '80px' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, hsl(172, 40%, 94%) 0%, #ffffff 100%)', 
        padding: '80px 24px 60px',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            background: 'rgba(20, 184, 166, 0.1)', 
            color: 'var(--primary)', 
            padding: '6px 16px', 
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 600,
            marginBottom: '20px'
          }}>
            <Award size={14} /> Top Rated Dental Practice in Mumbai
          </div>
          
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 800, 
            letterSpacing: '-1px', 
            color: 'var(--text-primary)', 
            lineHeight: 1.15,
            marginBottom: '24px'
          }}>
            Experience Dental Care Built Around <span style={{ color: 'var(--primary)' }}>Your Comfort</span>
          </h1>
          
          <p style={{ 
            fontSize: '17px', 
            color: 'var(--text-secondary)', 
            maxWidth: '620px', 
            margin: '0 auto 36px',
            lineHeight: 1.6
          }}>
            We combine warm, anxiety-free hospitality with state-of-the-art guided dental technology. Book your checkup in 2 minutes online.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '15px' }} onClick={() => setPatientTab('booking')}>
              <Calendar size={18} /> Book Appointment
            </button>
            <a href="tel:+919876543210" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '15px' }}>
              <Phone size={18} /> Call +91 98765 43210
            </a>
          </div>

          {/* Stats Bar */}
          <div className="grid-cols-3" style={{ 
            marginTop: '60px', 
            background: '#ffffff', 
            borderRadius: 'var(--radius-lg)', 
            padding: '24px', 
            boxShadow: 'var(--shadow-lg)',
            border: '0.5px solid var(--border-light)'
          }}>
            <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '32px', color: 'var(--primary)', fontWeight: 800 }}>15+</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Years Experience</p>
            </div>
            <div style={{ textAlign: 'center', borderRight: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '32px', color: 'var(--primary)', fontWeight: 800 }}>10,000+</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Happy Smiles</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '32px', color: 'var(--primary)', fontWeight: 800 }}>4.9 ★</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Google Review Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Before/After Smile Slider Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>Real Transformations, Natural Results</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '540px', margin: '0 auto 40px' }}>
            Drag the slider handle to view the immediate full-mouth aesthetic improvement created by our customized porcelain veneers.
          </p>

          <div 
            className="smile-slider-container"
            ref={sliderContainerRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {/* After Image (Full width background) */}
            <img 
              src="https://images.unsplash.com/photo-1516201304180-67e452cd7112?auto=format&fit=crop&q=80&w=800" 
              alt="After veneer treatment" 
              className="smile-image"
            />
            <div className="slider-label label-after">After Veneers</div>

            {/* Before Image (Clipping container) */}
            <div 
              className="smile-before-container"
              style={{ width: `${sliderPosition}%` }}
            >
              <img 
                src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800" 
                alt="Before veneer treatment" 
                className="smile-image"
                style={{ width: sliderContainerRef.current?.getBoundingClientRect().width || 800 }}
              />
              <div className="slider-label label-before">Before Care</div>
            </div>

            {/* Divider Handle */}
            <div 
              className="slider-handle"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            >
              <div className="slider-button">↔</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Showcase Cards */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>Our Dental Specialties</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Comprehensive, gentle treatments utilizing the latest clinical standards.</p>
          </div>

          <div className="grid-cols-3">
            {services.map(svc => (
              <div 
                key={svc.id}
                style={{ 
                  background: '#ffffff', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '24px', 
                  border: '0.5px solid var(--border-light)', 
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'var(--transition-smooth)',
                  cursor: 'pointer'
                }}
                onClick={() => setPatientTab('services')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                  e.currentTarget.style.borderColor = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  e.currentTarget.style.borderColor = 'var(--border-light)';
                }}
              >
                <div>
                  <div style={{ 
                    width: '46px', 
                    height: '46px', 
                    borderRadius: '12px', 
                    background: 'var(--primary-light)', 
                    color: 'var(--primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <Heart size={20} />
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{svc.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
                    {svc.description}
                  </p>
                </div>
                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Est. price:</span>
                  <span style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 600 }}>{svc.priceRange}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <button className="btn btn-secondary" onClick={() => setPatientTab('services')}>
              View Detailed Procedure Guides <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '12px' }}>What Our Patients Say</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Over 800+ 5-star reviews on Google Business. Read certified patient reports.</p>
          </div>

          <div className="grid-cols-3">
            {[
              {
                name: 'Karan Malhotra',
                rating: 5,
                service: 'Cosmetic Consultation',
                text: 'Dr. Sarah Vance completely changed my confidence! The process was incredibly professional. She designed veneers that look completely natural. The office is beautiful.',
                date: '2 weeks ago'
              },
              {
                name: 'Neha Singhal',
                rating: 5,
                service: 'Aligner Assessment',
                text: 'Extremely happy with my clear aligners. Dr. Rostova explained the entire timeline clearly. I love that I can book appointments online, and their reminder system is great!',
                date: '1 month ago'
              },
              {
                name: 'Vijay Dsouza',
                rating: 5,
                service: 'Implant Consultation',
                text: 'I was extremely nervous about getting an oral implant. Dr. Thorne made it feel like a breeze. Minimal pain during recovery, and now it feels exactly like a normal tooth.',
                date: '3 weeks ago'
              }
            ].map((rev, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'var(--bg-secondary)', 
                  border: '0.5px solid var(--border-light)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--warning)', marginBottom: '12px' }}>
                  {[...Array(rev.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '16px', lineHeight: '1.5' }}>
                  "{rev.text}"
                </p>
                <div style={{ borderTop: '0.5px solid var(--border-medium)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600 }}>{rev.name}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Procedure: {rev.service}</p>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance Partners Logos */}
      <section style={{ padding: '40px 24px', backgroundColor: 'var(--bg-secondary)', borderTop: '0.5px solid var(--border-light)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '24px' }}>
            Accepted Insurance & Financing Partners
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '40px', 
            flexWrap: 'wrap',
            opacity: 0.65
          }}>
            <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-muted)' }}>Star Health</span>
            <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-muted)' }}>Niva Bupa</span>
            <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-muted)' }}>HDFC ERGO</span>
            <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-muted)' }}>Care Health</span>
            <span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--text-muted)' }}>Bajaj Finserv (No-Cost EMI)</span>
          </div>
        </div>
      </section>
    </div>
  );
};
